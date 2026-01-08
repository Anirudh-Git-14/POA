/**
 * POAToken Contract ABI
 * 
 * This is a minimal ABI with only the functions we need.
 * In production, you'd generate this from the compiled contract.
 */

export default [
  {
    inputs: [
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "string", name: "taskId", type: "string" },
      { internalType: "string", name: "ipfsHash", type: "string" },
    ],
    name: "mintPOA",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getPOA",
    outputs: [
      {
        components: [
          { internalType: "address", name: "userAddress", type: "address" },
          { internalType: "string", name: "taskId", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "ipfsHash", type: "string" },
        ],
        internalType: "struct POAToken.POAData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "string", name: "taskId", type: "string" },
    ],
    name: "hasPOA",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "canUserMint",
    outputs: [
      { internalType: "bool", name: "canMint", type: "bool" },
      { internalType: "uint256", name: "timeRemaining", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "userAddress", type: "address" },
      { indexed: false, internalType: "string", name: "taskId", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
      { indexed: false, internalType: "string", name: "ipfsHash", type: "string" },
    ],
    name: "POAMinted",
    type: "event",
  },
];
