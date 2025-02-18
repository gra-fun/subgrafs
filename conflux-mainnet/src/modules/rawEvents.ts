import {
    Redeem,
    Swap as SwapEvent, Sync,
    TokenSaleConfig,
    TokenSaleCreated,
    TokenSaleFinished
} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import {
    RawRedeemEvent,
    RawSwapEvent, RawSyncEvent,
    RawTokenSaleConfigEvent,
    RawTokenSaleCreatedEvent,
    RawTokenSaleFinishedEvent
} from "../../generated/schema";

import {getOrCreateRawEvent} from "./entities";

export function handleRawTokenSaleCreated(event: TokenSaleCreated): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawTokenSaleCreatedEvent = new RawTokenSaleCreatedEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawTokenSaleCreatedEvent.rawEvent = rawEvent.id
    rawTokenSaleCreatedEvent.logIndex = event.logIndex
    rawTokenSaleCreatedEvent.token = event.params.token
    rawTokenSaleCreatedEvent.name = event.params.name
    rawTokenSaleCreatedEvent.symbol = event.params.symbol
    rawTokenSaleCreatedEvent.metadata = event.params.metadata
    rawTokenSaleCreatedEvent.url = event.params.url
    rawTokenSaleCreatedEvent.referralLink = event.params.referralLink
    rawTokenSaleCreatedEvent.save()
}

export function handleRawTokenSaleConfig(event: TokenSaleConfig): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawTokenSaleConfigEvent = new RawTokenSaleConfigEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawTokenSaleConfigEvent.rawEvent = rawEvent.id
    rawTokenSaleConfigEvent.logIndex = event.logIndex
    rawTokenSaleConfigEvent.token = event.params.token
    rawTokenSaleConfigEvent.withDao = event.params.withDao
    rawTokenSaleConfigEvent.finishingTime = event.params.finishingTime
    rawTokenSaleConfigEvent.maxWalletAmount = event.params.maxWalletAmount
    rawTokenSaleConfigEvent.vTokenBalance = event.params.vTokenBalance
    rawTokenSaleConfigEvent.vBNBBalance = event.params.vBNBBalance
    rawTokenSaleConfigEvent.save()
}

export function handleRawTokenSaleFinished(event: TokenSaleFinished): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawTokenSaleFinishedEvent = new RawTokenSaleFinishedEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawTokenSaleFinishedEvent.rawEvent = rawEvent.id
    rawTokenSaleFinishedEvent.logIndex = event.logIndex
    rawTokenSaleFinishedEvent.token = event.params.token
    rawTokenSaleFinishedEvent.dao = event.params.dao
    rawTokenSaleFinishedEvent.tokenReserve = event.params.tokenReserve
    rawTokenSaleFinishedEvent.bnbReserve = event.params.bnbReserve
    rawTokenSaleFinishedEvent.sentToDao = event.params.sentToDao
    rawTokenSaleFinishedEvent.save()
}

export function handleRawSwap(event: SwapEvent): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawSwapEvent = new RawSwapEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawSwapEvent.rawEvent = rawEvent.id
    rawSwapEvent.logIndex = event.logIndex
    rawSwapEvent.user = event.params.user
    rawSwapEvent.referrer = event.params.referrer
    rawSwapEvent.token = event.params.token
    rawSwapEvent.isBuy = event.params.isBuy
    rawSwapEvent.bnbAmount = event.params.bnbAmount
    rawSwapEvent.tokenAmount = event.params.tokenAmount
    rawSwapEvent.bnbFee = event.params.bnbFee
    rawSwapEvent.daoFee = event.params.daoFee
    rawSwapEvent.save()
}

export function handleRawSync(event: Sync): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawSyncEvent = new RawSyncEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawSyncEvent.rawEvent = rawEvent.id
    rawSyncEvent.logIndex = event.logIndex
    rawSyncEvent.token = event.params.token
    rawSyncEvent.startPrice = event.params.startPrice
    rawSyncEvent.endPrice = event.params.endPrice
    rawSyncEvent.bnbAmount = event.params.bnbAmount
    rawSyncEvent.tokenAmount = event.params.tokenAmount
    rawSyncEvent.bnbReserve = event.params.bnbReserve
    rawSyncEvent.tokenReserve = event.params.tokenReserve
    rawSyncEvent.save()
}

