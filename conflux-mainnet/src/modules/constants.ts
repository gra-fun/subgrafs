import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

export const WBNB_ADDRESS = Address.fromString(
  "0x14b2D3bC65e74DAE1030EAFd8ac30c533c976A9b"
);
export const USDT_ADDRESS = Address.fromString(
  "0xfe97e85d13abd9c1c33384e796f10b73905637ce"
);
export const ONE_BNB = BigInt.fromString("1000000000000000000");

// Константы для начальных значений с учетом 18 десятичных знаков
export const DECIMALS = BigInt.fromI32(18);
export const DECIMAL_FACTOR = BigInt.fromString("1000000000000000000"); // 10^18
export const INITIAL_VIRTUAL_TOKEN_TO_ADD = BigInt.fromString(
  "200000000"
).times(DECIMAL_FACTOR); // 1,000,000,000 * 10^18
export const INITIAL_VIRTUAL_TOKEN_BALANCE = BigInt.fromString(
  "1000000000"
).times(DECIMAL_FACTOR); // 1,000,000,000 * 10^18
export const INITIAL_VIRTUAL_BNB_BALANCE = BigInt.fromString(
  "6000000000000000000"
); // 6 CFX (CFX уже в wei)
export const INITIAL_PRICE = BigInt.fromString("25000000000000"); // 0.000025 CFX (уже в wei)
export const INITIAL_REAL_TOKEN_BALANCE = BigInt.fromString("1000000000").times(
  DECIMAL_FACTOR
); // 1,000,000,000 * 10^18
export const TOKEN_FOR_SALE_BALANCE = BigInt.fromString("800000000").times(
  DECIMAL_FACTOR
); // 800,000,000 * 10^18
export const INITIAL_REAL_BNB_BALANCE = BigInt.fromString("0");
export const ZERO = BigInt.fromString("0");
export const ZERO_BD = BigDecimal.fromString("0");
export const HUNDRED_BD = BigDecimal.fromString("100");

export const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"];

export const PANCAKESWAP_V3_DEPLOYER = Address.fromString(
  "0xE2a6F7c0ce4d5d300F97aA7E125455f5cd3342F5"
);
export const PANCAKESWAP_V3_INIT_HASH = Bytes.fromHexString(
  "0xe9013b07c22e5f47a6c477cffbbef5afdb24c90dedb1e8eacd17963f07186901"
);
export const PANCAKESWAP_V3_POOL_FEE = 100; // 0.01% = 1 / 10000 * 1e6
export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
export const ONE = BigInt.fromI32(1);
export const DEPLOY_FEE = BigInt.fromString("100000000000000");

export const LAST_PRICE_ENTITY_ID = "last-price";

// import {
//     PRICE_FEED_ADDRESS,
//     WBNB_ADDRESS,
//     ONE_BNB,
//     DECIMALS,
//     DECIMAL_FACTOR,
//     INITIAL_VIRTUAL_TOKEN_TO_ADD,
//     INITIAL_VIRTUAL_TOKEN_BALANCE,
//     INITIAL_VIRTUAL_BNB_BALANCE,
//     INITIAL_REAL_TOKEN_BALANCE,
//     TOKEN_FOR_SALE_BALANCE,
//     INITIAL_REAL_BNB_BALANCE,
//     ZERO,
//     ZERO_BD,
//     HUNDRED_BD,
//     INTERVALS,
// } from "./constants";
