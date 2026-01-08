# POA dApp - Project Structure Guide

This document explains every folder and file in the project structure.

## Root Level

```
POA/
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend API server
├── contracts/         # Solidity smart contracts
├── shared/            # Shared code between frontend and backend
├── docs/              # Additional documentation
├── .gitignore         # Git ignore rules
├── package.json       # Root workspace configuration
├── README.md          # Main project readme
├── ARCHITECTURE.md    # System architecture explanation
└── PROJECT_STRUCTURE.md  # This file
```

---

## 📁 frontend/ - React.js Application

**Purpose**: User-facing web interface

### Structure:
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── WalletButton.js      # MetaMask connect button
│   │   ├── AttentionTimer.js    # Attention tracking timer
│   │   ├── POACard.js           # Display POA token card
│   │   └── TaskCard.js          # Task display component
│   │
│   ├── pages/          # Main application pages
│   │   ├── Home.js              # Landing page
│   │   ├── Dashboard.js         # User dashboard
│   │   ├── TaskView.js          # Individual task page
│   │   └── POAGallery.js        # View all user POAs
│   │
│   ├── services/       # External service integrations
│   │   ├── api.js               # Backend API client
│   │   ├── blockchain.js        # Smart contract interactions
│   │   └── ipfs.js              # IPFS helper functions
│   │
│   ├── hooks/          # Custom React hooks
│   │   ├── useWallet.js         # Wallet connection hook
│   │   ├── useAttention.js      # Attention tracking hook
│   │   └── usePOA.js            # POA token management hook
│   │
│   ├── contexts/       # React Context providers
│   │   ├── WalletContext.js     # Global wallet state
│   │   └── POAContext.js        # Global POA state
│   │
│   ├── utils/          # Helper functions
│   │   ├── formatters.js        # Date/time formatters
│   │   ├── validators.js        # Input validation
│   │   └── constants.js         # Frontend constants
│   │
│   ├── App.js          # Main App component
│   └── index.js        # React entry point
│
├── public/             # Static assets
│   ├── index.html
│   └── assets/         # Images, icons, etc.
│
├── package.json        # Frontend dependencies
└── README.md           # Frontend documentation
```

### Key Responsibilities:
- **components/**: Reusable UI building blocks
- **pages/**: Full page views and routing
- **services/**: All external API and blockchain calls
- **hooks/**: Reusable stateful logic
- **contexts/**: Global state management (wallet, POA tokens)
- **utils/**: Pure helper functions

---

## 📁 backend/ - Node.js API Server

**Purpose**: Server-side validation, IPFS management, and blockchain triggers

### Structure:
```
backend/
├── src/
│   ├── routes/         # API endpoint definitions
│   │   ├── attention.js        # POST /api/attention/start, /heartbeat, /end
│   │   ├── poa.js              # GET /api/poa/:tokenId, POST /api/poa/mint
│   │   └── ipfs.js             # GET /api/ipfs/:hash (proxy endpoint)
│   │
│   ├── controllers/    # Business logic handlers
│   │   ├── attentionController.js    # Validate attention sessions
│   │   ├── poaController.js          # Generate and mint POAs
│   │   └── botDetectionController.js  # Bot detection algorithms
│   │
│   ├── services/       # External service integrations
│   │   ├── ipfsService.js      # IPFS client (Pinata/Infura)
│   │   ├── blockchainService.js  # Smart contract interaction
│   │   └── validationService.js  # Data validation utilities
│   │
│   ├── middleware/     # Express middleware
│   │   ├── auth.js             # Wallet signature verification
│   │   ├── validation.js       # Request body validation
│   │   └── errorHandler.js     # Centralized error handling
│   │
│   ├── models/         # Data models and schemas
│   │   ├── attentionSession.js  # Session data structure
│   │   └── poaProof.js          # POA proof data structure
│   │
│   ├── utils/          # Helper functions
│   │   ├── botDetection.js     # Bot detection algorithms
│   │   ├── timeUtils.js        # Time calculations
│   │   └── logger.js           # Logging utilities
│   │
│   └── server.js       # Express app entry point
│
├── config/             # Configuration files
│   └── config.js       # Environment variables, IPFS settings
│
├── package.json        # Backend dependencies
└── README.md           # Backend documentation
```

### Key Responsibilities:
- **routes/**: Define API endpoints and map to controllers
- **controllers/**: Handle request logic and call services
- **services/**: Integrate with IPFS, blockchain, external APIs
- **middleware/**: Request validation, authentication, error handling
- **models/**: Data structures and validation schemas
- **utils/**: Pure helper functions (bot detection, calculations)

---

## 📁 contracts/ - Solidity Smart Contracts

**Purpose**: Blockchain logic for POA tokens on Polygon

### Structure:
```
contracts/
├── contracts/          # Solidity source files
│   └── POAToken.sol    # Main POA token/NFT contract
│
├── scripts/            # Deployment and interaction scripts
│   ├── deploy.js       # Deploy contract to Polygon
│   ├── verify.js       # Verify contract on PolygonScan
│   └── interact.js     # Test contract interactions
│
├── test/               # Contract unit tests
│   └── POAToken.test.js  # Hardhat tests
│
├── hardhat.config.js   # Hardhat configuration (networks, compiler)
├── package.json        # Contract dependencies (Hardhat, ethers)
└── README.md           # Contracts documentation
```

### Key Responsibilities:
- **contracts/**: Solidity code for POA token minting and management
- **scripts/**: Deployment automation and testing scripts
- **test/**: Unit tests for contract functionality
- **hardhat.config.js**: Network settings (Polygon mainnet/testnet)

---

## 📁 shared/ - Shared Code

**Purpose**: Code used by both frontend and backend

### Structure:
```
shared/
├── types/              # TypeScript/JavaScript type definitions
│   ├── attention.ts    # Attention session types
│   ├── poa.ts          # POA token types
│   └── api.ts          # API request/response types
│
├── constants/          # Shared constants
│   └── config.js       # Min attention time, heartbeat interval, etc.
│
└── utils/              # Shared utility functions
    └── validators.js   # Common validation logic
