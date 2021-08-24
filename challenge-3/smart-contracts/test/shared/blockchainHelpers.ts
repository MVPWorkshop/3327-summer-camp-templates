import { MockProvider } from "ethereum-waffle";
import { BigNumber, Contract } from "ethers";
import { DynamicObject } from "./types";
import { keys } from "./helpers";

export async function timeTravel(provider: MockProvider, time: number) {
  await provider.send("evm_increaseTime", [time]);
}

export async function getBalances<T extends DynamicObject<Contract>>(tokens: T, address: string): Promise<DynamicObject<BigNumber, keyof T>> {
  // @ts-ignore
  const balances: DynamicObject<BigNumber, keyof T> = { };

  const tokenKeys = keys(tokens);
  for (let i = 0; i < tokenKeys.length; i++) {
    const key = tokenKeys[i];
    balances[key] = await tokens[key].balanceOf(address);
  }

  return balances;
}
