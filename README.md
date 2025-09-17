# MetaMask SDK Exercise DApp

A streamlined dapp for testing MetaMask wallet integration. This dapp provides essential wallet functionality for connecting to MetaMask, managing networks, sending transactions, and watching tokens.

## Purpose

This dapp serves as a testing ground for MetaMask wallet integration, featuring:

- **Wallet Connection**: Connect and disconnect from MetaMask
- **Network Management**: Switch between networks with automatic chain addition fallback
- **Account Information**: View connected account details and balances
- **Transaction Methods**: Send transactions with customizable parameters
- **Token Methods**: Watch and add tokens to MetaMask
- **Event Listeners**: Monitor wallet events like account and network changes

## How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to the local development URL (typically `http://localhost:5173`)

4. **Connect MetaMask** to the dapp and start testing wallet functionality

## Technical Stack

- **React** with TypeScript
- **Vite** for development and building
- **EIP-1193** standard for wallet communication
- **MetaMask** provider integration

## Development

### Prerequisites
- Node.js 16+
- MetaMask browser extension

### Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT License