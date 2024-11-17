// components/SolanaWallet.jsx
import React, { useState } from 'react';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import WalletCard from './WalletCard';

export const SolanaWallet = ({ mnemonic,darkMode }) => {
  const [wallets, setWallets] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState({});

  const addWallet = async () => {
    try {
      if (!mnemonic) {
        alert("Please generate a seed phrase first.");
        return;
      }
      
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${wallets.length}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSecretKey(
        nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
      );
      
      setWallets([...wallets, {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex')
      }]);
    } catch (error) {
      console.error("Error generating wallet:", error);
      alert("Error generating wallet. Please try again.");
    }
  };

  const clearWallets = () => {
    setWallets([]);
    setVisibleKeys({});
  };

  const togglePrivateKey = (index) => {
    setVisibleKeys(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className={`rounded-xl p-8 ${
      darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🔑</span> Solana Wallet
        </h2>
        <div className="flex gap-4">
          <button 
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-white text-black hover:bg-gray-100' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            onClick={addWallet}
          >
            Add Wallet
          </button>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={clearWallets}
          >
            Clear Wallets
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {wallets.map((wallet, index) => (
          <WalletCard
            key={index}
            index={index}
            publicKey={wallet.publicKey}
            privateKey={wallet.privateKey}
            showPrivate={visibleKeys[index]}
            onTogglePrivate={() => togglePrivateKey(index)}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};
