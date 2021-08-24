import {expect, use} from "chai";
import {createFixtureLoader, MockProvider, solidity} from 'ethereum-waffle';
import {supportChildrenFixture} from "./shared/fixtures";
import {Contract} from "ethers";
import {getBalances, timeTravel} from "./shared/blockchainHelpers";

use(solidity);

const addressZero = "0x0000000000000000000000000000000000000000";
const randomAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";
const hardCap = 1000000;
const testUri = "https://cloudflare-ipfs.com/ipfs/QmdbaSQbGU6Wo9i5LyWWVLuU8g6WrYpWh2K4Li4QuuE8Fr/example_text.txt";

describe("Campaign creation", () => {
    const provider = new MockProvider();
    const [admin, user] = provider.getWallets();
    const loadFixture = createFixtureLoader([admin, user], provider);

    let supportChildren: Contract;

    beforeEach(async () => {
        const fixture = await loadFixture(supportChildrenFixture);
        supportChildren = fixture.supportChildren;
    });

    it("should fail to create campaign in past", async () => {
        const currentTimestamp = (
            await provider.getBlock(await provider.getBlockNumber())
        ).timestamp;

        await expect(supportChildren.createCampaign(addressZero, currentTimestamp - 100, testUri, randomAddress, hardCap))
            .to.be.revertedWith("SupportChildren::createCampaign: Campaign must end in the future")
    })

    it("should create campaign", async () => {
        const currentTimestamp = (
            await provider.getBlock(await provider.getBlockNumber())
        ).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;

        await expect(supportChildren.createCampaign(addressZero, campaignEndTimestamp, testUri, randomAddress, hardCap))
            .to.emit(supportChildren, "CampaignCreated")
            .withArgs(1, [campaignEndTimestamp, admin.address]);

        await expect(supportChildren.createCampaign(user.address, campaignEndTimestamp, testUri, randomAddress, hardCap))
            .to.emit(supportChildren, "CampaignCreated")
            .withArgs(2, [campaignEndTimestamp, user.address]);
    });
});

