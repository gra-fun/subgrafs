import {Swap as SwapEvent} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import {Swap, TokenSale} from "../../generated/schema";
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";
import {getOrCreateUser, getOrCreateReferrer, getOrCreateUserTokenSale} from "./entities";
import {convertBnbToUsd, calculateReferrerCommission, getBnbPriceInUsd} from "./utils";
import {DECIMAL_FACTOR, TOKEN_FOR_SALE_BALANCE, ZERO, ZERO_ADDRESS} from "./constants";
import {updateDSRevenue} from "./dailyStatistics";

export function processSwap(event: SwapEvent): void {
    let tokenSale = TokenSale.load(event.params.token.toHexString())
    if (!tokenSale) {
        return; // Ранний возврат, если токенсейл не найден
    }

    let user = getOrCreateUser(event.params.user.toHexString(), true, event.block.timestamp);
    let bnbAmount = event.params.bnbAmount;
    let usdAmount = convertBnbToUsd(bnbAmount);


    let referrer = getOrCreateReferrer(event.params.referrer)
    let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    let bnbPrice = getBnbPriceInUsd()

    // Обновляем общую статистику пользователя
    user.totalTradesCount = user.totalTradesCount.plus(BigInt.fromI32(1));
    user.totalTokenSaleTradesCount = user.totalTokenSaleTradesCount.plus(BigInt.fromI32(1));
    user.totalVolumeBNB = user.totalVolumeBNB.plus(bnbAmount);
    user.totalVolumeUSD = user.totalVolumeUSD.plus(usdAmount);

    // Обновляем статистику в зависимости от типа операции (покупка или продажа)
    if (event.params.isBuy) {
        user.totalBuyVolumeBNB = user.totalBuyVolumeBNB.plus(bnbAmount);
        user.totalTokenSaleBuyVolumeBNB = user.totalTokenSaleBuyVolumeBNB.plus(bnbAmount);
    } else {
        user.totalSellVolumeBNB = user.totalSellVolumeBNB.plus(bnbAmount);
        user.totalTokenSaleSellVolumeBNB = user.totalTokenSaleSellVolumeBNB.plus(bnbAmount);
    }

    user.totalTokenSaleVolumeBNB = user.totalTokenSaleVolumeBNB.plus(bnbAmount);
    user.totalTokenSaleVolumeUSD = user.totalTokenSaleVolumeUSD.plus(usdAmount);

    let referrerCommission = ZERO;

    // Обновляем статистику реферера, если он есть
    if (event.params.referrer.notEqual(ZERO_ADDRESS)) {
        let referrer = getOrCreateReferrer(event.params.referrer);
        referrerCommission = calculateReferrerCommission(event.params.bnbFee);
        referrer.totalCommission = referrer.totalCommission.plus(referrerCommission);
        referrer.save();

        if (user.referrer == null || user.referrer != referrer.id) {
            user.referrer = referrer.id
            referrer.totalActiveReferrals = referrer.totalActiveReferrals.plus(BigInt.fromI32(1))
        }

        // Обновляем комиссию реферера для пользователя
        user.totalReferrerCommissionBNB = user.totalReferrerCommissionBNB.plus(referrerCommission);
    }

    user.save();


    updateDSRevenue(
        event.block.timestamp,
        event.params.bnbFee,
        referrerCommission,
        bnbAmount
    )


    let swap = new Swap(swapId)
    swap.tokenSale = tokenSale.id
    swap.user = user.id
    swap.referrer = referrer.id
    swap.isBuy = event.params.isBuy
    swap.bnbAmount = event.params.bnbAmount
    swap.usdAmount = convertBnbToUsd(event.params.bnbAmount)
    swap.bnbPrice = BigInt.fromString(bnbPrice.truncate(0).toString())
    swap.tokenAmount = event.params.tokenAmount
    swap.bnbFee = event.params.bnbFee
    swap.daoFee = event.params.daoFee
    swap.referrerCommission = calculateReferrerCommission(event.params.bnbFee)
    swap.timestamp = event.block.timestamp
    swap.transactionHash = event.transaction.hash
    swap.source = "gra.fun"
    swap.save()



    referrer.totalCommission = referrer.totalCommission.plus(swap.referrerCommission)
    referrer.save()

    let userTokenSale = getOrCreateUserTokenSale(user.id, tokenSale.id)
    if (event.params.isBuy) {
        userTokenSale.tokensBought = userTokenSale.tokensBought.plus(event.params.tokenAmount)
    } else {
        userTokenSale.tokensSold = userTokenSale.tokensSold.plus(event.params.tokenAmount)
    }
    userTokenSale.save()

    tokenSale.daoBalance = tokenSale.daoBalance.plus(event.params.daoFee)
    tokenSale.totalBnbVolume = tokenSale.totalBnbVolume.plus(event.params.bnbAmount)
    tokenSale.totalTokenVolume = tokenSale.totalTokenVolume.plus(event.params.tokenAmount)
    // Увеличиваем счетчик свопов
    tokenSale.swapsCount = tokenSale.swapsCount.plus(BigInt.fromI32(1))
    tokenSale.save()

    updateLastHourSoldPercentage(tokenSale as TokenSale, event.params.tokenAmount, event.block.timestamp)
}

function updateLastHourSoldPercentage(tokenSale: TokenSale, tokenAmount: BigInt, timestamp: BigInt): void {
    let hourAgo = timestamp.minus(BigInt.fromI32(3600))
    if (tokenSale.lastHourUpdateTimestamp.lt(hourAgo)) {
        tokenSale.lastHourSoldPercentage = BigDecimal.fromString("0")
    }
    let newSoldPercentage = tokenAmount.toBigDecimal()
        .times(BigDecimal.fromString("100"))
        .div(TOKEN_FOR_SALE_BALANCE.toBigDecimal())
    tokenSale.lastHourSoldPercentage = tokenSale.lastHourSoldPercentage.plus(newSoldPercentage)
    tokenSale.lastHourUpdateTimestamp = timestamp
    tokenSale.save()
}