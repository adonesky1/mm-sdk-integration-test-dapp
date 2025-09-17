import React from 'react'
import { WalletState } from '../types'

interface TokenMethodsProps {
  wallet: WalletState
  onResult: (key: string, result: any) => void
  onError: (key: string, error: string) => void
  onClearResult: (key: string) => void
  onClearError: (key: string) => void
}

const TokenMethods: React.FC<TokenMethodsProps> = ({
  wallet,
  onResult,
  onError,
  onClearResult,
  onClearError
}) => {
  const watchAsset = async (tokenParams: any) => {
    try {
      onClearError('watchAsset')
      onClearResult('watchAsset')

      if (!wallet.provider) {
        throw new Error('MetaMask provider not available')
      }

      const result = await wallet.provider.request({
        method: 'wallet_watchAsset',
        params: tokenParams
      })

      onResult('watchAsset', {
        tokenParams,
        result,
        message: result ? 'Token added successfully' : 'Token addition was rejected'
      })
    } catch (error) {
      console.error('Error watching asset:', error)
      onError('watchAsset', `Failed to watch asset: ${error.message}`)
    }
  }

  const watchERC20Token = async () => {
    const tokenParams = {
      type: 'ERC20',
      options: {
        address: '0xA0b86a33E6441c8C06DDD1234362901F7556A537', // Example USDC
        symbol: 'USDC',
        decimals: 6,
        image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
      }
    }

    await watchAsset(tokenParams)
  }

  const watchERC721Token = async () => {
    const tokenParams = {
      type: 'ERC721',
      options: {
        address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // Example BAYC
        symbol: 'BAYC',
        image: 'https://i.seadn.io/gae/Ju9CkWtV-1Ok7f0WdNJ9P8s8VzPNiZmaKp8WUhjTPE9CUJGCqrq0Bp98p5jZs5x0k7G3jnbswb0x1_2wL0XFuj6HyL7i5yJCY8zW?w=500&auto=format'
      }
    }

    await watchAsset(tokenParams)
  }

  const watchERC1155Token = async () => {
    const tokenParams = {
      type: 'ERC1155',
      options: {
        address: '0x495f947276749Ce646f68AC8c248420045cb7b5e', // Example OpenSea
        tokenId: '1'
      }
    }

    await watchAsset(tokenParams)
  }

  const watchCustomToken = async () => {
    const addressInput = document.getElementById('customTokenAddress') as HTMLInputElement
    const symbolInput = document.getElementById('customTokenSymbol') as HTMLInputElement
    const decimalsInput = document.getElementById('customTokenDecimals') as HTMLInputElement
    const typeSelect = document.getElementById('customTokenType') as HTMLSelectElement

    if (!addressInput.value || !symbolInput.value) {
      onError('watchAsset', 'Address and symbol are required')
      return
    }

    const tokenParams: any = {
      type: typeSelect.value,
      options: {
        address: addressInput.value,
        symbol: symbolInput.value
      }
    }

    if (decimalsInput.value) {
      tokenParams.options.decimals = parseInt(decimalsInput.value)
    }

    await watchAsset(tokenParams)
  }


  return (
    <div className="section">
      <h2>Token Methods</h2>

      <div className="card">
        <h3>Watch Assets (Add Tokens to Wallet)</h3>
        <div className="button-group">
          <button onClick={watchERC20Token}>
            Add USDC (ERC20)
          </button>
          <button onClick={watchERC721Token}>
            Add BAYC (ERC721)
          </button>
          <button onClick={watchERC1155Token}>
            Add OpenSea (ERC1155)
          </button>
        </div>

        <div className="input-group">
          <label>Token Type:</label>
          <select id="customTokenType" defaultValue="ERC20">
            <option value="ERC20">ERC20</option>
            <option value="ERC721">ERC721</option>
            <option value="ERC1155">ERC1155</option>
          </select>
        </div>
        <div className="input-group">
          <label>Token Address:</label>
          <input
            type="text"
            placeholder="0x..."
            id="customTokenAddress"
          />
        </div>
        <div className="input-group">
          <label>Token Symbol:</label>
          <input
            type="text"
            placeholder="USDC"
            id="customTokenSymbol"
          />
        </div>
        <div className="input-group">
          <label>Decimals (for ERC20):</label>
          <input
            type="number"
            placeholder="18"
            id="customTokenDecimals"
            defaultValue="18"
          />
        </div>
        <button onClick={watchCustomToken}>
          Add Custom Token
        </button>
      </div>

    </div>
  )
}

export default TokenMethods
