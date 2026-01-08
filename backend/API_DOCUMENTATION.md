# POA Backend API Documentation

Complete API reference for the Proof-of-Attention backend.

## Base URL

```
http://localhost:3001
```

## Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "POA Backend API is running"
}
```

---

### Attention Tracking

#### `POST /api/attention/start`

Start a new attention tracking session.

**Request Body:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "taskId": "task-001"
}
```

**Validation:**
- `userAddress`: Valid Ethereum address (0x...)
- `taskId`: Non-empty string

**Response:**
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "startedAt": 1703123456789
}
```

**Errors:**
- `400`: Missing or invalid fields
- `500`: Server error

---

#### `POST /api/attention/heartbeat`

Send periodic heartbeat to prove active attention. Frontend should call this every 30 seconds while user is actively engaged.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "timestamp": 1703123456789
}
```

**Note:** `timestamp` is optional - server will use current time if not provided.

**Response:**
```json
{
  "success": true,
  "received": true,
  "timestamp": 1703123456789,
  "heartbeatCount": 5
}
```

**Errors:**
- `400`: Missing fields or session already ended
- `403`: User address doesn't match session
- `404`: Session not found
- `500`: Server error

---

#### `POST /api/attention/end`

End attention session and mint POA token if validation passes.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Validation Checks:**
1. Session exists and not already ended
2. User address matches session
3. Minimum duration met (default: 5 minutes)
4. Bot detection score < 0.7

**Response (Success):**
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "tokenId": "1",
  "ipfsHash": "QmXxx123...",
  "transactionHash": "0xabc123...",
  "duration": 300000,
  "heartbeatCount": 10
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Attention duration too short. Minimum: 300000ms, Actual: 120000ms",
  "duration": 120000,
  "minDuration": 300000
}
```

**Errors:**
- `400`: Validation failed (duration, bot detection, etc.)
- `403`: User address doesn't match
- `404`: Session not found
- `500`: Server error (IPFS upload, blockchain mint, etc.)

---

### POA Queries

#### `GET /api/poa/:tokenId`

Get POA data by token ID from blockchain.

**URL Parameters:**
- `tokenId`: Token ID (number)

**Example:**
```
GET /api/poa/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "taskId": "task-001",
    "timestamp": "1703123456",
    "ipfsHash": "QmXxx123..."
  }
}
```

**Errors:**
- `400`: Invalid tokenId
- `500`: Blockchain read error

---

#### `GET /api/poa/user/:userAddress`

Get all POAs for a user.

**Note:** This is a placeholder endpoint. Full implementation requires:
- Event indexing (The Graph subgraph)
- Database storage of minted POAs
- Caching layer

**URL Parameters:**
- `userAddress`: User's wallet address

**Example:**
```
GET /api/poa/user/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Response:**
```json
{
  "success": true,
  "message": "User POA querying requires event indexing. Use getPOA with specific tokenId.",
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "note": "To implement: Index POAMinted events or use The Graph subgraph"
}
```

---

## Flow Example

### Complete Attention Session Flow

1. **Start Session**
```bash
POST /api/attention/start
{
  "userAddress": "0x...",
  "taskId": "task-001"
}
# Returns: { sessionId: "uuid-here", startedAt: 1234567890 }
```

2. **Send Heartbeats** (every 30 seconds)
```bash
POST /api/attention/heartbeat
{
  "sessionId": "uuid-here",
  "userAddress": "0x..."
}
# Repeat until session ends
```

3. **End Session & Mint POA**
```bash
POST /api/attention/end
{
  "sessionId": "uuid-here",
  "userAddress": "0x..."
}
# Returns: { tokenId: "1", ipfsHash: "Qm...", transactionHash: "0x..." }
```

4. **Verify POA**
```bash
GET /api/poa/1
# Returns: Full POA data from blockchain
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `400`: Bad Request (validation errors)
- `403`: Forbidden (authorization errors)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (server errors)

---

## Configuration

### Environment Variables

See `.env.example` for all required variables:

- `PORT`: Server port (default: 3001)
- `POLYGON_RPC_URL`: Polygon RPC endpoint
- `PRIVATE_KEY`: Backend wallet private key
- `CONTRACT_ADDRESS`: Deployed POAToken contract
- `IPFS_API_KEY`: Pinata API key
- `IPFS_SECRET_KEY`: Pinata secret key
- `MIN_ATTENTION_TIME`: Minimum duration in ms (default: 300000)

---

## Bot Detection

The backend implements simple bot detection heuristics:

1. **Minimum Duration**: Session must last at least `MIN_ATTENTION_TIME`
2. **Heartbeat Count**: Should have ~1 heartbeat per 30 seconds
3. **Heartbeat Regularity**: Too regular or too irregular = suspicious
4. **Bot Score**: 0-1 scale, >0.7 = rejected

---

## IPFS Integration

Proof metadata is uploaded to IPFS and includes:
- User address
- Task ID
- Start/end timestamps
- Duration
- Heartbeat data
- Bot detection score

IPFS hash is stored on-chain with the POA token.

---

## Notes

- Sessions are stored in-memory (use database for production)
- Heartbeats should be sent every 30 seconds
- Minimum attention time is configurable via env var
- All addresses are normalized to lowercase
- Backend wallet must have MATIC for gas fees
