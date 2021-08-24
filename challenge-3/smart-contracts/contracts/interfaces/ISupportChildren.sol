pragma solidity >= 0.6.0 <= 0.8.0;
pragma experimental ABIEncoderV2;

interface ISupportChildren {
    struct Campaign {
        uint256 endTimestamp;
        address payable beneficiary;
        string uri;
        address wantToken;
        uint256 hardCap;
        uint256 receivedAmount;
        uint256 campaignId;
    }

    event CampaignCreated(uint256 campaignId, Campaign campaign);
    event Donation(uint256 campaignId, uint256 donatedAmountInWantToken, address tokenAddress);

    function isCampaignActive(uint256 _campaignId) external view returns (bool);

    function getCampaign(uint256 _campaignId)
        external
        view
        returns (Campaign memory);

    function createCampaign(
        address payable _beneficiary,
        uint256 _endTimestamp,
        string calldata uri,
        address wantToken,
        uint256 _hardCap
    ) external;

    // @params _donorToken assumed not to be ETH or WETH, for that use donateETH()
    function donate(
        uint256 _campaignId,
        address _donorToken,
        uint256 _amountInDonorTokens
    ) external;

    function donateETH(uint256 _campaignId) external payable;
}
