import { CryptoCurrency } from '../types/crypto';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface CryptoSelectProps {
  cryptocurrencies: CryptoCurrency[];
  selectedCrypto: CryptoCurrency | null;
  onSelect: (crypto: CryptoCurrency) => void;
  label: string;
}

export const CryptoSelect = ({
  cryptocurrencies,
  selectedCrypto,
  onSelect,
  label,
}: CryptoSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCryptos = cryptocurrencies.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10); // Limit to top 10 matches for better performance

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCryptos.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredCryptos.length > 0) {
            handleCryptoSelect(filteredCryptos[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredCryptos, selectedIndex]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
  };

  const handleCryptoSelect = (crypto: CryptoCurrency) => {
    onSelect(crypto);
    handleClose();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center p-3 crypto-input rounded-lg hover:border-indigo-500 transition-colors">
          {selectedCrypto ? (
            <>
              <div className="w-8 h-8 relative mr-2">
                  <Image
                    src={selectedCrypto.image}
                    alt={selectedCrypto.name}
                    fill
                    sizes="(max-width: 32px) 100vw, 32px"
                    className="rounded-full"
                  />
              </div>
              <div>
                <div className="font-medium">{selectedCrypto.symbol.toUpperCase()}</div>
                <div className="text-sm text-gray-500">{selectedCrypto.name}</div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                ${selectedCrypto.current_price.toFixed(2)}
              </div>
            </>
          ) : (
            <span className="text-gray-500">Select a cryptocurrency</span>
          )}
          <div className="ml-2">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div 
            className={`absolute left-0 right-0 glass-card rounded-lg shadow-lg z-50 ${
              label === 'To' 
                ? 'bottom-full mb-1 animate-slide-up' 
                : 'top-full mt-1 animate-slide-down'
            }`}
          >
            <div className="p-2 bg-inherit rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 crypto-input rounded-lg text-sm focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredCryptos.length > 0) {
                      handleCryptoSelect(filteredCryptos[0]);
                    }
                  }}
                />
            </div>
            <div ref={listRef} className="max-h-[240px] overflow-auto">
              {filteredCryptos.map((crypto, index) => (
                <div
                  key={crypto.id}
                  className={`flex items-center p-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-indigo-50 dark:bg-indigo-900'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCryptoSelect(crypto);
                  }}
                >
                  <div className="w-8 h-8 relative mr-3 flex-shrink-0">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      fill
                      sizes="(max-width: 32px) 100vw, 32px"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="font-medium truncate">{crypto.symbol.toUpperCase()}</div>
                    <div className="text-sm text-gray-500 truncate">{crypto.name}</div>
                  </div>
                  <div className="text-sm text-gray-500 flex-shrink-0">
                    ${crypto.current_price.toFixed(2)}
                  </div>
                </div>
              ))}
              {filteredCryptos.length === 0 && (
                <div className="p-3 text-center text-gray-500">
                  No cryptocurrencies found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
