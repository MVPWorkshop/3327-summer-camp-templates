pragma solidity >= 0.6.0 <= 0.8.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface ISupportChildrenNFT is IERC721 {

    function mint(address donor) external;

}