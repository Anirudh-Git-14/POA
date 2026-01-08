# POA Frontend

React.js frontend for the Proof-of-Attention dApp.

## Features

- ✅ MetaMask wallet connection
- ✅ Attention task tracking
- ✅ Automatic heartbeat sending (every 30 seconds)
- ✅ POA token minting
- ✅ POA display with IPFS links

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env.local` file:**
```bash
cp .env.example .env.local
# Edit if needed (defaults work for local development)
```

3. **Start development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Approve connection in MetaMask

2. **Start Attention Task**
   - Enter a task ID (or use default)
   - Click "Start Attention Task"
   - Keep the tab active (heartbeats sent automatically)

3. **End Task & Mint POA**
   - After at least 5 minutes, click "End Task & Mint POA"
   - Wait for transaction confirmation
   - View your POA token details

## Components

- **WalletButton** - MetaMask connection UI
- **AttentionTask** - Task tracking and controls
- **POADisplay** - Display minted POA details

## Hooks

- **useWallet** - MetaMask wallet connection logic
- **useAttention** - Attention tracking and heartbeat management

## Services

- **api.js** - Backend API calls (axios)

## Environment Variables

- `REACT_APP_BACKEND_URL` - Backend API URL (default: http://localhost:3001)
- `REACT_APP_IPFS_GATEWAY` - IPFS gateway URL (default: https://ipfs.io/ipfs/)

## Notes

- Requires MetaMask browser extension
- Backend must be running at configured URL
- Heartbeats sent every 30 seconds automatically
- Minimum attention duration: 5 minutes (configurable in backend)
