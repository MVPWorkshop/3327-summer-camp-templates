pragma solidity >= 0.6.0 <= 0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SupportChildren.sol";
import "./interfaces/ISupportChildrenNFT.sol";
import "./interfaces/ISupportChildren.sol";

contract SupportChildrenNFT is ISupportChildrenNFT, ERC721 {

    SupportChildren public supportChildren;
    uint256 public nextTokenId = 1;

    constructor (SupportChildren _supportChildren) public ERC721("SupportChildren NFT", "SPCHNFT") {
        supportChildren = _supportChildren;
    }

    function mint(address to) override external {

        require(supportChildren.donorsFirstCampaign(to) != 0, "SupportChildrenNFT::mint: User has not donated yet");
        require(balanceOf(to) == 0, "SupportChildrenNFT::mint: User has already minted their token");
    
        _safeMint(to, nextTokenId);
        _setNFTUri(supportChildren.donorsFirstCampaign(to), nextTokenId++);
    }

    function _setNFTUri(uint256 _campaignId, uint256 _tokenId) internal {            
        ISupportChildren.Campaign memory campaign = supportChildren.getCampaign(_campaignId);
        _setTokenURI(_tokenId, campaign.uri);
    }

}
