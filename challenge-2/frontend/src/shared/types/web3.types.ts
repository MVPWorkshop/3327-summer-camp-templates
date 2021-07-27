import Web3 from 'web3'
declare global {
  interface Window {
    // Any because different wallets can inject different versions
    web3?: any;
    ethereum?: any;
  }
}
export enum ENetworkTypes {
  MAIN = 'main',
  MORDEN = 'morden',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  KOVAN = 'kovan',
  GOERLI = 'goerli',
  PRIVATE = 'private'
}
export enum EWalletTypes {
  METAMASK = 'METAMASK'
}