import { Swap as UniswapV2Swap, Sync as UniswapV2Sync} from "../../generated/templates/PancakePool/UniswapV2Pair"
import {TokenSale, Swap, RawPancakeSwapEvent, PancakeSwapPool} from "../../generated/schema"
import {BigDecimal, BigInt, log} from "@graphprotocol/graph-ts"
import { updateCandlestickFromPancakeSwap, getOrCreateCandlestick } from './candlestick'
//import { updateUserStatistics } from './userStatistics'
import {ZERO, WBNB_ADDRESS, INTERVALS, INITIAL_REAL_TOKEN_BALANCE, DECIMAL_FACTOR} from './constants'
import {TokenSaleCreated} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import {
    convertBnbToUsd,
    getBnbPriceInUsd,
    getIntervalStartTime,
    getPoolKey,
    predictPancakePoolV3Address
} from "./utils";
import {PancakePool} from "../../generated/templates";
import {getOrCreateReferrer, getOrCreateUser} from "./entities";


export function processUniswapV2PairSync(event: UniswapV2Sync): void {
    let PancakeSwapPoolAddress = event.address.toHexString()
    let pancakeSwapPool = PancakeSwapPool.load(PancakeSwapPoolAddress)
    if (pancakeSwapPool == null) {
        return;
    }

    pancakeSwapPool.reserve0 = event.params.reserve0
    pancakeSwapPool.reserve1 = event.params.reserve1

    pancakeSwapPool.save()


}



export function processUniswapV2PairSwap(event: UniswapV2Swap): void {
    let PancakeSwapPoolAddress = event.address.toHexString()
    let pancakeSwapPool = PancakeSwapPool.load(PancakeSwapPoolAddress)
    if (pancakeSwapPool == null) {
        return;
    }

    let tokenSale = TokenSale.load(pancakeSwapPool.tokenSale)
    if (tokenSale == null) {
        return
    }

    let isBuy: boolean
    let bnbAmount: BigInt
    let tokenAmount: BigInt

    let isToken0 = false

    // В Uniswap V2 amount0In и amount0Out определяют направление свапа
    if (pancakeSwapPool.token0.toHexString() == tokenSale.id) {
        isToken0 = true
        // Если amount0In > 0, это продажа токена
        isBuy = event.params.amount1In.equals(BigInt.fromI32(0))
        tokenAmount = event.params.amount0In.gt(BigInt.fromI32(0))
            ? event.params.amount0In
            : event.params.amount0Out
        bnbAmount = event.params.amount1In.gt(BigInt.fromI32(0))
            ? event.params.amount1In
            : event.params.amount1Out
    } else {
        // Если amount1In > 0, это продажа токена
        isBuy = event.params.amount0In.equals(BigInt.fromI32(0))
        tokenAmount = event.params.amount1In.gt(BigInt.fromI32(0))
            ? event.params.amount1In
            : event.params.amount1Out
        bnbAmount = event.params.amount0In.gt(BigInt.fromI32(0))
            ? event.params.amount0In
            : event.params.amount0Out
    }


    // Сначала получаем значения резервов с проверкой на null
    let reserve0 = pancakeSwapPool.reserve0 ? pancakeSwapPool.reserve0 : BigInt.fromI32(0)
    let reserve1 = pancakeSwapPool.reserve1 ? pancakeSwapPool.reserve1 : BigInt.fromI32(0)

// Теперь определяем poolTokenAmount и poolBNBAmount на основе isToken0
    let poolTokenAmount = isToken0 ? reserve0 : reserve1
    let poolBNBAmount = isToken0 ? reserve1 : reserve0

// В Uniswap V2 цена рассчитывается как отношение резервов
    let newPrice = BigInt.fromString(
        poolBNBAmount.toBigDecimal()
            .times(DECIMAL_FACTOR.toBigDecimal())
            .div(poolTokenAmount.toBigDecimal())
            .truncate(0)
            .toString()
    )

    // Обновляем статистику TokenSale
    tokenSale.totalBnbVolume = tokenSale.totalBnbVolume.plus(bnbAmount)
    tokenSale.totalTokenVolume = tokenSale.totalTokenVolume.plus(tokenAmount)
    tokenSale.swapsCount = tokenSale.swapsCount.plus(BigInt.fromI32(1))
    tokenSale.bnbMarketCap = BigInt.fromString(INITIAL_REAL_TOKEN_BALANCE.times(newPrice).toBigDecimal().div(DECIMAL_FACTOR.toBigDecimal()).truncate(0).toString())



    // Обновляем статистику пользователя
    let user = getOrCreateUser(event.transaction.from.toHexString(), false, event.block.timestamp)
    let usdAmount = convertBnbToUsd(bnbAmount)

    user.totalTradesCount = user.totalTradesCount.plus(BigInt.fromI32(1))
    user.totalVolumeBNB = user.totalVolumeBNB.plus(bnbAmount)
    user.totalVolumeUSD = user.totalVolumeUSD.plus(usdAmount)

    if (isBuy) {
        user.totalBuyVolumeBNB = user.totalBuyVolumeBNB.plus(bnbAmount)
    } else {
        user.totalSellVolumeBNB = user.totalSellVolumeBNB.plus(bnbAmount)
    }

    user.save()

    // Создаем новый Swap
    let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    let bnbPrice = getBnbPriceInUsd()
    let swap = new Swap(swapId)
    swap.tokenSale = tokenSale.id
    swap.user = user.id
    swap.isBuy = isBuy
    swap.bnbAmount = bnbAmount
    swap.usdAmount = convertBnbToUsd(bnbAmount)
    swap.bnbPrice = BigInt.fromString(bnbPrice.truncate(0).toString())
    swap.tokenAmount = tokenAmount
    swap.bnbFee = BigInt.fromI32(0)
    swap.daoFee = BigInt.fromI32(0)
    swap.referrerCommission = BigInt.fromI32(0)
    swap.timestamp = event.block.timestamp
    swap.transactionHash = event.transaction.hash
    swap.source = "PancakeSwap"
    swap.save()

    // Обновляем свечи для всех интервалов
    for (let i = 0; i < INTERVALS.length; i++) {
        let interval = INTERVALS[i]
        let timestamp = getIntervalStartTime(event.block.timestamp, interval)
        let candlestick = getOrCreateCandlestick(tokenSale.id, interval, timestamp, tokenSale.lastPrice.toBigDecimal())
        updateCandlestickFromPancakeSwap(candlestick, bnbAmount, tokenAmount, newPrice.toBigDecimal(), isBuy)
        candlestick.save()
    }

    tokenSale.lastPrice = newPrice
    tokenSale.save()
}
//
// function calculatePrice(sqrtPriceX96: BigInt, isToken0: boolean): BigInt {
//     let price = sqrtPriceX96.times(sqrtPriceX96).times(BigInt.fromI32(10).pow(18))
//         .div(BigInt.fromI32(2).pow(192))
//
//     if (!isToken0) {
//         // Если наш токен не token0, нам нужно инвертировать цену
//         price = BigInt.fromI32(10).pow(36).div(price)
//     }
//
//     return price
// }
//
// function updateTokenSaleStatistics(tokenSale: TokenSale, bnbAmount: BigInt, tokenAmount: BigInt, newPrice: BigInt): void {
//     tokenSale.totalBnbVolume = tokenSale.totalBnbVolume.plus(bnbAmount)
//     tokenSale.totalTokenVolume = tokenSale.totalTokenVolume.plus(tokenAmount)
//     tokenSale.swapsCount = tokenSale.swapsCount.plus(BigInt.fromI32(1))
//     tokenSale.lastPrice = newPrice
// }
//
// function createSwapEntity(event: UniswapV2Swap, tokenSale: TokenSale, isBuy: boolean, bnbAmount: BigInt, tokenAmount: BigInt): void {
//     let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
//     let swap = new Swap(swapId)
//     swap.tokenSale = tokenSale.id
//     swap.user = event.transaction.from.toHexString()
//     swap.isBuy = isBuy
//     swap.bnbAmount = bnbAmount
//     swap.tokenAmount = tokenAmount
//     swap.timestamp = event.block.timestamp
//     swap.transactionHash = event.transaction.hash
//     swap.source = "pancake"
//     swap.save()
// }

