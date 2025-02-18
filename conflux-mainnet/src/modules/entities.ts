import {BigDecimal, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Candlestick, RawEvent, Referrer, User, UserTokenSale} from "../../generated/schema";
import {ZERO, ZERO_BD} from './constants'
import {updateDSUsers} from "./dailyStatistics";

export function getOrCreateUser(address: string, active: boolean, timestamp: BigInt): User {
    // let id = address.toHexString();

    let user = User.load(address);
    if (user == null) {
        user = new User(address);
        user.createdTokenSalesCount = ZERO
        user.totalTradesCount = ZERO
        user.totalBuyVolumeBNB = ZERO
        user.totalSellVolumeBNB = ZERO
        user.totalVolumeBNB = ZERO
        user.totalVolumeUSD = ZERO
        user.totalTokenSaleBuyVolumeBNB = ZERO
        user.totalTokenSaleSellVolumeBNB = ZERO
        user.totalTokenSaleVolumeBNB = ZERO
        user.totalTokenSaleVolumeUSD = ZERO
        user.totalProxyDEXBuyVolumeBNB = ZERO
        user.totalProxyDEXSaleSellVolumeBNB = ZERO
        user.totalProxyDEXSaleVolumeBNB = ZERO
        user.totalProxyDEXSaleVolumeUSD = ZERO
        user.totalReferrerCommissionBNB = ZERO
        user.totalProxyDEXTradesCount = ZERO
        user.totalTokenSaleTradesCount = ZERO
        user.active = active
        user.save();

        // Обновляем ежедневную статистику при создании нового пользователя
        updateDSUsers(timestamp, true, active)
    } else {
        if (!user.active && active) {
            user.active = active
            user.save();

            updateDSUsers(timestamp, false, active)
        }
    }
    return user as User;
}

export function getOrCreateReferrer(address: Bytes): Referrer {
    let referrer = Referrer.load(address.toHexString())
    if (!referrer) {
        referrer = new Referrer(address.toHexString())
        referrer.totalCommission = ZERO
        referrer.totalActiveReferrals = ZERO
        referrer.save()
    }
    return referrer as Referrer
}

export function getOrCreateUserTokenSale(userId: string, tokenSaleId: string): UserTokenSale {
    let id = userId + "-" + tokenSaleId
    let userTokenSale = UserTokenSale.load(id)
    if (userTokenSale == null) {
        userTokenSale = new UserTokenSale(id)
        userTokenSale.user = userId
        userTokenSale.tokenSale = tokenSaleId
        userTokenSale.tokensBought = BigInt.fromI32(0)
        userTokenSale.tokensSold = BigInt.fromI32(0)
        userTokenSale.currentBalance = BigInt.fromI32(0)
    }
    return userTokenSale as UserTokenSale
}

export function getOrCreateRawEvent(txHash: Bytes, blockNumber: BigInt, timestamp: BigInt): RawEvent {
    let rawEvent = RawEvent.load(txHash.toHexString())
    if (rawEvent == null) {
        rawEvent = new RawEvent(txHash.toHexString())
        rawEvent.blockNumber = blockNumber
        rawEvent.blockTimestamp = timestamp
        rawEvent.save()
    }
    return rawEvent as RawEvent
}