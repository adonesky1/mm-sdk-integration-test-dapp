// Types for wallet state
export interface WalletState {
  isConnected: boolean
  accounts: string[]
  chainId: string
  networkId: string
  balance: string
  provider: any
}

// Types for transaction parameters
export interface TransactionParams {
  to: string
  value: string
  gas?: string
  gasPrice?: string
  data?: string
}

// Types for token parameters
export interface TokenParams {
  type: 'ERC20' | 'ERC721' | 'ERC1155'
  options: {
    address: string
    symbol: string
    decimals?: number
    image?: string
    tokenId?: string
  }
}

// Types for network parameters
export interface NetworkParams {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
}

// Types for signing data
export interface SignTypedDataParams {
  domain: {
    name?: string
    version?: string
    chainId?: number
    verifyingContract?: string
  }
  types: Record<string, any>
  primaryType: string
  message: Record<string, any>
}

// Types for encryption
export interface EncryptionParams {
  publicKey: string
  data: string
  version: string
}

// Types for contract interaction
export interface ContractCallParams {
  to: string
  data: string
  value?: string
  gas?: string
}
