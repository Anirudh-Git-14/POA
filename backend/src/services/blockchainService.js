import { ethers } from "ethers";
import POATokenABI from "../config/POATokenABI.js";

/**
 * Blockchain Service
 * Handles interaction with POAToken smart contract
 */

class BlockchainService {
  constructor() {
    // Initialize provider (Polygon network)
    const rpcUrl = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize signer (backend wallet)
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.warn("⚠️  PRIVATE_KEY not set - blockchain operations will fail");
      this.signer = null;
      this.contract = null;
      return;
    }
    this.signer = new ethers.Wallet(privateKey, this.provider);

    // Contract address and ABI
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn("⚠️  CONTRACT_ADDRESS not set - blockchain operations will fail");
      this.contract = null;
      return;
    }

    this.contract = new ethers.Contract(
      contractAddress,
      POATokenABI,
      this.signer
    );

    console.log(`🔗 Blockchain service initialized`);
    console.log(`   Network: ${rpcUrl}`);
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Signer: ${this.signer.address}`);
  }

  /**
   * Mint a POA token
   * @param {string} userAddress - User's wallet address
   * @param {string} taskId - Task identifier
   * @param {string} ipfsHash - IPFS hash of proof metadata
   * @returns {Promise<Object>} { tokenId, transactionHash }
   */
  async mintPOA(userAddress, taskId, ipfsHash) {
    if (!this.contract || !this.signer) {
      throw new Error("Blockchain service not configured. Set PRIVATE_KEY and CONTRACT_ADDRESS in .env");
    }
    try {
      console.log(`🔨 Minting POA for ${userAddress}, task: ${taskId}`);

      // Call smart contract
      const tx = await this.contract.mintPOA(userAddress, taskId, ipfsHash);
      console.log(`⏳ Transaction sent: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      // Parse event to get token ID
      const event = receipt.logs.find((log) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed && parsed.name === "POAMinted";
        } catch {
          return false;
        }
      });

      let tokenId;
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        tokenId = parsed.args.tokenId.toString();
      } else {
        // Fallback: query total supply (last minted token)
        const totalSupply = await this.contract.totalSupply();
        tokenId = totalSupply.toString();
      }

      return {
        tokenId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("❌ Blockchain mint error:", error);
      throw new Error(`Failed to mint POA: ${error.message}`);
    }
  }

  /**
   * Get POA data by token ID
   * @param {number} tokenId - Token ID
   * @returns {Promise<Object>} POA data
   */
  async getPOA(tokenId) {
    if (!this.contract) {
      throw new Error("Blockchain service not configured. Set CONTRACT_ADDRESS in .env");
    }
    try {
      const poaData = await this.contract.getPOA(tokenId);

      return {
        tokenId: tokenId.toString(),
        userAddress: poaData.userAddress,
        taskId: poaData.taskId,
        timestamp: poaData.timestamp.toString(),
        ipfsHash: poaData.ipfsHash,
      };
    } catch (error) {
      console.error("❌ Blockchain read error:", error);
      throw new Error(`Failed to get POA: ${error.message}`);
    }
  }

  /**
   * Check if user has POA for a task
   * @param {string} userAddress - User's wallet address
   * @param {string} taskId - Task identifier
   * @returns {Promise<Object>} { exists, tokenId }
   */
  async hasPOA(userAddress, taskId) {
    try {
      const result = await this.contract.hasPOA(userAddress, taskId);
      return {
        exists: result[0],
        tokenId: result[1].toString(),
      };
    } catch (error) {
      console.error("❌ Blockchain read error:", error);
      throw new Error(`Failed to check POA: ${error.message}`);
    }
  }

  /**
   * Check if user can mint (cooldown check)
   * @param {string} userAddress - User's wallet address
   * @returns {Promise<Object>} { canMint, timeRemaining }
   */
  async canUserMint(userAddress) {
    try {
      const result = await this.contract.canUserMint(userAddress);
      return {
        canMint: result[0],
        timeRemaining: result[1].toString(),
      };
    } catch (error) {
      console.error("❌ Blockchain read error:", error);
      throw new Error(`Failed to check cooldown: ${error.message}`);
    }
  }
}

// Export singleton instance (lazy initialization to handle missing env vars)
let blockchainServiceInstance = null;

export const blockchainService = (() => {
  if (!blockchainServiceInstance) {
    try {
      blockchainServiceInstance = new BlockchainService();
    } catch (error) {
      console.warn("⚠️  Blockchain service initialization failed:", error.message);
      blockchainServiceInstance = new BlockchainService(); // Will create with nulls
    }
  }
  return blockchainServiceInstance;
})();
