import { MockContract, deployContract, deployMockContract } from "ethereum-waffle";
import { Contract, Wallet, utils } from "ethers";

import SupportChildren from "../../build/contracts/SupportChildren.json";
import TestToken from "../../build/contracts/TestToken.json";
import UniswapRouterContract from "../../build/contracts/IUniswapV2Router02.json";
import UniswapFactoryContract from "../../build/contracts/IUniswapV2Factory.json";
import SupportChildrenNFT from "../../build/contracts/SupportChildrenNFT.json";

const TOKEN_SUPPLY = "1000000";
export const TOKEN_SUPPLY_ETH = utils.parseEther(TOKEN_SUPPLY);
const randomAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

interface ISupportChildrenFixture {
  tokenA: Contract;
  tokenB: Contract;
  supportChildren: Contract;
  weth: MockContract;
  uniswapFactory: MockContract;
  uniswapRouter: MockContract;
}

export async function supportChildrenFixture([admin]: Wallet[]): Promise<ISupportChildrenFixture> {
  const tokenA = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);
  const tokenB = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);

  const weth = await deployMockContract(admin, TestToken.abi);
  const uniswapFactory = await deployMockContract(admin, UniswapFactoryContract.abi);
  const uniswapRouter = await deployMockContract(admin, UniswapRouterContract.abi);

  const supportChildren = await deployContract(
    admin, SupportChildren, [uniswapFactory.address, uniswapRouter.address, weth.address]
  );

  return {
    tokenA,
    tokenB,
    supportChildren,
    weth,
    uniswapFactory,
    uniswapRouter
  }
}

interface ISupportChildrenNFTFixture {
  tokenA: Contract;
  tokenB: Contract;
  supportChildren: Contract;
  supportChildrenNFT: Contract;

}

export async function supportChildrenNFTFixture([admin]: Wallet[]): Promise<ISupportChildrenNFTFixture> {
  const tokenA = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);
  const tokenB = await deployContract(admin, TestToken, [TOKEN_SUPPLY_ETH]);

  const supportChildren = await deployContract(admin, SupportChildren, [randomAddress, randomAddress, randomAddress]);
  const supportChildrenNFT = await deployContract(admin, SupportChildrenNFT, [supportChildren.address]);

  return {
    tokenA,
    tokenB,
    supportChildren,
    supportChildrenNFT
  }
}
