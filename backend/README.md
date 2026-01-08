# POA Backend API

Node.js Express backend for the Proof-of-Attention dApp.

## Features

- ✅ Attention session management
- ✅ Heartbeat tracking
- ✅ Bot detection
- ✅ IPFS integration (proof storage)
- ✅ Blockchain integration (POA minting)
- ✅ Input validation
- ✅ Error handling

## API Endpoints

### Attention Tracking

#### `POST /api/attention/start`
Start a new attention tracking session.

**Request Body:**
```json
{
  "userAddress": "0x...",
  "taskId": "task-001"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "startedAt": 1234567890
}
```

#### `POST /api/attention/heartbeat`
Send periodic heartbeat (every 30 seconds).

**Request Body:**
```json
{
  "sessionId": "uuid-here",
  "userAddress": "0x...",
  "timestamp": 1234567890
}
```

**Response:**
```json
{
  "success": true,
  "received": true,
  "timestamp": 1234567890,
  "heartbeatCount": 5
}
```

#### `POST /api/attention/end`
End session and mint POA if valid.

**Request Body:**
```json
{
  "sessionId": "uuid-here",
  "userAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "tokenId": "1",
  "ipfsHash": "QmXxx...",
  "transactionHash": "0x...",
  "duration": 300000,
  "heartbeatCount": 10
}
```

### POA Queries

#### `GET /api/poa/:tokenId`
Get POA data by token ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "userAddress": "0x...",
    "taskId": "task-001",
    "timestamp": "1234567890",
    "ipfsHash": "QmXxx..."
  }
}
```

#### `GET /api/poa/user/:userAddress`
Get all POAs for a user (placeholder - requires event indexing).

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Required environment variables:**
- `POLYGON_RPC_URL` - Polygon RPC endpoint
- `PRIVATE_KEY` - Backend wallet private key
- `CONTRACT_ADDRESS` - Deployed POAToken contract address
- `IPFS_API_KEY` & `IPFS_SECRET_KEY` - Pinata credentials (or Infura)

4. **Start server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Architecture

- **Routes** (`src/routes/`) - API endpoint definitions
- **Controllers** (`src/controllers/`) - Business logic
- **Services** (`src/services/`) - IPFS and blockchain integration
- **Middleware** (`src/middleware/`) - Validation and error handling
- **Models** (`src/models/`) - Data structures (in-memory for hackathon)
- **Utils** (`src/utils/`) - Helper functions (bot detection)

## IPFS Providers

Supports multiple IPFS providers:

1. **Pinata** (Recommended for hackathon)
   - Easy setup
   - Free tier available
   - Reliable pinning

2. **Infura**
   - IPFS API access
   - Requires project credentials

3. **Local IPFS Node**
   - For development
   - Requires local IPFS daemon

## Bot Detection

Simple heuristics:
- Minimum duration check
- Heartbeat regularity analysis
- Heartbeat count validation

Can be enhanced with ML models for production.

## Notes

- Sessions stored in-memory (use database for production)
- User POA querying requires event indexing (use The Graph subgraph)
- Bot detection is hackathon-level (enhance for production)
