import { Transfer } from "../../generated/templates/ERC20/ERC20"
import { UserTokenSale, User, TokenSale } from "../../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"
import { getOrCreateUser, getOrCreateUserTokenSale } from "./entities"

export function processTransfer(event: Transfer): void {
    let tokenAddress = event.address.toHexString()
    let fromAddress = event.params.from.toHexString()
    let toAddress = event.params.to.toHexString()
    let value = event.params.value

    let tokenSale = TokenSale.load(tokenAddress)
    if (tokenSale == null) {
        return
    }

    if (fromAddress != '0x0000000000000000000000000000000000000000'){
        updateUserTokenSale(fromAddress, tokenAddress, value, false, event.block.timestamp)
    }
    updateUserTokenSale(toAddress, tokenAddress, value, true, event.block.timestamp)
}

function updateUserTokenSale(userAddress: string, tokenAddress: string, value: BigInt, isReceiving: boolean, timestamp: BigInt): void {
    let user = getOrCreateUser(userAddress, false, timestamp)
    let userTokenSale = getOrCreateUserTokenSale(userAddress, tokenAddress)

    if (isReceiving) {
        userTokenSale.currentBalance = userTokenSale.currentBalance.plus(value)
    } else {
        userTokenSale.currentBalance = userTokenSale.currentBalance.minus(value)
    }

    userTokenSale.save()
}