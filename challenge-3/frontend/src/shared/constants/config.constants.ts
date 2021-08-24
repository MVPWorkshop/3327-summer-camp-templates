const {
  REACT_APP_API_BASE_URL,
  REACT_APP_DEFAULT_IPFS_GATEWAY,
  REACT_APP_SUPPORT_CHILDREN_CONTRACT_ADDRESS
} = process.env;

if (!REACT_APP_API_BASE_URL) {
  throw new Error("Must provide API base url");
}

if (!REACT_APP_DEFAULT_IPFS_GATEWAY) {
  throw new Error("Must provide default IPFS gateway");
}

if (!REACT_APP_SUPPORT_CHILDREN_CONTRACT_ADDRESS) {
  throw new Error("Must provide support children contract address");
}

export const API_BASE_URL = REACT_APP_API_BASE_URL;
export const DEFAULT_IPFS_GATEWAY = REACT_APP_DEFAULT_IPFS_GATEWAY;
export const SUPPORT_CHILDREN_CONTRACT_ADDRESS = REACT_APP_SUPPORT_CHILDREN_CONTRACT_ADDRESS;
