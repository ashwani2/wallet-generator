import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const ExplorerSearch = ({ isOpen, onClose, type, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const baseUrl = type === 'sol' 
      ? 'https://solscan.io/account/'
      : 'https://etherscan.io/address/';
      
    window.open(baseUrl + searchQuery.trim(), '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative w-full max-w-2xl mx-4 p-6 rounded-xl ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">
          {type === 'sol' ? 'Solana' : 'Ethereum'} Explorer Search
        </h2>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Enter ${type === 'sol' ? 'Solana' : 'Ethereum'} address`}
              className={`w-full px-4 py-3 pr-10 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } border-2 focus:outline-none`}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExplorerSearch;