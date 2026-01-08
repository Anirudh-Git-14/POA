# Quick Start Guide - Project Structure

## 📋 What We've Created

A complete folder structure for a Proof-of-Attention Web3 dApp with clear separation between:
- **Frontend** (React.js)
- **Backend** (Node.js)
- **Smart Contracts** (Solidity)
- **Shared Code**

## 📂 Main Folders Explained

### 1. `frontend/` - User Interface
**Technology**: React.js
**Purpose**: Everything the user sees and interacts with
- Components: Reusable UI pieces (buttons, cards, timers)
- Pages: Full screens (dashboard, task view)
- Services: Calls to backend API and blockchain
- Hooks: Reusable logic (wallet connection, attention tracking)
- Contexts: Global state (wallet, POA tokens)

### 2. `backend/` - API Server
**Technology**: Node.js (Express)
**Purpose**: Validates attention, manages IPFS, triggers blockchain
- Routes: API endpoints (`/api/attention/start`, etc.)
- Controllers: Business logic (validation, bot detection)
- Services: IPFS and blockchain integrations
- Middleware: Authentication, validation, error handling
- Models: Data structures

### 3. `contracts/` - Smart Contracts
**Technology**: Solidity (Hardhat)
**Purpose**: Blockchain logic for POA tokens on Polygon
- Contracts: Solidity code for minting POA tokens
- Scripts: Deployment automation
- Test: Unit tests for contracts

### 4. `shared/` - Common Code
**Purpose**: Code used by both frontend and backend
- Types: Data structure definitions
- Constants: Shared configuration values
- Utils: Common helper functions

## 🔄 How They Work Together

```
User Action (Frontend)
    ↓
API Call (Frontend → Backend)
    ↓
Validation (Backend)
    ↓
IPFS Upload (Backend → IPFS)
    ↓
Blockchain Mint (Backend → Smart Contract)
    ↓
Display POA (Frontend reads from Blockchain)
```

## 📝 Key Files to Create

### Environment Variables
Create these files (copy from examples when provided):
- `backend/.env` - Backend configuration (IPFS keys, RPC URL, private key)
- `frontend/.env.local` - Frontend configuration (API URL, contract address)

### Entry Points
- `frontend/src/index.js` - React app entry
- `backend/src/server.js` - Express server entry
- `contracts/contracts/POAToken.sol` - Main smart contract

## 🎯 Next Steps

1. **Set up dependencies**: Install npm packages in each folder
2. **Configure environment**: Set up `.env` files
3. **Start with contracts**: Write and deploy smart contract
4. **Build backend**: Create API endpoints
5. **Build frontend**: Create UI components
6. **Connect**: Wire everything together

## 📚 Documentation Files

- `PROJECT_STRUCTURE.md` - Detailed explanation of every folder
- `FOLDER_EXPLANATION.md` - Quick reference for what goes where
- `ARCHITECTURE.md` - System architecture overview
- `STRUCTURE_TREE.txt` - Visual folder tree

## 💡 Tips

- Each folder has a `README.md` explaining its purpose
- `.gitkeep` files ensure empty folders are tracked in git
- Start simple: basic timer → IPFS → mint token
- Test each layer independently before connecting
