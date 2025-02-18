import { BigDecimal, Address, Bytes, BigInt, crypto } from "@graphprotocol/graph-ts"
import { DECIMAL_FACTOR, PANCAKESWAP_V3_DEPLOYER, PANCAKESWAP_V3_INIT_HASH } from "./constants"
import { getTrackedBnbPriceInUsd } from "./priceTracker"

export function getBnbPriceInUsd(): BigDecimal {
  const priceBn = getTrackedBnbPriceInUsd()
  return priceBn.toBigDecimal()
}

export function convertBnbToUsd(bnbAmount: BigInt): BigInt {
  const priceBn = getTrackedBnbPriceInUsd()
  let usdValue = bnbAmount.toBigDecimal().times(priceBn.toBigDecimal())
  // Округляем до 18 десятичных знаков и преобразуем обратно в BigInt
  return BigInt.fromString(
    usdValue
      .div(DECIMAL_FACTOR.toBigDecimal())
      .truncate(0)
      .toString()
  )
}

export function calculateReferrerCommission(bnbFee: BigInt): BigInt {
  return bnbFee.times(BigInt.fromI32(10)).div(BigInt.fromI32(100))
}

export function getIntervalStartTime(timestamp: BigInt, interval: string): BigInt {
  let seconds: BigInt
  if (interval == "1m") seconds = BigInt.fromI32(60)
  else if (interval == "5m") seconds = BigInt.fromI32(5 * 60)
  else if (interval == "15m") seconds = BigInt.fromI32(15 * 60)
  else if (interval == "1h") seconds = BigInt.fromI32(60 * 60)
  else if (interval == "4h") seconds = BigInt.fromI32(4 * 60 * 60)
  else if (interval == "1d") seconds = BigInt.fromI32(24 * 60 * 60)
  else {
    // Значение по умолчанию - 1 минута
    seconds = BigInt.fromI32(60)
  }

  return timestamp.div(seconds).times(seconds)
}

export function convert25To18Decimals(value: BigInt): BigInt {
  let divisor = BigDecimal.fromString("10000000") // 10^7
  return BigInt.fromString(
    value
      .toBigDecimal()
      .div(divisor)
      .truncate(0)
      .toString()
  )
}

export function convert25To18BigDecimal(value: BigInt): BigDecimal {
  let divisor = BigDecimal.fromString("10000000") // 10^7
  return value
    .toBigDecimal()
    .div(divisor)
    .truncate(0)
}

export function getPoolKey(tokenA: Address, tokenB: Address): PoolKey {
  return tokenA.toHexString() < tokenB.toHexString() ? new PoolKey(tokenA, tokenB) : new PoolKey(tokenB, tokenA)
}

class PoolKey {
  token0: Address
  token1: Address

  constructor(token0: Address, token1: Address) {
    this.token0 = token0
    this.token1 = token1
  }
}

export function predictPancakePoolV3Address(tokenA: Address, tokenB: Address): Address {
  // Сортируем токены, как это делает Uniswap V2
  let poolKey = getPoolKey(tokenA, tokenB)

  // Создаем массив для хранения данных, которые будут хешироваться
  // ff + factory address + keccak256(token0 + token1) + init code hash
  let preimage = new Uint8Array(1 + 20 + 32 + 32)

  // Добавляем префикс 0xff
  preimage[0] = 0xff

  // Добавляем адрес фабрики
  preimage.set(PANCAKESWAP_V3_DEPLOYER as Bytes, 1)

  // Создаем массив для конкатенации адресов токенов
  let salt = new Uint8Array(40) // 20 байт для каждого адреса
  salt.set(poolKey.token0 as Bytes, 0)
  salt.set(poolKey.token1 as Bytes, 20)

  // Вычисляем keccak256 хеш от конкатенации адресов токенов
  let saltHash = crypto.keccak256(Bytes.fromUint8Array(salt))

  // Добавляем полученный хеш к preimage
  preimage.set(saltHash, 21)

  // Добавляем init code hash
  preimage.set(PANCAKESWAP_V3_INIT_HASH, 53)

  // Вычисляем финальный хеш
  let finalHash = crypto.keccak256(Bytes.fromUint8Array(preimage))

  // Берем последние 20 байт (адрес)
  let poolAddressBytes = finalHash.subarray(12)

  return Address.fromBytes(Bytes.fromUint8Array(poolAddressBytes))
}

// export function predictPancakePoolV3Address(tokenA: Address, tokenB: Address): Address {
//     let poolKey = getPoolKey(tokenA, tokenB);
//
//     // ABI-энкодинг token0, token1 и fee
//     let encodedData = new Uint8Array(96); // 32 байта * 3
//
//     // token0
//     let token0Bytes = poolKey.token0 as Bytes; // Address является Bytes
//     let token0Padded = new Uint8Array(32);
//     token0Padded.set(token0Bytes, 12); // Заполняем последние 20 байт адресом токена
//     encodedData.set(token0Padded, 0);
//
//     // token1
//     let token1Bytes = poolKey.token1 as Bytes;
//     let token1Padded = new Uint8Array(32);
//     token1Padded.set(token1Bytes, 12);
//     encodedData.set(token1Padded, 32);
//
//     // fee
//     let fee = PANCAKESWAP_V3_POOL_FEE; // Например, 100
//     let feeBytes = new Uint8Array(32);
//     feeBytes[29] = (fee >> 16) & 0xff;
//     feeBytes[30] = (fee >> 8) & 0xff;
//     feeBytes[31] = fee & 0xff;
//     encodedData.set(feeBytes, 64);
//
//     // Вычисляем salt
//     let salt = crypto.keccak256(Bytes.fromUint8Array(encodedData));
//
//     // Собираем префикс для хеша адреса пула
//     let preimage = new Uint8Array(1 + 20 + 32 + 32); // 85 байт
//     preimage[0] = 0xff;
//     preimage.set((PANCAKESWAP_V3_DEPLOYER as Bytes), 1); // 20 байт
//     preimage.set(salt, 21); // 32 байта
//     preimage.set(PANCAKESWAP_V3_INIT_HASH, 53); // 32 байта
//
//     // Вычисляем хеш адреса пула
//     let hash = crypto.keccak256(Bytes.fromUint8Array(preimage));
//
//     // Получаем адрес пула (последние 20 байт хеша)
//     let poolAddressBytes = hash.subarray(12); // Берём байты с позиции 12 до конца
//     return Address.fromBytes(Bytes.fromUint8Array(poolAddressBytes));
// }
