import { BigInt, log } from "@graphprotocol/graph-ts"
import { MainAssetPrice } from "../../generated/schema"
import { Sync as UniswapV2Sync } from "../../generated/templates/PancakePool/UniswapV2Pair"
import { DECIMAL_FACTOR, LAST_PRICE_ENTITY_ID, ZERO } from "./constants"

export function processMainAssetPriceSync(event: UniswapV2Sync): void {
  const wCFX = event.params.reserve0
  const usdt = event.params.reserve1

  const price_bigDecimal = usdt
    .toBigDecimal()
    .times(DECIMAL_FACTOR.toBigDecimal())
    .div(wCFX.toBigDecimal())
  const price = BigInt.fromString(price_bigDecimal.truncate(0).toString())

  log.info("updated wCFX price, new price: {}", [price.toString()])

  let priceEntity = MainAssetPrice.load(LAST_PRICE_ENTITY_ID)
  if (priceEntity == null) {
    priceEntity = new MainAssetPrice(LAST_PRICE_ENTITY_ID)
  }

  priceEntity.timestamp = event.block.timestamp
  priceEntity.price = price
  priceEntity.save()
}

export function getTrackedBnbPriceInUsd(): BigInt {
  const priceEntity = MainAssetPrice.load(LAST_PRICE_ENTITY_ID)

  if (priceEntity == null) {
    return ZERO
  }

  return priceEntity.price
}
