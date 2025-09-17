import React from 'react'
import { WalletState } from '../types'

interface NetworkDropdownProps {
  wallet: WalletState
  onWalletUpdate: (updates: Partial<WalletState>) => void
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  results: Record<string, any>
  errors: Record<string, string>
}

const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  wallet,
  onWalletUpdate,
  onResult,
  onError,
  results,
  errors
}) => {
  const getChainParams = (chainId: string) => {
    const chainParams: { [key: string]: any } = {
      '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io']
      },
      '0x5': {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli.infura.io/v3/'],
        blockExplorerUrls: ['https://goerli.etherscan.io']
      },
      '0xaa36a7': {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      },
      '0x539': {
        chainId: '0x539',
        chainName: 'Localhost',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://localhost:8545'],
        blockExplorerUrls: []
      },
      '0x89': {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
      },
      '0x13881': {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      },
      '0xa': {
        chainId: '0xa',
        chainName: 'Optimism',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.optimism.io'],
        blockExplorerUrls: ['https://optimistic.etherscan.io']
      },
      '0x420': {
        chainId: '0x420',
        chainName: 'Optimism Goerli',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli.optimism.io'],
        blockExplorerUrls: ['https://goerli-optimism.etherscan.io']
      },
      '0xa4b1': {
        chainId: '0xa4b1',
        chainName: 'Arbitrum One',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io']
      },
      '0x66eed': {
        chainId: '0x66eed',
        chainName: 'Arbitrum Goerli',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://goerli.arbiscan.io']
      }
    }
    return chainParams[chainId]
  }

  const addEthereumChain = async (chainId: string) => {
    const chainParams = getChainParams(chainId)
    if (!chainParams) {
      throw new Error(`No chain parameters found for chain ID: ${chainId}`)
    }

    await wallet.provider.request({
      method: 'wallet_addEthereumChain',
      params: [chainParams]
    })
  }

  const switchEthereumChain = async (chainId: string) => {
    try {
      onError('networkSwitch', '')
      onResult('networkSwitch', '')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      try {
        // First attempt to switch to the chain
        await wallet.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        })
      } catch (switchError: any) {
        // Check if it's the "unrecognized chain" error (code 4902)
        if (switchError.code === 4902) {
          console.log(`Chain ${chainId} not recognized, attempting to add it...`)
          
          try {
            // Attempt to add the chain
            await addEthereumChain(chainId)
            
            // After adding, try switching again
            await wallet.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }]
            })
            
            onResult('networkSwitch', {
              message: `Successfully added and switched to network ${getNetworkName(chainId)}`,
              chainId,
              action: 'added_and_switched'
            })
          } catch (addError) {
            console.error('Error adding chain:', addError)
            throw new Error(`Failed to add chain ${chainId}: ${addError.message}`)
          }
        } else {
          // Re-throw if it's not the unrecognized chain error
          throw switchError
        }
      }

      // Update wallet state after successful switch
      const newChainId = await wallet.provider.request({ method: 'eth_chainId' })
      const newNetworkId = await wallet.provider.request({ method: 'net_version' })

      onWalletUpdate({
        chainId: newChainId,
        networkId: newNetworkId
      })

      // Only show success message if we didn't already show the "added_and_switched" message
      if (!results.networkSwitch?.action) {
        onResult('networkSwitch', {
          message: 'Successfully switched network',
          newChainId,
          newNetworkId
        })
      }
    } catch (error: any) {
      console.error('Error switching chain:', error)
      onError('networkSwitch', `Failed to switch network: ${error.message}`)
    }
  }

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x539': 'Localhost',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0xa': 'Optimism',
      '0x420': 'Optimism Goerli',
      '0xa4b1': 'Arbitrum One',
      '0x66eed': 'Arbitrum Goerli'
    }
    return networks[chainId] || `Chain ${chainId}`
  }

  const getCurrentNetworkName = () => {
    return getNetworkName(wallet.chainId)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Network:</span>
        <select
          value={wallet.chainId}
          onChange={(e) => switchEthereumChain(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #646cff',
            backgroundColor: '#2a2a2a',
            color: '#ffffff',
            fontSize: '0.9rem',
            minWidth: '200px'
          }}
        >
          <option value="0x1">Ethereum Mainnet</option>
          <option value="0x5">Goerli Testnet</option>
          <option value="0xaa36a7">Sepolia Testnet</option>
          <option value="0x539">Localhost</option>
          <option value="0x89">Polygon Mainnet</option>
          <option value="0x13881">Polygon Mumbai</option>
          <option value="0xa">Optimism</option>
          <option value="0x420">Optimism Goerli</option>
          <option value="0xa4b1">Arbitrum One</option>
          <option value="0x66eed">Arbitrum Goerli</option>
        </select>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>
          {getCurrentNetworkName()}
        </span>
      </div>

      {/* Network switch results and errors */}
      {(results.networkSwitch || errors.networkSwitch) && (
        <div style={{ marginTop: '1rem' }}>
          {results.networkSwitch && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'rgba(76, 175, 80, 0.1)', 
              border: '1px solid #4caf50', 
              borderRadius: '6px',
              marginBottom: '0.5rem'
            }}>
              <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>
                {JSON.stringify(results.networkSwitch, null, 2)}
              </div>
            </div>
          )}
          {errors.networkSwitch && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: 'rgba(244, 67, 54, 0.1)', 
              border: '1px solid #f44336', 
              borderRadius: '6px'
            }}>
              <div style={{ color: '#f44336', fontSize: '0.9rem' }}>
                {errors.networkSwitch}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NetworkDropdown