describe("Donations", () => {
    const provider = new MockProvider();
    const [admin, user] = provider.getWallets();
    const loadFixture = createFixtureLoader([admin, user], provider);

    let supportChildren: Contract;
    let tokenA: Contract;

    beforeEach(async () => {
        const fixture = await loadFixture(supportChildrenFixture);
        supportChildren = fixture.supportChildren;
        tokenA = fixture.tokenA;
    });

    it("should revert for non existent campaign id", async () => {
        let nonExistentCampaignId = 0;

        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;

        await expect(supportChildren.donate(nonExistentCampaignId, tokenA.address, 100))
          .to.be.revertedWith("SupportChildren::donate: Non existent campaign id provided");

        await expect(supportChildren.donateETH(nonExistentCampaignId))
          .to.be.revertedWith("SupportChildren::donateETH: Non existent campaign id provided");

        await supportChildren.createCampaign(addressZero, campaignEndTimestamp, testUri, randomAddress, hardCap);

        nonExistentCampaignId = supportChildren.nextCampaignId();

        await expect(supportChildren.donate(nonExistentCampaignId, tokenA.address, 100))
          .to.be.revertedWith("SupportChildren::donate: Non existent campaign id provided");

        await expect(supportChildren.donateETH(nonExistentCampaignId))
          .to.be.revertedWith("SupportChildren::donateETH: Non existent campaign id provided"
        );
    });

    it("should revert for non active campaigns", async () => {
        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const nonActiveCampaignId = await supportChildren.nextCampaignId();

        await supportChildren.createCampaign(
            addressZero,
            campaignEndTimestamp,
            testUri,
            randomAddress,
            hardCap
        );
        await timeTravel(provider, campaignEndTimestamp + 1);

        await expect(
            supportChildren.donate(nonActiveCampaignId, tokenA.address, 100)
        ).to.be.revertedWith("SupportChildren::donate: Campaign not active");

        await expect(
            supportChildren.donateETH(nonActiveCampaignId)
        ).to.be.revertedWith("SupportChildren::donateETH: Campaign not active");
    });

    it("should be able to take ERC20 donations", async () => {
        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const amountToDonate = 5000;
        const campaignId = await supportChildren.nextCampaignId();

        await supportChildren.createCampaign(
            user.address,
            campaignEndTimestamp,
            testUri,
            tokenA.address,
            hardCap
        );

        await tokenA.approve(supportChildren.address, amountToDonate);

        const adminBalancesBefore = await getBalances(
            {tokenA},
            admin.address
        );
        const userBalancesBefore = await getBalances(
            {tokenA},
            user.address
        );

        await supportChildren.donate(campaignId, tokenA.address, amountToDonate);

        const adminBalancesAfter = await getBalances(
            {tokenA},
            admin.address
        );
        const userBalancesAfter = await getBalances(
            {tokenA},
            user.address
        );

        expect(adminBalancesBefore.tokenA.sub(adminBalancesAfter.tokenA)).to.eq(
            amountToDonate
        );
        expect(userBalancesAfter.tokenA.sub(userBalancesBefore.tokenA)).to.eq(amountToDonate);
    });

    it("should fail if ether donation without value", async () => {
        const currentTimestamp = (
            await provider.getBlock(await provider.getBlockNumber())
        ).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const campaignId = await supportChildren.nextCampaignId();

        await supportChildren.createCampaign(user.address, campaignEndTimestamp, testUri, randomAddress, hardCap);
        await expect(supportChildren.donateETH(campaignId))
            .to.be.revertedWith("SupportChildren::donateETH: You must send ether");
    })

    it("should be able to donate in ether", async () => {
        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const amountToDonate = 5000;
        const campaignId = await supportChildren.nextCampaignId();

        const userBalanceBefore = await provider.getBalance(user.address);

        await supportChildren.createCampaign(
          user.address,
          campaignEndTimestamp,
          testUri,
          addressZero,
          hardCap
        );

        await supportChildren.donateETH(campaignId, {value: amountToDonate});
        const userBalanceAfter = await provider.getBalance(user.address);

        expect(userBalanceAfter.sub(userBalanceBefore)).to.be.eq(amountToDonate);
    });

    it("should revert if hardCap reached", async () => {
        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const amountToDonate = hardCap;
        const campaignId = await supportChildren.nextCampaignId();

        await supportChildren.createCampaign(
            user.address,
            campaignEndTimestamp,
            testUri,
            addressZero,
            hardCap
        );

        await supportChildren.donateETH(campaignId, {value: amountToDonate});

        await expect(supportChildren.donateETH(campaignId, {value: amountToDonate}))
            .to.be.revertedWith("SupportChildren::donateETH: Campaign not active");
    });


    it("should emit donate events", async () => {
        const currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
        const campaignEndTimestamp = currentTimestamp + 1000;
        const amountToDonate = 50000;
        let campaignId = Number.parseInt(await supportChildren.nextCampaignId());

        await tokenA.approve(supportChildren.address, amountToDonate);
        await supportChildren.createCampaign(
            user.address,
            campaignEndTimestamp,
            testUri,
            addressZero,
            hardCap
        );

        expect(await supportChildren.donateETH(campaignId, {value: amountToDonate}))
            .to.emit(supportChildren, "Donation")
            .withArgs(campaignId, amountToDonate, addressZero);

        campaignId += 1;
        await supportChildren.createCampaign(
          user.address, campaignEndTimestamp, testUri, tokenA.address, amountToDonate
        );

        expect(await supportChildren.donate(campaignId, tokenA.address, amountToDonate))
            .to.emit(supportChildren, "Donation")
            .withArgs(campaignId, amountToDonate, tokenA.address);
    });


});
