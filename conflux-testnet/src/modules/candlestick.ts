import {Address, BigDecimal, BigInt} from "@graphprotocol/graph-ts";
import {Candlestick, TokenSale} from "../../generated/schema";
import {Sync} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import {convert25To18BigDecimal, convertBnbToUsd, getIntervalStartTime} from "./utils";
import {ZERO, ZERO_BD, INTERVALS} from "./constants";

export function getOrCreateCandlestick(
    tokenSaleId: string,
    interval: string,
    timestamp: BigInt,
    startPrice: BigDecimal
): Candlestick {
    let candlestickId = tokenSaleId + "-" + interval + "-" + timestamp.toString()
    let candlestick = Candlestick.load(candlestickId)

    if (candlestick == null) {
        candlestick = new Candlestick(candlestickId)
        candlestick.tokenSale = tokenSaleId
        candlestick.interval = interval
        candlestick.timestamp = timestamp
        candlestick.open = startPrice
        candlestick.high = startPrice
        candlestick.low = startPrice
        candlestick.close = startPrice
        candlestick.bnbVolume = ZERO
        candlestick.usdVolume = ZERO
        candlestick.tokensBought = ZERO
        candlestick.tokensSold = ZERO
        candlestick.bnbBuyVolume = ZERO
        candlestick.bnbSellVolume = ZERO
        candlestick.usdBuyVolume = ZERO
        candlestick.usdSellVolume = ZERO
        candlestick.save()
    }

    return candlestick as Candlestick
}

export function updateCandlestick(candlestick: Candlestick, event: Sync, isBuy: boolean): void {
    // let startPrice = convert25To18BigDecimal(event.params.startPrice)
    let endPrice = convert25To18BigDecimal(event.params.endPrice)


    candlestick.close = endPrice
    if (endPrice.gt(candlestick.high)) {
        candlestick.high = endPrice
    }
    if (endPrice.lt(candlestick.low)) {
        candlestick.low = endPrice
    }

    candlestick.bnbVolume = candlestick.bnbVolume.plus(event.params.bnbAmount)
    let usdAmount = convertBnbToUsd(event.params.bnbAmount)
    candlestick.usdVolume = candlestick.usdVolume.plus(usdAmount)

    if (isBuy) {
        candlestick.tokensBought = candlestick.tokensBought.plus(event.params.tokenAmount)
        candlestick.bnbBuyVolume = candlestick.bnbBuyVolume.plus(event.params.bnbAmount)
        candlestick.usdBuyVolume = candlestick.usdBuyVolume.plus(usdAmount)
    } else {
        candlestick.tokensSold = candlestick.tokensSold.plus(event.params.tokenAmount)
        candlestick.bnbSellVolume = candlestick.bnbSellVolume.plus(event.params.bnbAmount)
        candlestick.usdSellVolume = candlestick.usdSellVolume.plus(usdAmount)
    }
}


export function updateCandlestickFromPancakeSwap(
    candlestick: Candlestick,
    bnbAmount: BigInt,
    tokenAmount: BigInt,
    newPrice: BigDecimal,
    isBuy: boolean
): void {
    candlestick.close = newPrice
    if (newPrice.gt(candlestick.high)) {
        candlestick.high = newPrice
    }
    if (newPrice.lt(candlestick.low)) {
        candlestick.low = newPrice
    }

    candlestick.bnbVolume = candlestick.bnbVolume.plus(bnbAmount)
    let usdAmount = convertBnbToUsd(bnbAmount)
    candlestick.usdVolume = candlestick.usdVolume.plus(usdAmount)

    if (isBuy) {
        candlestick.tokensBought = candlestick.tokensBought.plus(tokenAmount)
        candlestick.bnbBuyVolume = candlestick.bnbBuyVolume.plus(bnbAmount)
        candlestick.usdBuyVolume = candlestick.usdBuyVolume.plus(usdAmount)
    } else {
        candlestick.tokensSold = candlestick.tokensSold.plus(tokenAmount)
        candlestick.bnbSellVolume = candlestick.bnbSellVolume.plus(bnbAmount)
        candlestick.usdSellVolume = candlestick.usdSellVolume.plus(usdAmount)
    }
}
