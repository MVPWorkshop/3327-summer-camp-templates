const SupportChildren = artifacts.require("SupportChildren");
const SupportChildrenNFT = artifacts.require("SupportChildrenNFT");

module.exports = async function (deployer) {
  require('dotenv').config();

  const UniswapRouter = process.env.UNISWAP_ROUTER_ADDRESS;
  const UniswapFactory = process.env.UNISWAP_FACTORY_ADDRESS;
  const WETH = process.env.WETH_ADDRESS;

  await deployer.deploy(SupportChildren, UniswapFactory, UniswapRouter, WETH);
  const supportChildrenContract = await SupportChildren.deployed();

  await deployer.deploy(SupportChildrenNFT, supportChildrenContract.address);
};
