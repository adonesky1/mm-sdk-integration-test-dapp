import React from 'react'
import { WalletState } from '../types'

interface TransactionMethodsProps {
  wallet: WalletState
  onWalletUpdate: (updates: Partial<WalletState>) => void
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  onClearResult: (key: string) => void
  onClearError: (key: string) => void
}

const TransactionMethods: React.FC<TransactionMethodsProps> = ({
  wallet,
  onWalletUpdate,
  onResult,
  onError,
  onClearResult,
  onClearError
}) => {
  const sendTransaction = async (transaction: any) => {
    try {
      onClearError('sendTransaction')
      onClearResult('sendTransaction')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const txHash = await wallet.provider.request({
        method: 'eth_sendTransaction',
        params: [transaction]
      })

      onResult('sendTransaction', {
        transaction,
        txHash,
        message: 'Transaction sent successfully'
      })
    } catch (error) {
      console.error('Error sending transaction:', error)
      onError('sendTransaction', `Failed to send transaction: ${error.message}`)
    }
  }


  return (
    <div className="section">
      <h2>Transaction Methods</h2>

      <div className="card">
        <h3>Send Transaction</h3>
        <div className="input-group">
          <label>To Address:</label>
          <input
            type="text"
            placeholder="0x..."
            id="sendTxTo"
            defaultValue="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
          />
        </div>
        <div className="input-group">
          <label>Value (in wei):</label>
          <input
            type="text"
            placeholder="1000000000000000000"
            id="sendTxValue"
            defaultValue="1000000000000000000"
          />
        </div>
        <div className="input-group">
          <label>Gas Limit (optional):</label>
          <input
            type="text"
            placeholder="21000"
            id="sendTxGas"
          />
        </div>
        <div className="input-group">
          <label>Gas Price (optional, in wei):</label>
          <input
            type="text"
            placeholder="20000000000"
            id="sendTxGasPrice"
          />
        </div>
        <div className="input-group">
          <label>Data (optional, hex):</label>
          <input
            type="text"
            placeholder="0x"
            id="sendTxData"
          />
        </div>
        <button onClick={() => {
          const toInput = document.getElementById('sendTxTo') as HTMLInputElement
          const valueInput = document.getElementById('sendTxValue') as HTMLInputElement
          const gasInput = document.getElementById('sendTxGas') as HTMLInputElement
          const gasPriceInput = document.getElementById('sendTxGasPrice') as HTMLInputElement
          const dataInput = document.getElementById('sendTxData') as HTMLInputElement

          const transaction: any = {
            to: toInput.value,
            value: valueInput.value,
            from: wallet.accounts[0]
          }

          if (gasInput.value) transaction.gas = gasInput.value
          if (gasPriceInput.value) transaction.gasPrice = gasPriceInput.value
          if (dataInput.value) transaction.data = dataInput.value

          sendTransaction(transaction)
        }}>
          Send Transaction
        </button>
      </div>

    </div>
  )
}

export default TransactionMethods
