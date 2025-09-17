import React from 'react'
import { WalletState } from '../types'

interface WalletConnectionProps {
  wallet: WalletState
  onWalletUpdate: (updates: Partial<WalletState>) => void
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  onClearResult: (key: string) => void
  onClearError: (key: string) => void
  results: Record<string, any>
  errors: Record<string, string>
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  wallet,
  onWalletUpdate,
  onResult,
  onError,
  onClearResult,
  onClearError,
  results,
  errors
}) => {
  const connectWallet = async () => {
    try {
      onClearError('connect')
      onClearResult('connect')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts'
      })

      const chainId = await wallet.provider.request({ method: 'eth_chainId' })
      const networkId = await wallet.provider.request({ method: 'net_version' })

      const balance = await wallet.provider.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      })

      onWalletUpdate({
        isConnected: true,
        accounts,
        chainId,
        networkId,
        balance
      })

      onResult('connect', {
        accounts,
        chainId,
        networkId,
        balance
      })
    } catch (error) {
      console.error('Error connecting wallet:', error)
      onError('connect', `Failed to connect wallet: ${error.message}`)
    }
  }

  const disconnectWallet = async () => {
    try {
      onClearError('disconnect')
      onClearResult('disconnect')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      // Request to revoke permissions
      await wallet.provider.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      })

      onWalletUpdate({
        isConnected: false,
        accounts: [],
        chainId: '',
        networkId: '',
        balance: '0'
      })

      onResult('disconnect', 'Wallet disconnected successfully')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      onError('disconnect', `Failed to disconnect wallet: ${error.message}`)
    }
  }

  const getAccounts = async () => {
    try {
      onClearError('getAccounts')
      onClearResult('getAccounts')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const accounts = await wallet.provider.request({
        method: 'eth_accounts'
      })

      onResult('getAccounts', { accounts })
    } catch (error) {
      console.error('Error getting accounts:', error)
      onError('getAccounts', `Failed to get accounts: ${error.message}`)
    }
  }

  const getPermissions = async () => {
    try {
      onClearError('getPermissions')
      onClearResult('getPermissions')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const permissions = await wallet.provider.request({
        method: 'wallet_getPermissions'
      })

      onResult('getPermissions', { permissions })
    } catch (error) {
      console.error('Error getting permissions:', error)
      onError('getPermissions', `Failed to get permissions: ${error.message}`)
    }
  }

  const requestPermissions = async () => {
    try {
      onClearError('requestPermissions')
      onClearResult('requestPermissions')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const permissions = await wallet.provider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })

      onResult('requestPermissions', { permissions })
    } catch (error) {
      console.error('Error requesting permissions:', error)
      onError('requestPermissions', `Failed to request permissions: ${error.message}`)
    }
  }

  return (
    <div className="section">
      <h2>Wallet Connection</h2>

      <div className="card">
        <h3>Connection Methods</h3>
        <div className="button-group">
          <button onClick={connectWallet} disabled={wallet.isConnected}>
            Connect Wallet
          </button>
          <button onClick={disconnectWallet} disabled={!wallet.isConnected}>
            Disconnect Wallet
          </button>
          <button onClick={getAccounts}>
            Get Accounts
          </button>
          <button onClick={getPermissions}>
            Get Permissions
          </button>
          <button onClick={requestPermissions}>
            Request Permissions
          </button>
        </div>
      </div>

      {/* Results and Errors for this section */}
      {Object.keys(results).filter(key => ['connect', 'disconnect', 'getAccounts', 'getPermissions', 'requestPermissions'].includes(key)).length > 0 && (
        <div className="card">
          <h3>Results</h3>
          {Object.entries(results)
            .filter(([key]) => ['connect', 'disconnect', 'getAccounts', 'getPermissions', 'requestPermissions'].includes(key))
            .map(([key, result]) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>{key}</h4>
                <div className="result">{JSON.stringify(result, null, 2)}</div>
                <button onClick={() => onClearResult(key)} style={{ marginTop: '0.5rem' }}>Clear Result</button>
              </div>
            ))}
        </div>
      )}

      {Object.keys(errors).filter(key => ['connect', 'disconnect', 'getAccounts', 'getPermissions', 'requestPermissions'].includes(key)).length > 0 && (
        <div className="card">
          <h3>Errors</h3>
          {Object.entries(errors)
            .filter(([key]) => ['connect', 'disconnect', 'getAccounts', 'getPermissions', 'requestPermissions'].includes(key))
            .map(([key, error]) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#f44336', marginBottom: '0.5rem' }}>{key}</h4>
                <div className="result error">{error}</div>
                <button onClick={() => onClearError(key)} style={{ marginTop: '0.5rem' }}>Clear Error</button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default WalletConnection
