import {Swap as SwapEvent} from "../../generated/TokenSaleFactory/TokenSaleFactory";
import {Swap, TokenSale} from "../../generated/schema";
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";
import {getOrCreateUser, getOrCreateReferrer, getOrCreateUserTokenSale} from "./entities";
import {convertBnbToUsd, calculateReferrerCommission, getBnbPriceInUsd} from "./utils";
import {DECIMAL_FACTOR} from "./constants";

export function processRedeem(event: SwapEvent): void {
    let tokenSale = TokenSale.load(event.params.token.toHexString())
    if (tokenSale) {

    }
}