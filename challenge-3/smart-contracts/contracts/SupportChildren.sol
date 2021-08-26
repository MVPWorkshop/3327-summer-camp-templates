pragma solidity >= 0.6.0 <= 0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import {UniswapV2Library} from "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

import "./interfaces/ISupportChildren.sol";

contract SupportChildren is Ownable, ISupportChildren {
    using SafeMath for uint256;

    uint256 constant MAX_UINT = 2 ** 256 - 1;
    uint256 public nextCampaignId = 1;

    address public v2factory;
    address public v2router;
    address public WETH;

    mapping(address => bool) private routerApprovedTokens;
    mapping(address => uint256) public donorsFirstCampaign;
    mapping(uint256 => Campaign) public campaigns;

    constructor(address _v2factory, address _v2router, address _WETH) public {
        v2factory = _v2factory;
        v2router = _v2router;
        WETH = _WETH;
    }

    function isCampaignActive(uint256 _campaignId) public view override returns (bool) {
        return (
            campaigns[_campaignId].receivedAmount < campaigns[_campaignId].hardCap &&
            campaigns[_campaignId].endTimestamp > block.timestamp
        );
    }

    function getCampaign(uint256 _campaignId) public view override returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    function createCampaign(
        address payable _beneficiary,
        uint256 _endTimestamp,
        string calldata uri,
        address _wantToken,
        uint256 _hardCap
    ) external override {
        require(_endTimestamp > block.timestamp, "SupportChildren::createCampaign: Campaign must end in the future");

        address payable beneficiary;
        if (_beneficiary != address(0)) {
            beneficiary = _beneficiary;
        } else {
            beneficiary = msg.sender;
        }

        Campaign memory campaign = Campaign(
            _endTimestamp,
            beneficiary,
            uri,
            _wantToken,
            _hardCap,
            0,
            nextCampaignId
        );

        campaigns[nextCampaignId] = campaign;
        emit CampaignCreated(nextCampaignId++, campaign);
    }

    function donate(
        uint256 _campaignId,
        address _donorToken,
        uint256 _amountIn
    ) external override {
        require(_campaignId != 0 && _campaignId < nextCampaignId, "SupportChildren::donate: Non existent campaign id provided");
        require(isCampaignActive(_campaignId), "SupportChildren::donate: Campaign not active");
        require(_donorToken != address(0), "SupportChildren::donate: donorToken == 0x, use donateETH instead");

        address payable _beneficiary = campaigns[_campaignId].beneficiary;
        address _wantToken = campaigns[_campaignId].wantToken;
        bool isCampaignInETH = _wantToken == address(0);
        uint256 _finalDonationAmount = 0;

        if (!isCampaignInETH && _wantToken == _donorToken) {
            _finalDonationAmount = getMaxDonationAmount(_amountIn, _campaignId);

            IERC20(_donorToken).transferFrom(
                msg.sender,
                _beneficiary,
                _finalDonationAmount
            );

            if (donorsFirstCampaign[msg.sender] == 0) {
                donorsFirstCampaign[msg.sender] = _campaignId;
            }

            campaigns[_campaignId].receivedAmount += _finalDonationAmount;

            emit Donation(_campaignId, _finalDonationAmount, _donorToken);
            return;
        }

        if (isCampaignInETH) {
            _wantToken = WETH; // no direct pairs to eth in uniswap v2
        }

        require(
            IUniswapV2Factory(v2factory).getPair(_donorToken, _wantToken) != address(0),
            "SupportChildren::donate: No direct pool exists"
        );

        address[] memory path = new address[](2);
        path[0] = _donorToken;
        path[1] = _wantToken;
        uint256 _amountInWantTokens;

        (uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(
            address(v2factory),
            _donorToken,
            _wantToken
        );

        _amountInWantTokens = UniswapV2Library.getAmountOut(
            _amountIn,
            reserveA,
            reserveB
        );

        uint256 _maxDonationAmountInWantTokens = getMaxDonationAmount(
            _amountInWantTokens,
            _campaignId
        );

        _finalDonationAmount = UniswapV2Library.getAmountOut(
            _maxDonationAmountInWantTokens,
            reserveB,
            reserveA
        );

        IERC20(_donorToken).transferFrom(
            msg.sender,
            address(this),
            _finalDonationAmount
        );

        if (routerApprovedTokens[_donorToken] != true) {
            IERC20(_donorToken).approve(address(v2router), MAX_UINT);
            routerApprovedTokens[_donorToken] = true;
        }

        uint[] memory _swapReturnValues;

        if (isCampaignInETH) {
            _swapReturnValues = IUniswapV2Router02(v2router).swapExactTokensForETH(
                _finalDonationAmount,
                _maxDonationAmountInWantTokens.mul(9700).div(10000),
                path,
                _beneficiary,
                block.timestamp + 1000
            );
        } else {
            _swapReturnValues = IUniswapV2Router02(v2router).swapExactTokensForTokens(
                _finalDonationAmount,
                _maxDonationAmountInWantTokens.mul(9700).div(10000),
                path,
                _beneficiary,
                block.timestamp + 1000
            );
        }

        if (donorsFirstCampaign[msg.sender] == 0) {
            donorsFirstCampaign[msg.sender] = _campaignId;
        }

        campaigns[_campaignId].receivedAmount += _swapReturnValues[1];

        emit Donation(_campaignId, _swapReturnValues[1], _donorToken);
        return;
    }


    function donateETH(uint _campaignId) override external payable {
        require(_campaignId != 0 && _campaignId < nextCampaignId, "SupportChildren::donateETH: Non existent campaign id provided");
        require(isCampaignActive(_campaignId), "SupportChildren::donateETH: Campaign not active");
        require(msg.value > 0, "SupportChildren::donateETH: You must send ether");

        address payable _beneficiary = campaigns[_campaignId].beneficiary;
        address _wantToken = campaigns[_campaignId].wantToken;
        uint256 _finalDonationAmount = 0;
        uint256 _amountIn = msg.value;

        if (_wantToken == address(0)) {

            _finalDonationAmount = getMaxDonationAmount(_amountIn, _campaignId);

            payable(_beneficiary).transfer(_finalDonationAmount);
            campaigns[_campaignId].receivedAmount += _finalDonationAmount;

            if (_amountIn > _finalDonationAmount) {
                payable(msg.sender).transfer(_amountIn - _finalDonationAmount);
            }

            if (donorsFirstCampaign[msg.sender] == 0) {
                donorsFirstCampaign[msg.sender] = _campaignId;
            }

            emit Donation(_campaignId, _finalDonationAmount, address(0));
            return;
        }

        require(IUniswapV2Factory(v2factory).getPair(WETH, _wantToken) != address(0), "no direct pool exists");

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _wantToken;

        (uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(
            address(v2factory),
            WETH,
            _wantToken
        );

        uint256 _amountInWantTokens = UniswapV2Library.getAmountOut(
            _amountIn,
            reserveA,
            reserveB
        );

        uint256 _maxDonationAmountInWantTokens = getMaxDonationAmount(
            _amountInWantTokens,
            _campaignId
        );

        _finalDonationAmount = UniswapV2Library.getAmountOut(
            _maxDonationAmountInWantTokens,
            reserveB,
            reserveA
        );

        uint[] memory _swapReturnValues =
        IUniswapV2Router02(v2router).swapExactETHForTokens{value: _finalDonationAmount}(
            _maxDonationAmountInWantTokens.mul(9500).div(10000),
            path,
            _beneficiary,
            block.timestamp + 1000
        );

        if (donorsFirstCampaign[msg.sender] == 0) {
            donorsFirstCampaign[msg.sender] = _campaignId;
        }

        campaigns[_campaignId].receivedAmount += _swapReturnValues[1];

        if (_amountIn > _finalDonationAmount) {
            payable(msg.sender).transfer(_amountIn - _finalDonationAmount);
        }

        emit Donation(_campaignId, _swapReturnValues[1], address(0));
        return;
    }

    function getMaxDonationAmount(
        uint256 _amountIn,
        uint256 _campaignId
    ) internal view returns (uint256 maxDonationAmount) {

        uint256 _maxPossibleDonation = campaigns[_campaignId].hardCap - campaigns[_campaignId].receivedAmount;
        if (_amountIn <= _maxPossibleDonation) {
            return _amountIn;
        }
        return _maxPossibleDonation;
    }
}
