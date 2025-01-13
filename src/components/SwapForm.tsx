import { useState, useEffect, useMemo } from 'react';
import { CryptoCurrency, SwapState } from '../types/crypto';
import { CryptoSelect } from './CryptoSelect';
import { CryptoService } from '../services/crypto';

interface SwapFormProps {
  cryptocurrencies: CryptoCurrency[];
  onSwap: (state: SwapState) => void;
}

export const SwapForm = ({ cryptocurrencies, onSwap }: SwapFormProps) => {
  const [fromCrypto, setFromCrypto] = useState<CryptoCurrency | null>(null);
  const [toCrypto, setToCrypto] = useState<CryptoCurrency | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isCalculating, setIsCalculating] = useState(false);

  const priceImpact = useMemo(() => {
    if (fromCrypto && toCrypto && fromAmount && toAmount) {
      const impact = ((parseFloat(fromAmount) * fromCrypto.current_price) - 
                     (parseFloat(toAmount) * toCrypto.current_price)) / 
                    (parseFloat(fromAmount) * fromCrypto.current_price) * 100;
      return Math.abs(impact);
    }
    return 0;
  }, [fromCrypto, toCrypto, fromAmount, toAmount]);

  useEffect(() => {
    if (fromCrypto && toCrypto && fromAmount) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        try {
          const amount = parseFloat(fromAmount);
          if (!isNaN(amount) && amount > 0) {
            const calculatedAmount = CryptoService.calculateSwapAmount(
              amount,
              fromCrypto.current_price,
              toCrypto.current_price,
              slippage
            );
            setToAmount(calculatedAmount.toFixed(6));
          } else {
            setToAmount('0');
          }
        } catch (error) {
          console.error('Calculation error:', error);
          setToAmount('0');
        } finally {
          setIsCalculating(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setToAmount('0');
    }
  }, [fromCrypto, toCrypto, fromAmount, slippage]);

  const handleSwap = () => {
    if (fromCrypto && toCrypto && fromAmount && toAmount && !isCalculating) {
      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);
      
      if (!isNaN(fromAmountNum) && !isNaN(toAmountNum) && fromAmountNum > 0 && toAmountNum > 0) {
        onSwap({
          fromCrypto,
          toCrypto,
          fromAmount: fromAmountNum,
          toAmount: toAmountNum,
          slippage,
        });
      }
    }
  };

  const handleSwitchCurrencies = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="glass-card p-6 rounded-2xl max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Swap Cryptocurrencies
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="relative">
            <CryptoSelect
              cryptocurrencies={cryptocurrencies}
              selectedCrypto={fromCrypto}
              onSelect={setFromCrypto}
              label="From"
            />
            <div className="mt-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="w-full p-3 rounded-lg crypto-input focus:outline-none"
              />
              {fromCrypto && (
                <div className="absolute right-3 bottom-3 text-sm text-gray-500">
                  ≈ ${(parseFloat(fromAmount || '0') * fromCrypto.current_price).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex justify-center">
            <button
              onClick={handleSwitchCurrencies}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center swap-arrow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <CryptoSelect
              cryptocurrencies={cryptocurrencies}
              selectedCrypto={toCrypto}
              onSelect={setToCrypto}
              label="To"
            />
            <div className="mt-2 relative">
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="w-full p-3 rounded-lg crypto-input bg-opacity-50"
              />
              {isCalculating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                </div>
              )}
              {toCrypto && !isCalculating && (
                <div className="absolute right-3 bottom-3 text-sm text-gray-500">
                  ≈ ${(parseFloat(toAmount || '0') * toCrypto.current_price).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Slippage Tolerance
              </label>
              <div className="flex gap-2">
                {[0.5, 1.0, 1.5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                      slippage === value
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            {fromCrypto && toCrypto && fromAmount && toAmount && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price Impact</span>
                  <span className={`font-medium ${priceImpact > 2 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {fromCrypto.symbol.toUpperCase()} → {toCrypto.symbol.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSwap}
            disabled={!fromCrypto || !toCrypto || !fromAmount || !toAmount || isCalculating}
            className="w-full py-4 rounded-lg font-semibold text-white swap-button-gradient disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCalculating ? 'Calculating...' : 'Swap'}
          </button>
        </div>
      </div>
    </div>
  );
};
