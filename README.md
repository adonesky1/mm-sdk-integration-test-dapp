# MetaMask SDK Exercise DApp

A comprehensive base dapp for testing various MetaMask SDK integration approaches. This dapp provides extensive wallet functionality without any SDK integration, making it perfect for the MetaMask SDK Developer Experience Exercise.

## Overview

This dapp includes comprehensive wallet functionality that covers:

- **Wallet Connection**: Connect, disconnect, and manage wallet permissions
- **Account Information**: Get balances, transaction counts, and account details
- **Network Management**: Switch networks, add custom networks, get network info
- **Signing Methods**: Personal sign, typed data signing (v1, v3, v4), transaction signing
- **Transaction Methods**: Send transactions, estimate gas, get transaction details
- **Token Methods**: Watch assets, get token balances, transfer tokens
- **Contract Methods**: Call contracts, send contract transactions, get contract code
- **Encryption Methods**: Get encryption keys, encrypt/decrypt messages
- **Event Listeners**: Listen for account changes, network changes, and connection events

## Features

### Comprehensive Wallet Integration
- Full EIP-1193 provider integration
- Support for all major wallet methods
- Real-time event listening
- Error handling and user feedback

### Developer-Friendly Interface
- Clear categorization of wallet methods
- Input validation and error messages
- Results display with JSON formatting
- Interactive testing capabilities

### Testing Capabilities
- Pre-filled examples for common operations
- Support for custom parameters
- Real-time event logging
- Network and account switching tests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone or download this dapp
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect to MetaMask
2. **Explore Features**: Use the various sections to test different wallet methods
3. **Monitor Events**: Set up event listeners to see real-time wallet events
4. **Test Functionality**: Try different operations and observe the results

## SDK Integration Exercise

This dapp is designed to be used as a base for testing different MetaMask SDK integration approaches:

### Integration Approaches to Test

1. **Direct npm Installation**
   - Install MetaMask SDK directly
   - Replace window.ethereum calls with SDK methods
   - Test direct SDK integration

2. **wagmi Integration**
   - Integrate wagmi library
   - Use wagmi hooks and providers
   - Compare with direct SDK approach

3. **RainbowKit Integration**
   - Add RainbowKit wallet connection
   - Test RainbowKit's MetaMask integration
   - Evaluate UX differences

4. **Dynamic Integration**
   - Implement dynamic SDK loading
   - Test different environments
   - Handle various user scenarios

### Exercise Deliverables

For each integration approach, document:

1. **Setup & Implementation**
   - Steps taken to implement the SDK
   - Any deviations from official docs
   - Relevant code snippets

2. **Developer Experience Observations**
   - Documentation clarity
   - Setup difficulty
   - Points of confusion
   - Errors encountered
   - Workarounds needed

3. **Evaluation**
   - Time required for implementation
   - Overall experience smoothness
   - Suggestions for improvements

4. **Comparison Notes**
   - Differences between integration approaches
   - Pros and cons of each method
   - Recommendations for different use cases

## Project Structure

```
src/
├── components/
│   ├── WalletConnection.tsx    # Wallet connection methods
│   ├── AccountInfo.tsx         # Account information methods
│   ├── NetworkInfo.tsx         # Network management methods
│   ├── SigningMethods.tsx      # Message and transaction signing
│   ├── TransactionMethods.tsx  # Transaction sending and management
│   ├── TokenMethods.tsx        # Token operations
│   ├── ContractMethods.tsx     # Smart contract interactions
│   ├── EncryptionMethods.tsx   # Encryption and decryption
│   └── EventListeners.tsx      # Event listening and management
├── types.ts                    # TypeScript type definitions
├── App.tsx                     # Main application component
├── App.css                     # Application styles
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Key Wallet Methods Implemented

### Connection Methods
- `eth_requestAccounts` - Request account access
- `eth_accounts` - Get connected accounts
- `wallet_getPermissions` - Get current permissions
- `wallet_requestPermissions` - Request new permissions
- `wallet_revokePermissions` - Revoke permissions

### Account Methods
- `eth_getBalance` - Get account balance
- `eth_getTransactionCount` - Get account nonce
- `eth_getCode` - Get contract code
- `eth_getStorageAt` - Get contract storage

### Network Methods
- `eth_chainId` - Get current chain ID
- `net_version` - Get network version
- `eth_gasPrice` - Get current gas price
- `eth_blockNumber` - Get latest block number
- `wallet_switchEthereumChain` - Switch networks
- `wallet_addEthereumChain` - Add custom networks

### Signing Methods
- `personal_sign` - Sign messages
- `eth_signTypedData` - Sign typed data (legacy)
- `eth_signTypedData_v3` - Sign typed data v3
- `eth_signTypedData_v4` - Sign typed data v4
- `eth_signTransaction` - Sign transactions
- `eth_getEncryptionPublicKey` - Get encryption key

### Transaction Methods
- `eth_sendTransaction` - Send transactions
- `eth_sendRawTransaction` - Send raw transactions
- `eth_estimateGas` - Estimate gas costs
- `eth_getTransactionByHash` - Get transaction details
- `eth_getTransactionReceipt` - Get transaction receipt

### Token Methods
- `wallet_watchAsset` - Add tokens to wallet
- `eth_call` - Call contract methods (for token operations)

### Event Listeners
- `accountsChanged` - Account switching events
- `chainChanged` - Network switching events
- `connect` - Wallet connection events
- `disconnect` - Wallet disconnection events

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

The dapp is designed to be easily customizable:

1. **Add New Methods**: Create new components for additional wallet methods
2. **Modify UI**: Update styles in CSS files
3. **Add Features**: Extend functionality as needed
4. **Test Integration**: Use as base for SDK integration testing

## Contributing

This dapp is designed for educational and testing purposes. Feel free to:

- Add new wallet methods
- Improve the UI/UX
- Add more comprehensive error handling
- Create additional test scenarios

## License

MIT License - feel free to use this dapp for your SDK integration exercises and testing.

## Support

For questions about the MetaMask SDK integration exercise, refer to:

- [MetaMask SDK Documentation](https://docs.metamask.io/embedded-wallets/sdk)
- [MetaMask SDK Examples](https://metamask-sdk-examples.vercel.app/)
- [wagmi Documentation](https://wagmi.sh/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
