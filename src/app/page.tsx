'use client';

import { useEffect, useState } from 'react';
import { CryptoCurrency, SwapState } from '../types/crypto';
import { CryptoService } from '../services/crypto';
import { SwapForm } from '../components/SwapForm';

export default function Home() {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await CryptoService.getTopCryptos(10);
        setCryptocurrencies(data);
      } catch (err) {
        setError('Failed to fetch cryptocurrencies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleSwap = (swapState: SwapState) => {
    // In a real application, this would interact with a blockchain wallet
    // and execute the actual swap transaction
    console.log('Executing swap with state:', swapState);
    
    // Show success message with animation
    const successElement = document.createElement('div');
    successElement.className = 'fixed inset-0 flex items-center justify-center z-50';
    successElement.innerHTML = `
      <div class="glass-card p-6 rounded-xl animate-slide-down">
        <div class="flex items-center space-x-3 text-green-500 mb-4">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-lg font-semibold">Swap Successful!</span>
        </div>
        <div class="space-y-2 text-gray-600 dark:text-gray-300">
          <div class="flex justify-between">
            <span>From:</span>
            <span>${swapState.fromAmount} ${swapState.fromCrypto?.symbol.toUpperCase()}</span>
          </div>
          <div class="flex justify-between">
            <span>To:</span>
            <span>${swapState.toAmount} ${swapState.toCrypto?.symbol.toUpperCase()}</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(successElement);
    
    setTimeout(() => {
      successElement.remove();
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin mb-4"></div>
          <div className="text-lg font-medium text-white">Loading cryptocurrencies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md animate-slide-down">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Error</h2>
          <p className="text-gray-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Crypto Swap
          </h1>
          <p className="text-indigo-100 mb-8 text-center max-w-md">
            Instantly swap between your favorite cryptocurrencies with real-time pricing and minimal slippage
          </p>
          <SwapForm
            cryptocurrencies={cryptocurrencies}
            onSwap={handleSwap}
          />
          <p className="mt-8 text-sm text-indigo-200 text-center max-w-md">
            Powered by real-time market data • Secure transactions • Best rates
          </p>
        </div>
      </div>
    </main>
  );
}
