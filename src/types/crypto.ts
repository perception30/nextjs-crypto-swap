export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export interface SwapState {
  fromCrypto: CryptoCurrency | null;
  toCrypto: CryptoCurrency | null;
  fromAmount: number;
  toAmount: number;
  slippage: number;
}

export interface SwapFormProps {
  cryptocurrencies: CryptoCurrency[];
  onSwap: (state: SwapState) => void;
}
