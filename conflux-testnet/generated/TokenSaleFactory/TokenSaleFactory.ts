// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class AdminChanged extends ethereum.Event {
  get params(): AdminChanged__Params {
    return new AdminChanged__Params(this);
  }
}

export class AdminChanged__Params {
  _event: AdminChanged;

  constructor(event: AdminChanged) {
    this._event = event;
  }

  get previousAdmin(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newAdmin(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class BeaconUpgraded extends ethereum.Event {
  get params(): BeaconUpgraded__Params {
    return new BeaconUpgraded__Params(this);
  }
}

export class BeaconUpgraded__Params {
  _event: BeaconUpgraded;

  constructor(event: BeaconUpgraded) {
    this._event = event;
  }

  get beacon(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Redeem extends ethereum.Event {
  get params(): Redeem__Params {
    return new Redeem__Params(this);
  }
}

export class Redeem__Params {
  _event: Redeem;

  constructor(event: Redeem) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get wethAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Swap extends ethereum.Event {
  get params(): Swap__Params {
    return new Swap__Params(this);
  }
}

export class Swap__Params {
  _event: Swap;

  constructor(event: Swap) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get referrer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get isBuy(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }

  get bnbAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get tokenAmount(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get bnbFee(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get daoFee(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }
}

export class Sync extends ethereum.Event {
  get params(): Sync__Params {
    return new Sync__Params(this);
  }
}

export class Sync__Params {
  _event: Sync;

  constructor(event: Sync) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get startPrice(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get endPrice(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get bnbAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get tokenAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get bnbReserve(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get tokenReserve(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class TokenSaleConfig extends ethereum.Event {
  get params(): TokenSaleConfig__Params {
    return new TokenSaleConfig__Params(this);
  }
}

export class TokenSaleConfig__Params {
  _event: TokenSaleConfig;

  constructor(event: TokenSaleConfig) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get withDao(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get finishingTime(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get maxWalletAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get vTokenBalance(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get vBNBBalance(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class TokenSaleCreated extends ethereum.Event {
  get params(): TokenSaleCreated__Params {
    return new TokenSaleCreated__Params(this);
  }
}

export class TokenSaleCreated__Params {
  _event: TokenSaleCreated;

  constructor(event: TokenSaleCreated) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get symbol(): string {
    return this._event.parameters[2].value.toString();
  }

  get metadata(): string {
    return this._event.parameters[3].value.toString();
  }

  get url(): string {
    return this._event.parameters[4].value.toString();
  }

  get referralLink(): Address {
    return this._event.parameters[5].value.toAddress();
  }
}

export class TokenSaleFinished extends ethereum.Event {
  get params(): TokenSaleFinished__Params {
    return new TokenSaleFinished__Params(this);
  }
}

export class TokenSaleFinished__Params {
  _event: TokenSaleFinished;

  constructor(event: TokenSaleFinished) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get dao(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenReserve(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get bnbReserve(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get sentToDao(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Upgraded extends ethereum.Event {
  get params(): Upgraded__Params {
    return new Upgraded__Params(this);
  }
}

export class Upgraded__Params {
  _event: Upgraded;

  constructor(event: Upgraded) {
    this._event = event;
  }

  get implementation(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TokenSaleFactory__getExchangeAmountResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getFee(): BigInt {
    return this.value0;
  }

  getAmountAfterSwap(): BigInt {
    return this.value1;
  }

  getAmountWithCommission(): BigInt {
    return this.value2;
  }
}

export class TokenSaleFactory__getTokenSaleInfoResultValue0Struct extends ethereum.Tuple {
  get active(): boolean {
    return this[0].toBoolean();
  }

  get tokenBalance(): BigInt {
    return this[1].toBigInt();
  }

  get wethBalance(): BigInt {
    return this[2].toBigInt();
  }

  get maxWalletAmount(): BigInt {
    return this[3].toBigInt();
  }

  get withDao(): boolean {
    return this[4].toBoolean();
  }

  get daoBalance(): BigInt {
    return this[5].toBigInt();
  }

  get finishingTime(): BigInt {
    return this[6].toBigInt();
  }

  get metadata(): string {
    return this[7].toString();
  }
}

export class TokenSaleFactory extends ethereum.SmartContract {
  static bind(address: Address): TokenSaleFactory {
    return new TokenSaleFactory("TokenSaleFactory", address);
  }

  getExchangeAmount(
    token: Address,
    amountIn: BigInt,
    isBuy: boolean,
  ): TokenSaleFactory__getExchangeAmountResult {
    let result = super.call(
      "getExchangeAmount",
      "getExchangeAmount(address,uint256,bool):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(token),
        ethereum.Value.fromUnsignedBigInt(amountIn),
        ethereum.Value.fromBoolean(isBuy),
      ],
    );

    return new TokenSaleFactory__getExchangeAmountResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
    );
  }

  try_getExchangeAmount(
    token: Address,
    amountIn: BigInt,
    isBuy: boolean,
  ): ethereum.CallResult<TokenSaleFactory__getExchangeAmountResult> {
    let result = super.tryCall(
      "getExchangeAmount",
      "getExchangeAmount(address,uint256,bool):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromAddress(token),
        ethereum.Value.fromUnsignedBigInt(amountIn),
        ethereum.Value.fromBoolean(isBuy),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TokenSaleFactory__getExchangeAmountResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
      ),
    );
  }

  getTokenSaleInfo(
    token: Address,
  ): TokenSaleFactory__getTokenSaleInfoResultValue0Struct {
    let result = super.call(
      "getTokenSaleInfo",
      "getTokenSaleInfo(address):((bool,uint256,uint256,uint256,bool,uint256,uint256,string))",
      [ethereum.Value.fromAddress(token)],
    );

    return changetype<TokenSaleFactory__getTokenSaleInfoResultValue0Struct>(
      result[0].toTuple(),
    );
  }

  try_getTokenSaleInfo(
    token: Address,
  ): ethereum.CallResult<TokenSaleFactory__getTokenSaleInfoResultValue0Struct> {
    let result = super.tryCall(
      "getTokenSaleInfo",
      "getTokenSaleInfo(address):((bool,uint256,uint256,uint256,bool,uint256,uint256,string))",
      [ethereum.Value.fromAddress(token)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TokenSaleFactory__getTokenSaleInfoResultValue0Struct>(
        value[0].toTuple(),
      ),
    );
  }

  getWethAmount(token: Address, tokenAmount: BigInt): BigInt {
    let result = super.call(
      "getWethAmount",
      "getWethAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(token),
        ethereum.Value.fromUnsignedBigInt(tokenAmount),
      ],
    );

    return result[0].toBigInt();
  }

  try_getWethAmount(
    token: Address,
    tokenAmount: BigInt,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getWethAmount",
      "getWethAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(token),
        ethereum.Value.fromUnsignedBigInt(tokenAmount),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isFinished(token: Address): boolean {
    let result = super.call("isFinished", "isFinished(address):(bool)", [
      ethereum.Value.fromAddress(token),
    ]);

    return result[0].toBoolean();
  }

  try_isFinished(token: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isFinished", "isFinished(address):(bool)", [
      ethereum.Value.fromAddress(token),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  predictTokenAddress(
    sender: Address,
    name_: string,
    symbol_: string,
  ): Address {
    let result = super.call(
      "predictTokenAddress",
      "predictTokenAddress(address,string,string):(address)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromString(name_),
        ethereum.Value.fromString(symbol_),
      ],
    );

    return result[0].toAddress();
  }

  try_predictTokenAddress(
    sender: Address,
    name_: string,
    symbol_: string,
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "predictTokenAddress",
      "predictTokenAddress(address,string,string):(address)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromString(name_),
        ethereum.Value.fromString(symbol_),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  proxiableUUID(): Bytes {
    let result = super.call("proxiableUUID", "proxiableUUID():(bytes32)", []);

    return result[0].toBytes();
  }

  try_proxiableUUID(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "proxiableUUID",
      "proxiableUUID():(bytes32)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  tokensaleNumber(): BigInt {
    let result = super.call(
      "tokensaleNumber",
      "tokensaleNumber():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_tokensaleNumber(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "tokensaleNumber",
      "tokensaleNumber():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get v3Factory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get weth(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class __TokenSaleFactory_initCall extends ethereum.Call {
  get inputs(): __TokenSaleFactory_initCall__Inputs {
    return new __TokenSaleFactory_initCall__Inputs(this);
  }

  get outputs(): __TokenSaleFactory_initCall__Outputs {
    return new __TokenSaleFactory_initCall__Outputs(this);
  }
}

export class __TokenSaleFactory_initCall__Inputs {
  _call: __TokenSaleFactory_initCall;

  constructor(call: __TokenSaleFactory_initCall) {
    this._call = call;
  }

  get _treasury(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _poolFactory(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class __TokenSaleFactory_initCall__Outputs {
  _call: __TokenSaleFactory_initCall;

  constructor(call: __TokenSaleFactory_initCall) {
    this._call = call;
  }
}

export class BuyCall extends ethereum.Call {
  get inputs(): BuyCall__Inputs {
    return new BuyCall__Inputs(this);
  }

  get outputs(): BuyCall__Outputs {
    return new BuyCall__Outputs(this);
  }
}

export class BuyCall__Inputs {
  _call: BuyCall;

  constructor(call: BuyCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get minTokenAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get referralLink(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class BuyCall__Outputs {
  _call: BuyCall;

  constructor(call: BuyCall) {
    this._call = call;
  }
}

export class CreateTokenSaleCall extends ethereum.Call {
  get inputs(): CreateTokenSaleCall__Inputs {
    return new CreateTokenSaleCall__Inputs(this);
  }

  get outputs(): CreateTokenSaleCall__Outputs {
    return new CreateTokenSaleCall__Outputs(this);
  }
}

export class CreateTokenSaleCall__Inputs {
  _call: CreateTokenSaleCall;

  constructor(call: CreateTokenSaleCall) {
    this._call = call;
  }

  get tokenInfo(): CreateTokenSaleCallTokenInfoStruct {
    return changetype<CreateTokenSaleCallTokenInfoStruct>(
      this._call.inputValues[0].value.toTuple(),
    );
  }

  get metadata_(): string {
    return this._call.inputValues[1].value.toString();
  }

  get url_(): string {
    return this._call.inputValues[2].value.toString();
  }

  get referralLink(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get withDao(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get finishingTime(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get maxWalletAmount(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class CreateTokenSaleCall__Outputs {
  _call: CreateTokenSaleCall;

  constructor(call: CreateTokenSaleCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class CreateTokenSaleCallTokenInfoStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get symbol(): string {
    return this[1].toString();
  }
}

export class CreateTokenSaleAndBuyCall extends ethereum.Call {
  get inputs(): CreateTokenSaleAndBuyCall__Inputs {
    return new CreateTokenSaleAndBuyCall__Inputs(this);
  }

  get outputs(): CreateTokenSaleAndBuyCall__Outputs {
    return new CreateTokenSaleAndBuyCall__Outputs(this);
  }
}

export class CreateTokenSaleAndBuyCall__Inputs {
  _call: CreateTokenSaleAndBuyCall;

  constructor(call: CreateTokenSaleAndBuyCall) {
    this._call = call;
  }

  get tokenInfo(): CreateTokenSaleAndBuyCallTokenInfoStruct {
    return changetype<CreateTokenSaleAndBuyCallTokenInfoStruct>(
      this._call.inputValues[0].value.toTuple(),
    );
  }

  get metadata_(): string {
    return this._call.inputValues[1].value.toString();
  }

  get url_(): string {
    return this._call.inputValues[2].value.toString();
  }

  get referralLink(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get withDao(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get finishingTime(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get maxWalletAmount(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get minTokenAmount(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class CreateTokenSaleAndBuyCall__Outputs {
  _call: CreateTokenSaleAndBuyCall;

  constructor(call: CreateTokenSaleAndBuyCall) {
    this._call = call;
  }
}

export class CreateTokenSaleAndBuyCallTokenInfoStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get symbol(): string {
    return this[1].toString();
  }
}

export class PancakeV3MintCallbackCall extends ethereum.Call {
  get inputs(): PancakeV3MintCallbackCall__Inputs {
    return new PancakeV3MintCallbackCall__Inputs(this);
  }

  get outputs(): PancakeV3MintCallbackCall__Outputs {
    return new PancakeV3MintCallbackCall__Outputs(this);
  }
}

export class PancakeV3MintCallbackCall__Inputs {
  _call: PancakeV3MintCallbackCall;

  constructor(call: PancakeV3MintCallbackCall) {
    this._call = call;
  }

  get amount0Owed(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get amount1Owed(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class PancakeV3MintCallbackCall__Outputs {
  _call: PancakeV3MintCallbackCall;

  constructor(call: PancakeV3MintCallbackCall) {
    this._call = call;
  }
}

export class RedeemCall extends ethereum.Call {
  get inputs(): RedeemCall__Inputs {
    return new RedeemCall__Inputs(this);
  }

  get outputs(): RedeemCall__Outputs {
    return new RedeemCall__Outputs(this);
  }
}

export class RedeemCall__Inputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RedeemCall__Outputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SellCall extends ethereum.Call {
  get inputs(): SellCall__Inputs {
    return new SellCall__Inputs(this);
  }

  get outputs(): SellCall__Outputs {
    return new SellCall__Outputs(this);
  }
}

export class SellCall__Inputs {
  _call: SellCall;

  constructor(call: SellCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get minWethAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get referralLink(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class SellCall__Outputs {
  _call: SellCall;

  constructor(call: SellCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpgradeToCall extends ethereum.Call {
  get inputs(): UpgradeToCall__Inputs {
    return new UpgradeToCall__Inputs(this);
  }

  get outputs(): UpgradeToCall__Outputs {
    return new UpgradeToCall__Outputs(this);
  }
}

export class UpgradeToCall__Inputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpgradeToCall__Outputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }
}

export class UpgradeToAndCallCall extends ethereum.Call {
  get inputs(): UpgradeToAndCallCall__Inputs {
    return new UpgradeToAndCallCall__Inputs(this);
  }

  get outputs(): UpgradeToAndCallCall__Outputs {
    return new UpgradeToAndCallCall__Outputs(this);
  }
}

export class UpgradeToAndCallCall__Inputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class UpgradeToAndCallCall__Outputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }
}
