import {
  TokenSaleConfig,
  TokenSaleCreated,
  TokenSaleFinished
} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import { PancakeSwapPool, TokenSale } from "../../generated/schema";
import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  predictPancakePoolV3Address,
  getPoolKey,
  calculateReferrerCommission
} from "./utils";
import { PancakePool } from "../../generated/templates";
import { createPancakeSwapPool } from "./pancakeSwap";
import {
  INITIAL_VIRTUAL_TOKEN_TO_ADD,
  INITIAL_VIRTUAL_TOKEN_BALANCE,
  INITIAL_VIRTUAL_BNB_BALANCE,
  INITIAL_REAL_TOKEN_BALANCE,
  INITIAL_REAL_BNB_BALANCE,
  ZERO,
  ZERO_BD,
  INITIAL_PRICE,
  DECIMAL_FACTOR,
  DEPLOY_FEE
} from "./constants";
import { getOrCreateUser } from "./entities";
import { updateDSTokenSalesCreated } from "./dailyStatistics";

export function processTokenSaleCreated(event: TokenSaleCreated): void {
  let tokenSale = new TokenSale(event.params.token.toHexString());

  let creator = getOrCreateUser(
    event.transaction.from.toHexString(),
    true,
    event.block.timestamp
  );

  creator.createdTokenSalesCount = creator.createdTokenSalesCount.plus(
    BigInt.fromI32(1)
  );
  creator.save();

  log.info("New TokenSale created for token {}", [
    event.params.token.toHexString()
  ]);
  tokenSale.name = event.params.name;
  tokenSale.symbol = event.params.symbol;
  tokenSale.metadata = event.params.metadata;
  tokenSale.url = event.params.url;
  tokenSale.referralLink = event.params.referralLink;
  tokenSale.withDao = true;
  tokenSale.finishingTime = BigInt.fromI64(9999999999999);
  tokenSale.maxWalletAmount = BigInt.fromString("80000000000000000000000000"); // 80 * 10^25 по умолчанию
  tokenSale.creator = event.transaction.from;
  tokenSale.createdAt = event.block.timestamp;
  tokenSale.creationTxHash = event.transaction.hash;
  tokenSale.isFinished = false;
  tokenSale.vTokenBalance = INITIAL_VIRTUAL_TOKEN_BALANCE;
  tokenSale.vBNBBalance = INITIAL_VIRTUAL_BNB_BALANCE;
  tokenSale.tokenBalance = INITIAL_REAL_TOKEN_BALANCE;
  tokenSale.BNBBalance = INITIAL_REAL_BNB_BALANCE;
  tokenSale.daoBalance = ZERO;
  tokenSale.totalTokensSold = ZERO;
  tokenSale.totalBnbVolume = ZERO;
  tokenSale.totalTokenVolume = ZERO;
  tokenSale.last24HourBnbVolume = ZERO;
  tokenSale.last24HourTokenVolume = ZERO;
  tokenSale.SoldPercentage = ZERO_BD;
  tokenSale.lastHourSoldPercentage = ZERO_BD;
  tokenSale.lastHourUpdateTimestamp = event.block.timestamp;
  tokenSale.swapsCount = ZERO;
  tokenSale.providedTokenLiquidity = ZERO;
  tokenSale.providedBNBLiquidity = ZERO;
  tokenSale.daoAddress = null;
  tokenSale.last24HourUSDVolume = ZERO;
  tokenSale.price24hChange = ZERO_BD;
  tokenSale.lastPrice = INITIAL_PRICE;
  tokenSale.bnbMarketCap = BigInt.fromString(
    INITIAL_REAL_TOKEN_BALANCE.times(INITIAL_PRICE)
      .toBigDecimal()
      .div(DECIMAL_FACTOR.toBigDecimal())
      .truncate(0)
      .toString()
  );

  tokenSale.save();

  updateDSTokenSalesCreated(event.block.timestamp, DEPLOY_FEE, ZERO);

  createPancakeSwapPool(event, tokenSale);
}

export function processTokenSaleConfig(event: TokenSaleConfig): void {
  let tokenSale = TokenSale.load(event.params.token.toHexString());
  if (tokenSale) {
    tokenSale.withDao = event.params.withDao;
    tokenSale.finishingTime = event.params.finishingTime;
    tokenSale.maxWalletAmount = event.params.maxWalletAmount;
    // tokenSale.vTokenBalance = event.params.vTokenBalance + INITIAL_VIRTUAL_TOKEN_BALANCE
    tokenSale.vBNBBalance = event.params.vBNBBalance;
    tokenSale.save();
  }
}

export function processTokenSaleFinished(event: TokenSaleFinished): void {
  let tokenSale = TokenSale.load(event.params.token.toHexString());
  if (tokenSale == null) {
    return;
  }

  tokenSale.isFinished = true;
  tokenSale.daoAddress = event.params.dao;
  tokenSale.providedTokenLiquidity = event.params.tokenReserve;
  tokenSale.providedBNBLiquidity = event.params.bnbReserve;
  tokenSale.vTokenBalance = tokenSale.vTokenBalance.minus(
    INITIAL_VIRTUAL_TOKEN_TO_ADD
  );
  tokenSale.vBNBBalance = tokenSale.vBNBBalance.minus(event.params.bnbReserve);
  tokenSale.tokenBalance = tokenSale.tokenBalance.minus(
    INITIAL_VIRTUAL_TOKEN_TO_ADD
  );
  tokenSale.BNBBalance = tokenSale.BNBBalance.minus(event.params.bnbReserve);
  tokenSale.daoBalance = ZERO;
  tokenSale.liquidityMigrationTimestamp = event.block.timestamp;
  tokenSale.save();
}