export function handleRawRedeem(event: Redeem): void {
    let rawEvent = getOrCreateRawEvent(event.transaction.hash, event.block.number, event.block.timestamp)

    let rawRedeemEvent = new RawRedeemEvent(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )
    rawRedeemEvent.rawEvent = rawEvent.id
    rawRedeemEvent.logIndex = event.logIndex
    rawRedeemEvent.token = event.params.token
    rawRedeemEvent.tokenAmount = event.params.tokenAmount
    rawRedeemEvent.wethAmount = event.params.wethAmount
    rawRedeemEvent.save()
}
//
// 25 000 @H_theGreat
// // H_theGreat
// // user_id:6699024472
// // wallet_address:0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f
// https://wl-api.gra.fun/api/status/0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f
//
// 50 000 @Mstsobhani
// // Mstsobhani
// // user_id:86584077
// // wallet_address:0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0
// https://wl-api.gra.fun/api/status/0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0
//
// 100 000 @umar64815870
// // umar64815870
// // user_id:5281539248
// // wallet_address:0xbe89ac74c30e7e4c4a04093bbe9277d14e141125
// https://wl-api.gra.fun/api/status/0xbe89ac74c30e7e4c4a04093bbe9277d14e141125
//
//
// 25000 @H_theGreat
// // H_theGreat      user_id:6699024472  wallet_address:0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f
// 127.0.0.1:6379> get user_id:6699024472
// // "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":800,\"invited_people\":0}"
// // 127.0.0.1:6379> get wallet_address:0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f
// // "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":800,\"invited_people\":0}"
// //
// //
// // "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":800,\"invited_people\":0}"
//
//
// get user_id:6699024472
// get wallet_address:0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f
//
// SET user_id:6699024472 "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":25800,\"invited_people\":0}"
// SET wallet_address:0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":25800,\"invited_people\":0}"
//
//
// 50 000 @Mstsobhani
// // Mstsobhani      user_id:86584077    wallet_address:0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0
// get user_id:86584077
// get wallet_address:0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0
//
// 127.0.0.1:6379> get user_id:86584077
// "{\"user_id\":86584077,\"wallet_address\":\"0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":800,\"invited_people\":0}"
// 127.0.0.1:6379> get wallet_address:0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0
// "{\"user_id\":6699024472,\"wallet_address\":\"0xcf09e2fcd847cda076bd15e7e3d4e2133323d19f\",\"user_referrer\":\"0x07fcc6f374decdc024ff89c6a20c0190f14fd74c\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":25800,\"invited_people\":0}"
//
//
// "{\"user_id\":86584077,\"wallet_address\":\"0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":800,\"invited_people\":0}"
//
// SET user_id:86584077 "{\"user_id\":86584077,\"wallet_address\":\"0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":50800,\"invited_people\":0}"
// SET wallet_address:0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0 "{\"user_id\":86584077,\"wallet_address\":\"0xa14f144b4a4b63d44e136881b4f8f5aaf51771e0\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":true,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":50800,\"invited_people\":0}"
//
// 100 000 @umar64815870
// // umar64815870    user_id:5281539248  wallet_address:0xbe89ac74c30e7e4c4a04093bbe9277d14e141125
// get user_id:5281539248
// get wallet_address:0xbe89ac74c30e7e4c4a04093bbe9277d14e141125
//
// 127.0.0.1:6379> get user_id:5281539248
// "{\"user_id\":5281539248,\"wallet_address\":\"0xbe89ac74c30e7e4c4a04093bbe9277d14e141125\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":false,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":300,\"invited_people\":0}"
// 127.0.0.1:6379> get wallet_address:0xbe89ac74c30e7e4c4a04093bbe9277d14e141125
// "{\"user_id\":5281539248,\"wallet_address\":\"0xbe89ac74c30e7e4c4a04093bbe9277d14e141125\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":false,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":300,\"invited_people\":0}"
// 127.0.0.1:6379>
//
//
// "{\"user_id\":5281539248,\"wallet_address\":\"0xbe89ac74c30e7e4c4a04093bbe9277d14e141125\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":false,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":300,\"invited_people\":0}"
//
// SET user_id:5281539248 "{\"user_id\":5281539248,\"wallet_address\":\"0xbe89ac74c30e7e4c4a04093bbe9277d14e141125\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":false,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":100300,\"invited_people\":0}"
// SET wallet_address:0xbe89ac74c30e7e4c4a04093bbe9277d14e141125 "{\"user_id\":5281539248,\"wallet_address\":\"0xbe89ac74c30e7e4c4a04093bbe9277d14e141125\",\"user_referrer\":\"\",\"wallet_connected\":true,\"twitter_sub\":true,\"tg_channel_sub\":true,\"user_tg_customization\":false,\"bnb_balance\":false,\"tg_bot_connected\":true,\"points\":100300,\"invited_people\":0}"