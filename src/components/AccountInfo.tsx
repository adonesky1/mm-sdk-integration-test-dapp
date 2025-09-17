import React from 'react'
import { WalletState } from '../types'

interface AccountInfoProps {
  wallet: WalletState
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  onClearResult: (key: string) => void
  onClearError: (key: string) => void
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  wallet,
  onResult,
  onError,
  onClearResult,
  onClearError
}) => {

  return (
    <div className="section">
      <h2>Account Information</h2>

      <div className="card">
        <h3>Current Account Info</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Connected Accounts</h4>
            <p>{wallet.accounts.length > 0 ? wallet.accounts.join(', ') : 'None'}</p>
          </div>
          <div className="info-item">
            <h4>Chain ID</h4>
            <p>{wallet.chainId || 'Unknown'}</p>
          </div>
          <div className="info-item">
            <h4>Network ID</h4>
            <p>{wallet.networkId || 'Unknown'}</p>
          </div>
          <div className="info-item">
            <h4>Balance (Wei)</h4>
            <p>{wallet.balance || '0'}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AccountInfo
