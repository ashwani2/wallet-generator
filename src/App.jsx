import React, { useState } from 'react';
import { generateMnemonic } from 'bip39';
import { Copy, Check, Search } from 'lucide-react';
import { SolanaWallet } from './components/SolanaWallet';
import { EthWallet } from './components/EthWallet';
import ExplorerSearch from './components/ExplorerSearch';

const App = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [activeExplorer, setActiveExplorer] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleGenerateMnemonic = async () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  };

  const handleCopy = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const openExplorer = (type) => {
    setActiveExplorer(type);
    setExplorerOpen(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-lg bg-opacity-80 ${darkMode ? 'bg-gray-900' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>🪙</span> Wallet Generator
          </h1>
          <div className="flex items-center gap-4">
            <button 
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => openExplorer('sol')}
            >
              <span className="flex items-center gap-2">
                <Search size={16} />
                SOL Explorer
              </span>
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => openExplorer('eth')}
            >
              <span className="flex items-center gap-2">
                <Search size={16} />
                ETH Explorer
              </span>
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <ExplorerSearch 
        isOpen={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        type={activeExplorer}
        darkMode={darkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className={`rounded-xl p-8 mb-8 ${
          darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'
        }`}>
          <h2 className="text-xl font-semibold mb-6">Your Secret Phrase</h2>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={handleGenerateMnemonic}
          >
            Generate Seed Phrase
          </button>
          {mnemonic && (
            <div className="mt-6">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={handleCopy}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="relative">
                <p 
                  className={`text-center mt-4 flex items-center justify-center gap-2 cursor-pointer ${
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
                      Click Anywhere to Copy
                    </>
                  )}
                </p>
                {copied && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-2">
                    <div className={`px-3 py-1 rounded text-sm ${
                      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-lg'
                    }`}>
                      Copied to clipboard!
                    </div>
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
      </main>
    </div>
  );
};

export default App;