/* eslint-disable prefer-const */
import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts";
import { ERC20 } from "./types/Factory/ERC20";
import { ERC20SymbolBytes } from "./types/Factory/ERC20SymbolBytes";
import { ERC20NameBytes } from "./types/Factory/ERC20NameBytes";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export let ZERO_BD = BigDecimal.fromString("0");

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  // try types string and bytes32 for symbol
  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  // try types string and bytes32 for name
  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let totalSupplyValue = BigInt.zero();
  let totalSupplyResult = contract.try_totalSupply();
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value;
  }
  return totalSupplyValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  // try types uint8 for decimals
  let decimalValue = BigInt.zero();
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = BigInt.fromI32(decimalResult.value);
  }
  return decimalValue;
}
