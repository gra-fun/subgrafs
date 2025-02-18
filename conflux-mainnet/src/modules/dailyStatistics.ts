import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { DailyStatistics } from "../../generated/schema"
import {ONE, ZERO, ZERO_BD} from "./constants"
import {convertBnbToUsd} from "./utils";

export function getOrCreateDailyStatistics(timestamp: BigInt): DailyStatistics {
    let dayID = timestamp.div(BigInt.fromI32(86400))
    let id = dayID.toString()
    let dailyStats = DailyStatistics.load(id)

    if (dailyStats == null) {
        dailyStats = new DailyStatistics(id)
        dailyStats.date = new Date(timestamp.toI64() * 1000).toISOString().split('T')[0]
        dailyStats.cumulativeFeesBNB = ZERO
        dailyStats.cumulativeFeesUSD = ZERO
        dailyStats.cumulativeRevenueBNB = ZERO
        dailyStats.cumulativeRevenueUSD = ZERO
        dailyStats.cumulativeUniqueHolders = ZERO
        dailyStats.cumulativeUniqueActiveUsers = ZERO
        dailyStats.cumulativeTokenSalesCreated = ZERO
        dailyStats.cumulativeTradingVolumeBNB = ZERO
        dailyStats.cumulativeTradingVolumeUSD = ZERO
        dailyStats.save()
    }

    return dailyStats as DailyStatistics
}

export function updateDSRevenue(
    timestamp: BigInt,
    feesBNB: BigInt,
    refererCommission: BigInt,
    tradingVolumeBNB: BigInt,

): void {
    let dailyStats = updateFeesRevenue(getOrCreateDailyStatistics(timestamp), feesBNB, refererCommission)
    dailyStats.cumulativeTradingVolumeBNB = dailyStats.cumulativeTradingVolumeBNB.plus(tradingVolumeBNB)
    dailyStats.cumulativeTradingVolumeUSD = dailyStats.cumulativeTradingVolumeUSD.plus(convertBnbToUsd(tradingVolumeBNB))
    dailyStats.save()
}


function updateFeesRevenue(dailyStats: DailyStatistics, feesBNB: BigInt, refererCommission: BigInt): DailyStatistics  {
    let revenueBNB = feesBNB.minus(refererCommission)
    dailyStats.cumulativeFeesBNB = dailyStats.cumulativeFeesBNB.plus(feesBNB)
    dailyStats.cumulativeFeesUSD = dailyStats.cumulativeFeesUSD.plus(convertBnbToUsd(feesBNB))
    dailyStats.cumulativeRevenueBNB = dailyStats.cumulativeRevenueBNB.plus(revenueBNB)
    dailyStats.cumulativeRevenueUSD = dailyStats.cumulativeRevenueUSD.plus(convertBnbToUsd(revenueBNB))

    return dailyStats

}


export function updateDSTokenSalesCreated(
    timestamp: BigInt,
    feesBNB: BigInt,
    refererCommission: BigInt,
): void {
    let dailyStats = updateFeesRevenue(getOrCreateDailyStatistics(timestamp), feesBNB, refererCommission)
    dailyStats.cumulativeTokenSalesCreated = dailyStats.cumulativeTokenSalesCreated.plus(ONE)

    dailyStats.save()
}

export function updateDSUsers(
    timestamp: BigInt,
    uniqueHolders: boolean,
    uniqueActiveUsers: boolean,
): void {
    let dailyStats = getOrCreateDailyStatistics(timestamp)

    if (uniqueHolders) {
        dailyStats.cumulativeUniqueHolders = dailyStats.cumulativeUniqueHolders.plus(ONE)
    }

    if (uniqueActiveUsers) {
        dailyStats.cumulativeUniqueActiveUsers = dailyStats.cumulativeUniqueActiveUsers.plus(ONE)
    }

    dailyStats.save()
}