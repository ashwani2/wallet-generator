import React, { useState } from 'react';
import { generateMnemonic } from 'bip39';
import { Copy, Check } from 'lucide-react';
import { SolanaWallet } from './SolanaWallet';
import { EthWallet } from './EthWallet';

const WebWallet = ({ darkMode }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateMnemonic = async () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  };

  const handleCopy = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <section
        className={`rounded-xl p-8 mb-8 ${
          darkMode
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
            : 'bg-white shadow-lg text-gray-900'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Your Secret Phrase</h2>
        <button
          className="px-6 py-3 rounded-full text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all"
          onClick={handleGenerateMnemonic}
        >
          Generate Seed Phrase
        </button>
        {mnemonic && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Copy Your Phrase Below:
            </h3>
            <div
              className={`grid grid-cols-3 md:grid-cols-4 gap-4 p-4 rounded-lg ${
                darkMode
                  ? 'bg-gray-900 shadow-inner'
                  : 'bg-gray-50 shadow-inner'
              }`}
            >
              {mnemonic.split(' ').map((word, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center text-lg font-medium cursor-pointer transition-colors ${
                    darkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-900'
                  }`}
                  onClick={handleCopy}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="relative mt-4 text-center">
              <p
                className={`flex items-center justify-center gap-2 cursor-pointer text-sm font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Click Any Word to Copy
                  </>
                )}
              </p>
              {copied && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 rounded text-sm ${
                    darkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900 shadow-lg'
                  }`}
                >
                  Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <SolanaWallet mnemonic={mnemonic} darkMode={darkMode} />
        <EthWallet mnemonic={mnemonic} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default WebWallet;
