# Folder and File Responsibilities - Quick Reference

## 🎨 Frontend (`frontend/`)

### `src/components/`
**What goes here**: Reusable UI building blocks
- `WalletButton.js` - Connect/disconnect MetaMask button
- `AttentionTimer.js` - Visual timer showing attention duration
- `POACard.js` - Card component to display a POA token
- `TaskCard.js` - Card showing task information
- `Modal.js` - Reusable modal/dialog component

**Why separate**: Reuse across multiple pages, easier testing

---

### `src/pages/`
**What goes here**: Full page views (routes)
- `Home.js` - Landing page with project intro
- `Dashboard.js` - User's personal dashboard showing all POAs
- `TaskView.js` - Individual task page where attention is tracked
- `POAGallery.js` - Browse all user's POA tokens

**Why separate**: Each page is a complete view, matches routing structure

---

### `src/services/`
**What goes here**: All external API and blockchain calls
- `api.js` - Functions to call backend API (fetch, axios)
- `blockchain.js` - Smart contract interactions (ethers.js)
- `ipfs.js` - IPFS helper functions (if needed client-side)

**Why separate**: Centralizes external dependencies, easier to mock for testing

---

### `src/hooks/`
**What goes here**: Custom React hooks (reusable stateful logic)
- `useWallet.js` - Manages wallet connection state, account changes
- `useAttention.js` - Handles attention timer, heartbeats, session management
- `usePOA.js` - Fetches and manages POA tokens for current user

**Why separate**: Reusable logic across components, follows React patterns

---

### `src/contexts/`
**What goes here**: Global state providers
- `WalletContext.js` - Makes wallet state available to all components
- `POAContext.js` - Makes POA tokens available globally

**Why separate**: Avoids prop drilling, centralizes global state

---

### `src/utils/`
**What goes here**: Pure helper functions (no side effects)
- `formatters.js` - Format dates, numbers, addresses
- `validators.js` - Validate user input
- `constants.js` - Frontend-specific constants

**Why separate**: Pure functions, easy to test, no dependencies

---

## ⚙️ Backend (`backend/`)

### `src/routes/`
**What goes here**: API endpoint definitions (Express routes)
- `attention.js` - Routes: POST `/api/attention/start`, `/heartbeat`, `/end`
- `poa.js` - Routes: GET `/api/poa/:tokenId`, POST `/api/poa/mint`
- `ipfs.js` - Route: GET `/api/ipfs/:hash` (proxy to IPFS)

**Why separate**: Maps URLs to controllers, keeps routing organized

---

### `src/controllers/`
**What goes here**: Business logic that handles requests
- `attentionController.js` - Validates attention sessions, checks timing
- `poaController.js` - Generates POA proofs, triggers minting
- `botDetectionController.js` - Analyzes patterns to detect bots

**Why separate**: Separates routing from business logic, easier to test

---

### `src/services/`
**What goes here**: External service integrations
- `ipfsService.js` - Upload/download to IPFS (Pinata/Infura client)
- `blockchainService.js` - Call smart contract functions (ethers.js)
- `validationService.js` - Validate data structures

**Why separate**: Isolates external dependencies, easier to swap providers

---

### `src/middleware/`
**What goes here**: Express middleware (runs before controllers)
- `auth.js` - Verify wallet signatures, authenticate requests
- `validation.js` - Validate request body/params before processing
- `errorHandler.js` - Catch errors and return consistent error responses

**Why separate**: Reusable across routes, follows Express patterns

---

### `src/models/`
**What goes here**: Data structures and validation schemas
- `attentionSession.js` - Structure for attention session data
- `poaProof.js` - Structure for POA proof data

**Why separate**: Defines data contracts, ensures consistency

---

### `src/utils/`
**What goes here**: Helper functions
- `botDetection.js` - Algorithms to detect bot behavior
- `timeUtils.js` - Calculate durations, validate timestamps
- `logger.js` - Logging utilities

**Why separate**: Pure functions, reusable across controllers

---

## 🔗 Smart Contracts (`contracts/`)

### `contracts/`
**What goes here**: Solidity source code
- `POAToken.sol` - Main contract that mints POA tokens/NFTs

**Why separate**: Solidity files, compiled by Hardhat

---

### `scripts/`
**What goes here**: Deployment and interaction scripts
- `deploy.js` - Deploy contract to Polygon network
- `verify.js` - Verify contract source on PolygonScan
- `interact.js` - Test contract functions locally

**Why separate**: Automation scripts, run with Hardhat

---

### `test/`
**What goes here**: Contract unit tests
- `POAToken.test.js` - Test minting, verification, edge cases

**Why separate**: Tests run separately, keep organized

---

### `hardhat.config.js`
**What goes here**: Hardhat configuration
- Network settings (Polygon mainnet, Mumbai testnet)
- Compiler version
- Account configuration

**Why separate**: Configuration file, not code

---

## 🔄 Shared (`shared/`)

### `types/`
**What goes here**: Type definitions (TypeScript or JSDoc)
- `attention.ts` - Types for attention sessions
- `poa.ts` - Types for POA tokens
- `api.ts` - Types for API requests/responses

**Why separate**: Ensures frontend and backend use same data structures

---

### `constants/`
**What goes here**: Shared configuration values
- `config.js` - Min attention time, heartbeat interval, etc.

**Why separate**: Single source of truth for shared values

---

### `utils/`
**What goes here**: Functions used by both frontend and backend
- `validators.js` - Common validation logic

**Why separate**: Avoid code duplication

---

## 📝 Configuration Files

### `.env.example` files
**What goes here**: Template for environment variables
- Shows what variables are needed
- Copy to `.env` and fill in real values
- Never commit `.env` files (in `.gitignore`)

**Why separate**: Security (secrets not in code), easy setup

---

## 📊 Data Flow Through Folders

1. **User clicks "Start Task"**
   - `frontend/src/pages/TaskView.js` (page)
   - Calls `frontend/src/hooks/useAttention.js` (hook)
   - Hook calls `frontend/src/services/api.js` (service)
   - Service sends POST to backend

2. **Backend receives request**
   - `backend/src/routes/attention.js` (route)
   - Calls `backend/src/controllers/attentionController.js` (controller)
   - Controller uses `backend/src/services/ipfsService.js` (service)
   - Controller uses `backend/src/utils/botDetection.js` (utils)

3. **Mint POA token**
   - `backend/src/services/blockchainService.js` (service)
   - Calls `contracts/contracts/POAToken.sol` (contract)
   - Contract mints token on Polygon

4. **Display POA**
   - `frontend/src/hooks/usePOA.js` (hook)
   - Calls `frontend/src/services/blockchain.js` (service)
   - Reads from `contracts/contracts/POAToken.sol` (contract)
   - Displays in `frontend/src/pages/Dashboard.js` (page)

---

## 🎯 Key Principles

1. **Separation of Concerns**: Each folder has one clear purpose
2. **Reusability**: Components, hooks, utils can be reused
3. **Testability**: Pure functions and separated logic are easier to test
4. **Maintainability**: Clear structure makes it easy to find code
5. **Scalability**: Easy to add new features without cluttering

---

## 🚀 Next Steps

When you start coding:
1. Start with smart contracts (foundation)
2. Build backend API (validation logic)
3. Build frontend UI (user experience)
4. Connect all layers together
