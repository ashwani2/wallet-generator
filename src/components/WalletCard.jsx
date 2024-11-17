// components/WalletCard.jsx
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const WalletCard = ({ index, publicKey, privateKey, showPrivate, onTogglePrivate, darkMode }) => {
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };
  
    return (
      <div className={`rounded-xl p-6 mb-4 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Wallet #{index + 1}</h3>
          <button 
            onClick={onTogglePrivate}
            className={`hover:text-gray-600 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {showPrivate ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>
              Public Key:
            </label>
            <div 
              className={`p-3 rounded-lg text-sm font-mono break-all cursor-pointer ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => copyToClipboard(publicKey)}
            >
              {publicKey}
            </div>
          </div>
          <div className="space-y-2">
            <label className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>
              Private Key:
            </label>
            <div 
              className={`p-3 rounded-lg text-sm font-mono break-all cursor-pointer ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => copyToClipboard(privateKey)}
            >
              {showPrivate ? privateKey : '••••••••••••••••••••••••••'}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default WalletCard;