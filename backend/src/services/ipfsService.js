import { create } from "ipfs-http-client";

/**
 * IPFS Service
 * Handles uploading proof metadata to IPFS
 * 
 * Supports multiple providers:
 * - Pinata (recommended for hackathon)
 * - Infura
 * - Local IPFS node
 */

class IPFSService {
  constructor() {
    const provider = process.env.IPFS_PROVIDER || "pinata";

    if (provider === "pinata") {
      // Pinata API (recommended for hackathon)
      this.client = create({
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        headers: {
          pinata_api_key: process.env.IPFS_API_KEY,
          pinata_secret_api_key: process.env.IPFS_SECRET_KEY,
        },
      });
    } else if (provider === "infura") {
      // Infura IPFS
      const projectId = process.env.IPFS_PROJECT_ID;
      const projectSecret = process.env.IPFS_PROJECT_SECRET;
      const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`;

      this.client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });
    } else {
      // Local IPFS node (for development)
      this.client = create({
        url: process.env.IPFS_URL || "http://localhost:5001",
      });
    }

    this.provider = provider;
  }

  /**
   * Upload proof metadata to IPFS
   * @param {Object} proofMetadata - Proof data to upload
   * @returns {Promise<string>} IPFS hash (CID)
   */
  async uploadProof(proofMetadata) {
    try {
      console.log(`📤 Uploading to IPFS using ${this.provider}...`);

      // Convert metadata to JSON string
      const jsonString = JSON.stringify(proofMetadata, null, 2);
      const buffer = Buffer.from(jsonString);

      // Upload to IPFS
      let result;

      if (this.provider === "pinata") {
        // Pinata uses their own API
        const FormData = (await import("form-data")).default;
        const axios = (await import("axios")).default;
        const formData = new FormData();
        formData.append("file", buffer, {
          filename: `poa-proof-${Date.now()}.json`,
        });

        const pinataMetadata = JSON.stringify({
          name: `POA Proof - ${proofMetadata.taskId}`,
        });
        formData.append("pinataMetadata", pinataMetadata);

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: process.env.IPFS_API_KEY,
              pinata_secret_api_key: process.env.IPFS_SECRET_KEY,
              ...formData.getHeaders(),
            },
          }
        );

        result = { cid: response.data.IpfsHash };
      } else {
        // Standard IPFS client
        result = await this.client.add(buffer);
      }

      const ipfsHash = result.cid.toString();
      console.log(`✅ Uploaded to IPFS: ${ipfsHash}`);

      return ipfsHash;
    } catch (error) {
      console.error("❌ IPFS upload error:", error);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  /**
   * Get proof metadata from IPFS
   * @param {string} ipfsHash - IPFS hash (CID)
   * @returns {Promise<Object>} Proof metadata
   */
  async getProof(ipfsHash) {
    try {
      // Fetch from IPFS gateway
      const gateway = process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs/";
      const axios = (await import("axios")).default;
      const response = await axios.get(`${gateway}${ipfsHash}`);

      return response.data;
    } catch (error) {
      console.error("❌ IPFS fetch error:", error);
      throw new Error(`Failed to fetch from IPFS: ${error.message}`);
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
