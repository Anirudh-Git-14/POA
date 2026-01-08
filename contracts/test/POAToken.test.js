const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("POAToken", function () {
  let poaToken;
  let owner;
  let user1;
  let user2;

  const COOLDOWN_PERIOD = 300; // 5 minutes
  const TASK_ID_1 = "task-001";
  const TASK_ID_2 = "task-002";
  const IPFS_HASH = "QmXxx123...";

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const POAToken = await ethers.getContractFactory("POAToken");
    poaToken = await POAToken.deploy(COOLDOWN_PERIOD);
    await poaToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await poaToken.owner()).to.equal(owner.address);
    });

    it("Should set the cooldown period", async function () {
      expect(await poaToken.cooldownPeriod()).to.equal(COOLDOWN_PERIOD);
    });

    it("Should start with zero total supply", async function () {
      expect(await poaToken.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a POA token successfully", async function () {
      await expect(poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH))
        .to.emit(poaToken, "POAMinted")
        .withArgs(1, user1.address, TASK_ID_1, anyValue, IPFS_HASH);

      const poa = await poaToken.getPOA(1);
      expect(poa.userAddress).to.equal(user1.address);
      expect(poa.taskId).to.equal(TASK_ID_1);
      expect(poa.ipfsHash).to.equal(IPFS_HASH);
      expect(await poaToken.totalSupply()).to.equal(1);
    });

    it("Should prevent duplicate POA for same user and task", async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);

      await expect(
        poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH)
      ).to.be.revertedWith("POAToken: POA already exists for this user and task");
    });

    it("Should allow same user to mint POA for different tasks", async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);
      await poaToken.mintPOA(user1.address, TASK_ID_2, IPFS_HASH);

      expect(await poaToken.totalSupply()).to.equal(2);
    });

    it("Should allow different users to mint POA for same task", async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);
      await poaToken.mintPOA(user2.address, TASK_ID_1, IPFS_HASH);

      expect(await poaToken.totalSupply()).to.equal(2);
    });

    it("Should reject invalid inputs", async function () {
      await expect(
        poaToken.mintPOA(ethers.ZeroAddress, TASK_ID_1, IPFS_HASH)
      ).to.be.revertedWith("POAToken: Invalid user address");

      await expect(
        poaToken.mintPOA(user1.address, "", IPFS_HASH)
      ).to.be.revertedWith("POAToken: Task ID cannot be empty");

      await expect(
        poaToken.mintPOA(user1.address, TASK_ID_1, "")
      ).to.be.revertedWith("POAToken: IPFS hash cannot be empty");
    });
  });

  describe("Cooldown", function () {
    it("Should enforce cooldown period", async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);

      // Try to mint immediately (should fail)
      await expect(
        poaToken.mintPOA(user1.address, TASK_ID_2, IPFS_HASH)
      ).to.be.revertedWith("POAToken: Cooldown period not elapsed");
    });

    it("Should allow minting after cooldown", async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);

      // Fast forward time (Hardhat network allows this)
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await ethers.provider.send("evm_mine", []);

      // Now should be able to mint
      await expect(poaToken.mintPOA(user1.address, TASK_ID_2, IPFS_HASH))
        .to.emit(poaToken, "POAMinted");
    });

    it("Should return correct cooldown status", async function () {
      const [canMint1, timeRemaining1] = await poaToken.canUserMint(user1.address);
      expect(canMint1).to.be.true;
      expect(timeRemaining1).to.equal(0);

      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);

      const [canMint2, timeRemaining2] = await poaToken.canUserMint(user1.address);
      expect(canMint2).to.be.false;
      expect(timeRemaining2).to.be.greaterThan(0);
    });
  });

  describe("Read Functions", function () {
    beforeEach(async function () {
      await poaToken.mintPOA(user1.address, TASK_ID_1, IPFS_HASH);
    });

    it("Should return POA data correctly", async function () {
      const poa = await poaToken.getPOA(1);
      expect(poa.userAddress).to.equal(user1.address);
      expect(poa.taskId).to.equal(TASK_ID_1);
    });

    it("Should check if user has POA", async function () {
      const [exists1, tokenId1] = await poaToken.hasPOA(user1.address, TASK_ID_1);
      expect(exists1).to.be.true;
      expect(tokenId1).to.equal(1);

      const [exists2, tokenId2] = await poaToken.hasPOA(user1.address, TASK_ID_2);
      expect(exists2).to.be.false;
      expect(tokenId2).to.equal(0);
    });

    it("Should reject invalid token ID", async function () {
      await expect(poaToken.getPOA(999)).to.be.revertedWith("POAToken: Invalid token ID");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update cooldown", async function () {
      const newCooldown = 600;
      await expect(poaToken.setCooldownPeriod(newCooldown))
        .to.emit(poaToken, "CooldownUpdated")
        .withArgs(newCooldown);

      expect(await poaToken.cooldownPeriod()).to.equal(newCooldown);
    });

    it("Should prevent non-owner from updating cooldown", async function () {
      await expect(
        poaToken.connect(user1).setCooldownPeriod(600)
      ).to.be.revertedWith("POAToken: Only owner can call this");
    });

    it("Should allow owner to transfer ownership", async function () {
      await poaToken.transferOwnership(user1.address);
      expect(await poaToken.owner()).to.equal(user1.address);
    });
  });
});

// Helper for matching any value in events
const anyValue = () => true;
