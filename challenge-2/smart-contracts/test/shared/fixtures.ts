import { deployContract } from "ethereum-waffle";
import { Contract, Wallet, utils } from "ethers";

import SupportChildren from "../../build/contracts/SupportChildren.json";
import TestToken from "../../build/contracts/TestToken.json";

const TOKEN_SUPPLY = "1000000";
export const TOKEN_SUPPLY_ETH = utils.parseEther(TOKEN_SUPPLY);

interface ISupportChildrenFixture {
  tokenA: Contract;
  tokenB: Contract;
  supportChildren: Contract;
}

export async function supportChildrenFixture([admin]: Wallet[]): Promise<ISupportChildrenFixture> {
  const tokenA = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);
  const tokenB = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);
  const supportChildren = await deployContract(admin, SupportChildren);

  return {
    tokenA,
    tokenB,
    supportChildren
  }
}
