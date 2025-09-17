import React, { useState, useEffect } from 'react'
import { WalletState } from '../types'

interface EventListenersProps {
  wallet: WalletState
  onWalletUpdate: (updates: Partial<WalletState>) => void
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  onClearResult: (key: string) => void
  onClearError: (key: string) => void
}

interface EventLog {
  type: string
  timestamp: Date
  data: any
}

const EventListeners: React.FC<EventListenersProps> = ({
  wallet,
  onWalletUpdate,
  onResult,
  onError,
  onClearResult,
  onClearError
}) => {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])
  const [listenersActive, setListenersActive] = useState(false)

  const addEventLog = (type: string, data: any) => {
    const newLog: EventLog = {
      type,
      timestamp: new Date(),
      data
    }
    setEventLogs(prev => [newLog, ...prev].slice(0, 50)) // Keep last 50 events
  }

  const setupEventListeners = () => {
    if (!wallet.provider || listenersActive) return

    try {
      // Account changed event
      wallet.provider.on('accountsChanged', (accounts: string[]) => {
        console.log('Accounts changed:', accounts)
        addEventLog('accountsChanged', { accounts })

        if (accounts.length === 0) {
          onWalletUpdate({
            isConnected: false,
            accounts: [],
            balance: '0'
          })
        } else {
          // Update wallet state with new accounts
          onWalletUpdate({ accounts })

          // Get balance for the first account
          wallet.provider.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          }).then((balance: string) => {
            onWalletUpdate({ balance })
          }).catch((error: any) => {
            console.error('Error getting balance after account change:', error)
          })
        }
      })

      // Chain changed event
      wallet.provider.on('chainChanged', (chainId: string) => {
        console.log('Chain changed:', chainId)
        addEventLog('chainChanged', { chainId })

        // Update wallet state
        wallet.provider.request({ method: 'net_version' }).then((networkId: string) => {
          onWalletUpdate({
            chainId,
            networkId
          })
        }).catch((error: any) => {
          console.error('Error getting network ID after chain change:', error)
        })
      })

      // Connect event
      wallet.provider.on('connect', (connectInfo: any) => {
        console.log('Connected:', connectInfo)
        addEventLog('connect', connectInfo)
      })

      // Disconnect event
      wallet.provider.on('disconnect', async (error: any) => {
        console.log('Disconnected:', error)
        addEventLog('disconnect', error)

        // Attempt to reconnect after a short delay
        setTimeout(async () => {
          try {
            console.log('Attempting to reconnect after disconnect...')
            
            // Check if we still have permissions by requesting accounts
            const accounts = await wallet.provider.request({ method: 'eth_accounts' })
            const chainId = await wallet.provider.request({ method: 'eth_chainId' })
            const networkId = await wallet.provider.request({ method: 'net_version' })

            if (accounts.length > 0) {
              // We still have permissions, get balance and reconnect
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

              addEventLog('reconnect', {
                message: 'Successfully reconnected after disconnect',
                accounts,
                chainId,
                networkId
              })
              
              console.log('Successfully reconnected after disconnect')
            } else {
              // No accounts, truly disconnected
              onWalletUpdate({
                isConnected: false,
                accounts: [],
                chainId: '',
                networkId: '',
                balance: '0'
              })
              
              addEventLog('reconnect', {
                message: 'No accounts found, wallet is disconnected',
                accounts: []
              })
              
              console.log('No accounts found, wallet is disconnected')
            }
          } catch (reconnectError) {
            console.error('Error during reconnection attempt:', reconnectError)
            
            // If reconnection fails, mark as disconnected
            onWalletUpdate({
              isConnected: false,
              accounts: [],
              chainId: '',
              networkId: '',
              balance: '0'
            })
            
            addEventLog('reconnect', {
              message: 'Reconnection failed',
              error: reconnectError.message
            })
          }
        }, 1000) // Wait 1 second before attempting reconnection
      })

      setListenersActive(true)
      onResult('eventListeners', { message: 'Event listeners set up successfully' })
    } catch (error) {
      console.error('Error setting up event listeners:', error)
      onError('eventListeners', `Failed to set up event listeners: ${error.message}`)
    }
  }

  const removeEventListeners = () => {
    if (!wallet.provider || !listenersActive) return

    try {
      wallet.provider.removeAllListeners('accountsChanged')
      wallet.provider.removeAllListeners('chainChanged')
      wallet.provider.removeAllListeners('connect')
      wallet.provider.removeAllListeners('disconnect')

      setListenersActive(false)
      onResult('eventListeners', { message: 'Event listeners removed successfully' })
    } catch (error) {
      console.error('Error removing event listeners:', error)
      onError('eventListeners', `Failed to remove event listeners: ${error.message}`)
    }
  }

  const clearEventLogs = () => {
    setEventLogs([])
    onResult('eventListeners', { message: 'Event logs cleared' })
  }


  // Set up listeners when component mounts and wallet is available
  useEffect(() => {
    if (wallet.provider && !listenersActive) {
      setupEventListeners()
    }

    // Cleanup on unmount
    return () => {
      if (listenersActive) {
        removeEventListeners()
      }
    }
  }, [wallet.provider, listenersActive])

  return (
    <div className="section">
      <h2>Event Listeners</h2>


      <div className="card">
        <h3>Event Logs</h3>
        {eventLogs.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No events logged yet. Set up listeners and interact with MetaMask to see events.</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {eventLogs.map((log, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #444',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  margin: '0.5rem 0',
                  backgroundColor: '#2a2a2a'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#646cff' }}>{log.type}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <pre style={{
                    fontSize: '0.8rem',
                    color: '#ccc',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventListeners
