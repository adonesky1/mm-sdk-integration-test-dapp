import React, { useState, useEffect } from 'react'
import WalletConnection from './components/WalletConnection'
import AccountInfo from './components/AccountInfo'
import TransactionMethods from './components/TransactionMethods'
import TokenMethods from './components/TokenMethods'
import EventListeners from './components/EventListeners'
import NetworkDropdown from './components/NetworkDropdown'
import './App.css'

// Types for wallet state
interface WalletState {
  isConnected: boolean
  accounts: string[]
  chainId: string
  networkId: string
  balance: string
  provider: any
}

interface AppState {
  wallet: WalletState
  results: Record<string, any>
  errors: Record<string, string>
}

function App() {
  const [state, setState] = useState<AppState>({
    wallet: {
      isConnected: false,
      accounts: [],
      chainId: '',
      networkId: '',
      balance: '0',
      provider: null
    },
    results: {},
    errors: {}
  })

  // Initialize wallet connection on component mount
  useEffect(() => {
    initializeWallet()
  }, [])

  const initializeWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const provider = window.ethereum

        // Check if already connected
        const accounts = await provider.request({ method: 'eth_accounts' })
        const chainId = await provider.request({ method: 'eth_chainId' })
        const networkId = await provider.request({ method: 'net_version' })

        if (accounts.length > 0) {
          const balance = await provider.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          })

          setState(prev => ({
            ...prev,
            wallet: {
              isConnected: true,
              accounts,
              chainId,
              networkId,
              balance,
              provider
            }
          }))
        } else {
          setState(prev => ({
            ...prev,
            wallet: {
              ...prev.wallet,
              provider
            }
          }))
        }
      } else {
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            initialization: 'MetaMask is not installed. Please install MetaMask to use this dapp.'
          }
        }))
      }
    } catch (error) {
      console.error('Error initializing wallet:', error)
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          initialization: `Error initializing wallet: ${error.message}`
        }
      }))
    }
  }

  const updateWalletState = (updates: Partial<WalletState>) => {
    setState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        ...updates
      }
    }))
  }

  const setResult = (key: string, result: any) => {
    setState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [key]: result
      }
    }))
  }

  const setError = (key: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [key]: error
      }
    }))
  }

  const clearResult = (key: string) => {
    setState(prev => {
      const newResults = { ...prev.results }
      delete newResults[key]
      return {
        ...prev,
        results: newResults
      }
    })
  }

  const clearError = (key: string) => {
    setState(prev => {
      const newErrors = { ...prev.errors }
      delete newErrors[key]
      return {
        ...prev,
        errors: newErrors
      }
    })
  }

  return (
    <div className="App">
      <header>
        <h1>MetaMask SDK Exercise DApp</h1>
        <p>Base dapp for testing various wallet integration approaches</p>
        {state.wallet.isConnected && (
          <NetworkDropdown
            wallet={state.wallet}
            onWalletUpdate={updateWalletState}
            onResult={setResult}
            onError={setError}
            results={state.results}
            errors={state.errors}
          />
        )}
      </header>

      <main>
        <div className="status-section">
          {state.wallet.isConnected ? (
            <div className="status connected">
              ✅ Connected to MetaMask
            </div>
          ) : (
            <div className="status disconnected">
              ❌ Not connected to MetaMask
            </div>
          )}

          {state.errors.initialization && (
            <div className="status error">
              ⚠️ {state.errors.initialization}
            </div>
          )}
        </div>

        <WalletConnection
          wallet={state.wallet}
          onWalletUpdate={updateWalletState}
          onResult={setResult}
          onError={setError}
          onClearResult={clearResult}
          onClearError={clearError}
          results={state.results}
          errors={state.errors}
        />

        {state.wallet.isConnected && (
          <>
            <AccountInfo
              wallet={state.wallet}
              onResult={setResult}
              onError={setError}
              onClearResult={clearResult}
              onClearError={clearError}
            />

            <TransactionMethods
              wallet={state.wallet}
              onWalletUpdate={updateWalletState}
              onResult={setResult}
              onError={setError}
              onClearResult={clearResult}
              onClearError={clearError}
            />

            <TokenMethods
              wallet={state.wallet}
              onResult={setResult}
              onError={setError}
              onClearResult={clearResult}
              onClearError={clearError}
            />

            <EventListeners
              wallet={state.wallet}
              onWalletUpdate={updateWalletState}
              onResult={setResult}
              onError={setError}
              onClearResult={clearResult}
              onClearError={clearError}
            />
          </>
        )}

      </main>
    </div>
  )
}

export default App
