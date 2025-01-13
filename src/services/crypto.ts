import { CryptoCurrency } from '../types/crypto';

export const CryptoService = {
  async getTopCryptos(limit: number = 10): Promise<CryptoCurrency[]> {
    try {
      const response = await fetch('/api/crypto');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  },

  calculateSwapAmount(
    fromAmount: number,
    fromPrice: number,
    toPrice: number,
    slippage: number = 0.5
  ): number {
    const baseAmount = (fromAmount * fromPrice) / toPrice;
    const slippageAmount = (baseAmount * slippage) / 100;
    return baseAmount - slippageAmount;
  }
};
