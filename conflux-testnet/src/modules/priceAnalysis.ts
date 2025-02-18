import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import { Candlestick, TokenSale } from "../../generated/schema"
import { Sync } from "../../generated/TokenSaleFactory/TokenSaleFactory"
import { INTERVALS, HUNDRED_BD, TOKEN_FOR_SALE_BALANCE, ZERO, ZERO_BD } from "./constants"
import { getIntervalStartTime, convert25To18BigDecimal } from "./utils"

export function calculate24HourMetrics(event: Sync, tokenSale: TokenSale): void {
    let currentTimestamp = event.block.timestamp
    let twentyFourHoursAgo = currentTimestamp.minus(BigInt.fromI32(86400))

    let startCandlestick = findNearestCandlestick(event.params.token, twentyFourHoursAgo, currentTimestamp)
    if (startCandlestick == null) {
        tokenSale.last24HourBnbVolume = ZERO
        tokenSale.last24HourTokenVolume = ZERO
        tokenSale.last24HourUSDVolume = ZERO
        tokenSale.price24hChange = ZERO.toBigDecimal()
        return // Не удалось найти начальную свечу
    }

    // Расчет изменения цены за 24 часа
    let startPrice = startCandlestick.open
    let endPrice = convert25To18BigDecimal(event.params.endPrice)
    tokenSale.price24hChange = calculatePriceChange(startPrice, endPrice)

    // Инициализация переменных для объемов
    let bnbVolume = startCandlestick.bnbVolume
    let tokenVolume = startCandlestick.tokensSold.plus(startCandlestick.tokensBought)
    let usdVolume = startCandlestick.usdVolume

    // Подсчет объемов
    let startIndex = INTERVALS.indexOf(startCandlestick.interval)
    let startTime = startCandlestick.timestamp.plus(getIntervalSeconds(startCandlestick.interval))
    for (let i = startIndex; i < INTERVALS.length; i++) {
        let interval = INTERVALS[i]
        let nextInterval = i == INTERVALS.length-1 ? interval : INTERVALS[i+1]
        // startTime = startTime.plus(getIntervalSeconds(interval))
        let endTime = getIntervalStartTime(startTime.plus(getIntervalSeconds(nextInterval)), nextInterval)
        // let endTime = i == 0 ? currentTimestamp : getIntervalStartTime(currentTimestamp, INTERVALS[i-1])

        while (startTime.lt(endTime)) {
            let candlestickId = event.params.token.toHexString() + "-" + interval + "-" + startTime.toString()
            let candlestick = Candlestick.load(candlestickId)

            if (candlestick) {
                bnbVolume = bnbVolume.plus(candlestick.bnbBuyVolume).plus(candlestick.bnbSellVolume)
                tokenVolume = tokenVolume.plus(candlestick.tokensBought).plus(candlestick.tokensSold)
                usdVolume = usdVolume.plus(candlestick.usdBuyVolume).plus(candlestick.usdSellVolume)
            }

            startTime = startTime.plus(getIntervalSeconds(interval))
        }
    }

    // Обновление метрик TokenSale
    tokenSale.last24HourBnbVolume = bnbVolume
    tokenSale.last24HourTokenVolume = tokenVolume
    tokenSale.last24HourUSDVolume = usdVolume
    tokenSale.save()
}

function getInitialInterval(startTimestamp: BigInt, endTimestamp: BigInt): string {
    let difference = endTimestamp.minus(startTimestamp)

    if (difference.le(BigInt.fromI32(24 * 60 * 60))) { // <= 1 day
        return "4h"
    } else if (difference.le(BigInt.fromI32(4 * 60 * 60))) { // <= 4 hours
        return "1h"
    } else if (difference.le(BigInt.fromI32(60 * 60))) { // <= 1 hour
        return "15m"
    } else if (difference.le(BigInt.fromI32(15 * 60))) { // <= 15 minutes
        return "5m"
    } else {
        return "1m"
    }
}

function findNearestCandlestick(token: Address, startTimestamp: BigInt, endTimestamp: BigInt): Candlestick | null {
    let initialInterval = getInitialInterval(startTimestamp, endTimestamp)
    let startIndex = INTERVALS.indexOf(initialInterval)

    startTimestamp = getIntervalStartTime(startTimestamp, initialInterval)
    let candlestick: Candlestick | null = null
    for (let i = startIndex; i >= 0; i--) {
        let currentInterval = INTERVALS[i]

        while (startTimestamp.le(endTimestamp)) {
            let candlestickId = token.toHexString() + "-" + currentInterval + "-" + startTimestamp.toString()
            candlestick = Candlestick.load(candlestickId)
            if (candlestick) {
                if (i>0) {
                    let nextInterval = INTERVALS[i-1]
                    startTimestamp = candlestick.timestamp.plus(BigInt.fromI32(1))
                    endTimestamp = getIntervalStartTime(startTimestamp, nextInterval)
                }
                break
            }
            startTimestamp = startTimestamp.plus(getIntervalSeconds(currentInterval))
        }
    }

    if (candlestick) {
        return candlestick
    }

    return null
}


function findNearestCandlestickWithInterwal(token: Address, startTimestamp: BigInt, endTimestamp: BigInt, interval: string): Candlestick | null {
        let candlestickTimestamp = getIntervalStartTime(startTimestamp, interval)

        while (candlestickTimestamp.le(endTimestamp)) {
            let candlestickId = token.toHexString() + "-" + interval + "-" + candlestickTimestamp.toString()
            let candlestick = Candlestick.load(candlestickId)

            if (candlestick) {
                return candlestick
            }

            candlestickTimestamp = candlestickTimestamp.plus(getIntervalSeconds(interval))
        }

    return null
}





function getIntervalSeconds(interval: string): BigInt {
    if (interval == "4h") return BigInt.fromI32(14400)
    if (interval == "1h") return BigInt.fromI32(3600)
    if (interval == "15m") return BigInt.fromI32(900)
    if (interval == "5m") return BigInt.fromI32(300)
    return BigInt.fromI32(60) // 1m
}

function calculatePriceChange(oldPrice: BigDecimal, newPrice: BigDecimal): BigDecimal {
    if (oldPrice.equals(ZERO_BD)) {
        return ZERO_BD
    }
    return newPrice.minus(oldPrice).div(oldPrice).times(HUNDRED_BD)
}

export function calculateLastHourChange(token: Address, currentTimestamp: BigInt): BigDecimal {
    let endTimestamp = getIntervalStartTime(currentTimestamp, '1m').minus(BigInt.fromI32(3600))
    let totalBought = ZERO
    let totalSold = ZERO

    for (let i = 0; i < 60; i++) {
        let minuteAgo = endTimestamp.minus(BigInt.fromI32(60 * i))
        let candlestickId = token.toHexString() + "-1m-" + minuteAgo.toString()

        let candlestick = Candlestick.load(candlestickId)
        if (candlestick) {
            totalBought = totalBought.plus(candlestick.tokensBought)
            totalSold = totalSold.plus(candlestick.tokensSold)
        }
    }

    let netChange = totalBought.minus(totalSold)
    if (netChange.equals(ZERO)) {
        return ZERO_BD
    }
    return netChange.toBigDecimal()
        .div(TOKEN_FOR_SALE_BALANCE.toBigDecimal())
        .times(HUNDRED_BD)
}