```

### Key Responsibilities:
- **types/**: Type definitions to ensure consistency between frontend/backend
- **constants/**: Shared configuration values
- **utils/**: Functions used by both layers

---

## 📁 docs/ - Documentation

**Purpose**: Additional documentation, diagrams, guides

### Structure:
```
docs/
├── API.md              # Backend API documentation
├── CONTRACTS.md        # Smart contract documentation
├── DEPLOYMENT.md       # Deployment guide
└── TROUBLESHOOTING.md  # Common issues and solutions
```

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `WalletButton.js`)
- **Utilities/Services**: camelCase (e.g., `apiService.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MIN_ATTENTION_TIME`)
- **Contracts**: PascalCase (e.g., `POAToken.sol`)

---

## Data Flow Example

1. **User starts task** → `frontend/src/pages/TaskView.js`
2. **Timer begins** → `frontend/src/hooks/useAttention.js`
3. **Heartbeat sent** → `frontend/src/services/api.js` → `backend/src/routes/attention.js`
4. **Validation** → `backend/src/controllers/attentionController.js`
5. **Bot check** → `backend/src/utils/botDetection.js`
6. **Proof generated** → `backend/src/services/ipfsService.js` (upload to IPFS)
7. **Mint POA** → `backend/src/services/blockchainService.js` → `contracts/contracts/POAToken.sol`
8. **Display POA** → `frontend/src/pages/Dashboard.js`

---

## Next Steps

1. Set up package.json files with dependencies
2. Create configuration files (.env templates)
3. Implement smart contract
4. Build backend API
5. Build frontend UI
6. Connect all layers
