pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISupportChildren.sol";

contract SupportChildren is Ownable, ISupportChildren {
    using SafeMath for uint;
    using SafeERC20 for IERC20;

    constructor() {
    }

    Campaign[] public campaigns;

    function isCampaignActive(uint _campaignId) override public view returns(bool) {
        return campaigns[_campaignId].endTimestamp > block.timestamp;
    }

    function getCampaign(uint _campaignId) override public view returns(Campaign memory) {
        return campaigns[_campaignId];
    }

    function createCampaign(address payable _beneficiary, uint _endTimestamp, string calldata uri) override external {
        require(_endTimestamp > block.timestamp, "SupportChildren::createCampaign: Campaign must end in the future");

        address payable beneficiary;
        if(_beneficiary != address(0)) {
            beneficiary = _beneficiary;
        } else {
            beneficiary = msg.sender;
        }

        Campaign memory campaign = Campaign(_endTimestamp, beneficiary, uri);
        uint campaignId = campaigns.length;

        campaigns.push(campaign);

        emit CampaignCreated(campaignId, campaign);
    }

    function donate(uint _campaignId, address _token, uint _amount) override external {
        require(_campaignId < campaigns.length, "SupportChildren::donate: Non existent campaign id provided");
        require(isCampaignActive(_campaignId), "SupportChildren::donate: Campaign not active");

        address beneficiary = campaigns[_campaignId].beneficiary;

        IERC20(_token).transferFrom(msg.sender, beneficiary, _amount);
        emit Donation(_campaignId, _amount, _token);
    }

    function donateETH(uint _campaignId) override external payable {
        require(_campaignId < campaigns.length, "SupportChildren::donateETH: Non existent campaign id provided");
        require(isCampaignActive(_campaignId), "SupportChildren::donateETH: Campaign not active");
        require(msg.value > 0, "SupportChildren::donateETH: You must send ether");

        Campaign memory campaign = campaigns[_campaignId];
        campaign.beneficiary.transfer(msg.value);

        emit Donation(_campaignId, msg.value, address(0));
    }
}
