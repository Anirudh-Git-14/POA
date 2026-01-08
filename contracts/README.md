# POA Smart Contracts

Solidity smart contracts for the Proof-of-Attention dApp on Polygon.

## Contract: POAToken.sol

Main contract that mints and manages POA tokens.

### Features

- ✅ One POA per user per task (prevents duplicates)
- ✅ Stores: user address, taskId, timestamp, IPFS hash
- ✅ Anti-spam cooldown mechanism
- ✅ Public verification functions
- ✅ Event emissions for transparency

### Key Functions

#### Minting
- `mintPOA(address, string taskId, string ipfsHash)` - Mint a new POA token

#### Verification
- `getPOA(uint256 tokenId)` - Get POA data by token ID
- `hasPOA(address, string taskId)` - Check if user has POA for task
- `canUserMint(address)` - Check cooldown status
- `totalSupply()` - Get total POA tokens minted

#### Admin
- `setCooldownPeriod(uint256)` - Update cooldown (owner only)
- `transferOwnership(address)` - Transfer ownership (owner only)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_api_key_here
```

3. Compile contracts:
```bash
npm run compile
```

4. Run tests:
```bash
npm run test
```

5. Deploy to Mumbai testnet:
```bash
npm run deploy:mumbai
```

6. Deploy to Polygon mainnet:
```bash
npm run deploy:polygon
```

## Design Decisions

See `DESIGN.md` for detailed explanations of design choices.
