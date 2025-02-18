import { Sync } from "../../generated/TokenSaleFactory/TokenSaleFactory";
import { Candlestick, TokenSale } from "../../generated/schema";
import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  convert25To18BigDecimal,
  convert25To18Decimals,
  getIntervalStartTime
} from "./utils";
import { getOrCreateCandlestick, updateCandlestick } from "./candlestick";
import {
  calculate24HourMetrics,
  calculateLastHourChange
} from "./priceAnalysis";

import {
  ONE_BNB,
  DECIMALS,
  DECIMAL_FACTOR,
  INITIAL_VIRTUAL_TOKEN_TO_ADD,
  INITIAL_VIRTUAL_TOKEN_BALANCE,
  INITIAL_VIRTUAL_BNB_BALANCE,
  INITIAL_REAL_TOKEN_BALANCE,
  TOKEN_FOR_SALE_BALANCE,
  INITIAL_REAL_BNB_BALANCE,
  ZERO,
  ZERO_BD,
  HUNDRED_BD,
  INTERVALS
} from "./constants";

export function processSync(event: Sync): void {
  let tokenSale = TokenSale.load(event.params.token.toHexString());
  if (tokenSale == null) {
    log.error("TokenSale not found for token {}", [
      event.params.token.toHexString()
    ]);
    return;
  }
  if (tokenSale) {
    tokenSale.tokenBalance = event.params.tokenReserve.plus(
      INITIAL_VIRTUAL_TOKEN_TO_ADD
    );
    tokenSale.vTokenBalance = event.params.tokenReserve.plus(
      INITIAL_VIRTUAL_TOKEN_TO_ADD
    );
    tokenSale.vBNBBalance = event.params.bnbReserve.plus(
      INITIAL_VIRTUAL_BNB_BALANCE
    );
    tokenSale.BNBBalance = event.params.bnbReserve;
    tokenSale.lastPrice = convert25To18Decimals(event.params.endPrice);
    tokenSale.bnbMarketCap = BigInt.fromString(
      INITIAL_REAL_TOKEN_BALANCE.times(tokenSale.lastPrice)
        .toBigDecimal()
        .div(DECIMAL_FACTOR.toBigDecimal())
        .truncate(0)
        .toString()
    );
    tokenSale.totalTokensSold = TOKEN_FOR_SALE_BALANCE.minus(
      event.params.tokenReserve
    );

    // Определяем, была ли это покупка или продажа
    let isBuy = event.params.endPrice.gt(event.params.startPrice);

    // Расчет SoldPercentage
    let totalTokensForSaleBD = TOKEN_FOR_SALE_BALANCE.toBigDecimal();
    let soldTokensBD = tokenSale.totalTokensSold.toBigDecimal();
    tokenSale.SoldPercentage = soldTokensBD
      .div(totalTokensForSaleBD)
      .times(HUNDRED_BD);

    if (tokenSale.SoldPercentage.gt(HUNDRED_BD)) {
      tokenSale.SoldPercentage = HUNDRED_BD;
    }

    tokenSale.save();

    for (let i = 0; i < INTERVALS.length; i++) {
      let interval = INTERVALS[i];
      let timestamp = getIntervalStartTime(event.block.timestamp, interval);
      let candlestickId =
        event.params.token.toHexString() +
        "-" +
        interval +
        "-" +
        timestamp.toString();

      let candlestick = getOrCreateCandlestick(
        tokenSale.id,
        interval,
        timestamp,
        convert25To18BigDecimal(event.params.startPrice)
      );

      // Обновляем данные свечи
      updateCandlestick(candlestick, event, isBuy);
      candlestick.save();
    }

    // let startPrice = event.params.startPrice.toBigDecimal()
    // let endPrice = event.params.endPrice.toBigDecimal()
    tokenSale.save();
    // ... (код обновления свечей остается без изменений)

    // Вычисление 24-часовых метрик
    // calculate24HourMetrics(event, tokenSale)
  }
}
