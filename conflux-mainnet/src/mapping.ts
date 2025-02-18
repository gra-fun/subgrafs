import {
  TokenSaleCreated,
  TokenSaleConfig,
  TokenSaleFinished,
  Swap as SwapEvent,
  Sync,
  Redeem,
} from "../generated/TokenSaleFactory/TokenSaleFactory"
import { Transfer } from "../generated/templates/ERC20/ERC20"
// import { Swap } from "../generated/templates/PancakePool/PancakeV3Pool"
import { Swap as UniswapV2Swap, Sync as UniswapV2Sync } from "../generated/templates/PancakePool/UniswapV2Pair"

import { processUniswapV2PairSwap, processUniswapV2PairSync } from "./modules/pancakeSwap"

import { ERC20 } from "../generated/templates"

import { processTokenSaleCreated, processTokenSaleConfig, processTokenSaleFinished } from "./modules/tokenSale"
import { processSwap } from "./modules/swap"
import { processSync } from "./modules/sync"
// import { processRedeem } from './modules/redeem'
import { processTransfer } from "./modules/transfer"
import {
  handleRawTokenSaleCreated,
  handleRawTokenSaleConfig,
  handleRawTokenSaleFinished,
  handleRawSwap,
  handleRawSync,
  handleRawRedeem,
} from "./modules/rawEvents"
import { processMainAssetPriceSync } from "./modules/priceTracker"

export function handleTokenSaleCreated(event: TokenSaleCreated): void {
  processTokenSaleCreated(event)
  handleRawTokenSaleCreated(event)

  ERC20.create(event.params.token)
}

export function handleTokenSaleConfig(event: TokenSaleConfig): void {
  processTokenSaleConfig(event)
  handleRawTokenSaleConfig(event)
}

export function handleTokenSaleFinished(event: TokenSaleFinished): void {
  processTokenSaleFinished(event)
  handleRawTokenSaleFinished(event)
}

export function handleSwap(event: SwapEvent): void {
  processSwap(event)
  handleRawSwap(event)
}

export function handleSync(event: Sync): void {
  processSync(event)
  handleRawSync(event)
}

export function handleRedeem(event: Redeem): void {
  // processRedeem(event)
  handleRawRedeem(event)
}

export function handleTransfer(event: Transfer): void {
  processTransfer(event)
}

export function handleUniswapV2PairSync(event: UniswapV2Sync): void {
  processUniswapV2PairSync(event)
}

export function handleUniswapV2PairSwap(event: UniswapV2Swap): void {
  processUniswapV2PairSwap(event)
}

// export function handlePancakeV3PoolSwap(event: Swap): void {
//   // processPancakeSwap(event)
//   // handleRawPancakeSwap(event)
// }

export function handleMainAssetPriceSync(event: UniswapV2Sync): void {
  processMainAssetPriceSync(event)
}