// export function handleRawPancakeSwap(event: PancakeSwap): void {
//     let rawEventId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
//     let rawEvent = new RawPancakeSwapEvent(rawEventId)
//
//     rawEvent.blockNumber = event.block.number
//     rawEvent.blockTimestamp = event.block.timestamp
//     rawEvent.transactionHash = event.transaction.hash
//     rawEvent.tokenSale = event.address.toHexString()
//     rawEvent.sender = event.params.sender
//     rawEvent.recipient = event.params.recipient
//     rawEvent.amount0 = event.params.amount0
//     rawEvent.amount1 = event.params.amount1
//     rawEvent.sqrtPriceX96 = event.params.sqrtPriceX96
//     rawEvent.liquidity = event.params.liquidity
//     rawEvent.tick = BigInt.fromI32(event.params.tick)
//
//     rawEvent.save()
// }


export function createPancakeSwapPool(event: TokenSaleCreated, tokenSale: TokenSale): void {

    let poolKey = getPoolKey(event.params.token, WBNB_ADDRESS);
    let poolAddress = predictPancakePoolV3Address(event.params.token, WBNB_ADDRESS)
    let pancakeSwapPool = new PancakeSwapPool(poolAddress.toHexString())
    pancakeSwapPool.tokenSale = tokenSale.id
    pancakeSwapPool.token0 = poolKey.token0
    pancakeSwapPool.token1 = poolKey.token1
    pancakeSwapPool.fee = 100
    pancakeSwapPool.sqrtPriceX96 = BigInt.fromI32(0)
    pancakeSwapPool.liquidity = BigInt.fromI32(0)
    pancakeSwapPool.tick = BigInt.fromI32(0)
    pancakeSwapPool.observationIndex = BigInt.fromI32(0)
    pancakeSwapPool.reserve0 = BigInt.fromI32(0)
    pancakeSwapPool.reserve1 = BigInt.fromI32(0)
    pancakeSwapPool.volumeToken0 = BigInt.fromI32(0)
    pancakeSwapPool.volumeToken1 = BigInt.fromI32(0)
    pancakeSwapPool.volumeUSD = BigDecimal.fromString("0")
    pancakeSwapPool.feesUSD = BigDecimal.fromString("0")
    pancakeSwapPool.txCount = BigInt.fromI32(0)
    pancakeSwapPool.createdAtTimestamp = event.block.timestamp
    pancakeSwapPool.createdAtBlockNumber = event.block.number

    pancakeSwapPool.save()

    PancakePool.create(poolAddress)

}