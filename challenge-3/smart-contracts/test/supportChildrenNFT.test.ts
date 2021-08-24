import { expect, use } from "chai";
import { createFixtureLoader, MockProvider, solidity } from "ethereum-waffle";
import { Contract } from "ethers";
import { supportChildrenNFTFixture } from "./shared/fixtures";

use(solidity);

const addressZero = "0x0000000000000000000000000000000000000000";
const testUri = "https://cloudflare-ipfs.com/ipfs/QmdbaSQbGU6Wo9i5LyWWVLuU8g6WrYpWh2K4Li4QuuE8Fr/example_text.txt";

describe("NFT Minting", () => {
  const provider = new MockProvider();
  const [admin, user] = provider.getWallets();
  const loadFixture = createFixtureLoader([admin, user], provider);

  let supportChildrenNFT: Contract;
  let supportChildren: Contract;

  let currentTimestamp: number;
  let campaignEndTimestamp: number;

  const hardCap = 1000000;
  const amountToDonate = hardCap / 2;

  beforeEach(async () => {
    const fixture = await loadFixture(supportChildrenNFTFixture);
    supportChildrenNFT = fixture.supportChildrenNFT;
    supportChildren = fixture.supportChildren;

    currentTimestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    campaignEndTimestamp = currentTimestamp + 100000;
  });

  it("should fail to mint if user has not donated yet", async () => {
    expect(supportChildrenNFT.mint(admin.address)).to.be.revertedWith(
      "SupportChildrenNFT::mint: User has not donated yet"
    );
  });

  it("should fail to mint if already minted to address", async () => {
    const campaignId = await supportChildren.nextCampaignId();

    await supportChildren.createCampaign(
        admin.address,
        campaignEndTimestamp,
        testUri,
        addressZero,
        hardCap
    );

    await supportChildren.donateETH(campaignId, {
      value: amountToDonate
    });

    await supportChildrenNFT.mint(admin.address);

    await expect(supportChildrenNFT.mint(admin.address)).to.be.revertedWith(
      "SupportChildrenNFT::mint: User has already minted their token"
    );
  });

  it("should return correct owner when calling ownerOf(tokenID) after minting", async () => {
    const campaignId = await supportChildren.nextCampaignId();

    await supportChildren.createCampaign(
      admin.address,
      campaignEndTimestamp,
      testUri,
      addressZero,
      hardCap
    );

    await supportChildren.donateETH(campaignId, {
      value: amountToDonate
    });

    await supportChildrenNFT.mint(admin.address);
    expect(await supportChildrenNFT.ownerOf(1)).to.be.equal(admin.address);
  });

  it("should return correct tokens for their owners", async () => {
    const campaignId = await supportChildren.nextCampaignId();
    await supportChildren.createCampaign(
        admin.address,
        campaignEndTimestamp,
        testUri,
        addressZero,
        hardCap
    );

    await supportChildren.donateETH(campaignId, {
      value: amountToDonate
    });

    await supportChildren.connect(user).donateETH(campaignId, {
      value: amountToDonate
    });

    let currentTokenId = await supportChildrenNFT.nextTokenId();
    await supportChildrenNFT.mint(admin.address);
    expect(await supportChildrenNFT.ownerOf(currentTokenId)).to.be.equal(
      admin.address
    );

    currentTokenId = await supportChildrenNFT.nextTokenId();
    await supportChildrenNFT.connect(user).mint(user.address);
    expect(await supportChildrenNFT.ownerOf(currentTokenId)).to.be.equal(
      user.address
    );
  });

  it("should emit events with different tokenIDs", async () => {
    const campaignId = await supportChildren.nextCampaignId();

    await supportChildren.createCampaign(
        admin.address,
        campaignEndTimestamp,
        testUri,
        addressZero,
        hardCap
    );

    await supportChildren.donateETH(campaignId, {
      value: amountToDonate
    });

    await supportChildren.connect(user).donateETH(campaignId, {
      value: amountToDonate
    });

    let expectedTokenId = 1;

    expect(await supportChildrenNFT.mint(admin.address))
      .to.emit(supportChildrenNFT, "Transfer")
      .withArgs(addressZero, admin.address, expectedTokenId.toString());

    expectedTokenId++;

    expect(await supportChildrenNFT.mint(user.address))
      .to.emit(supportChildrenNFT, "Transfer")
      .withArgs(addressZero, user.address, expectedTokenId.toString());
  });

  it("should increment nextTokenId correctly", async () => {
    const campaignId = await supportChildren.nextCampaignId();

    await supportChildren.createCampaign(
        admin.address,
        campaignEndTimestamp,
        testUri,
        addressZero,
        hardCap
    );

    await supportChildren.donateETH(campaignId, {
      value: amountToDonate
    });

    await supportChildren.connect(user).donateETH(campaignId, {
      value: amountToDonate
    });

    let currentID = await supportChildrenNFT.nextTokenId();
    expect(currentID.toString()).to.be.equal("1");

    await supportChildrenNFT.mint(admin.address);
    currentID = await supportChildrenNFT.nextTokenId();
    expect(currentID.toString()).to.be.equal("2");

    await supportChildrenNFT.mint(user.address);
    currentID = await supportChildrenNFT.nextTokenId();
    expect(currentID.toString()).to.be.equal("3");
  });
});
