import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const RequestAirdrop = ({ darkMode }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("0");
  const [sendAmount, setSendAmount] = useState("0");
  const [sendAddress, setSendAddress] = useState("");
  const [solBalance, setSolBalance] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the wallet balance once the wallet is connected
  const getBalance = async () => {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    }
  };

  const requestAirdrop = async () => {
    if (!amount || !wallet.publicKey) return;

    try {
      setLoading(true);
      await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
      alert(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
      setAmount("0");
    } catch (error) {
      alert(`Error requesting airdrop: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendTokens = async () => {
    if (!wallet.publicKey || !sendAddress || !sendAmount) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(sendAddress),
        lamports: sendAmount * LAMPORTS_PER_SOL,
      })
    );

    try {
      await wallet.sendTransaction(transaction, connection);
      alert(`Sent ${sendAmount} SOL to ${sendAddress}`);
    } catch (error) {
      alert(`Error sending tokens: ${error.message}`);
    }
  };

  // Fetch token accounts related to the wallet
  useEffect(() => {
    const fetchData = async () => {
      if (!wallet.publicKey) {
        alert("Wallet not connected");
        return;
      }
      const response = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
      const publicKeys = response.value.map((accountInfo) =>
        accountInfo.pubkey.toBase58()
      );
      setData(publicKeys);
    };

    if (wallet.connected) {
      fetchData();
      getBalance();
    }
  }, [connection, wallet.publicKey, wallet.connected]);

  // Determine classes for light or dark mode
  const containerClasses = darkMode ? "bg-black text-white" : "bg-white text-black";
  const cardClasses = darkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-gray-100 border border-gray-300";
  const inputClasses = darkMode
    ? "bg-gray-900 text-white placeholder-gray-500 border-gray-800"
    : "bg-white text-black placeholder-gray-700 border-gray-300";
    const buttonClasses = darkMode
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <div className={`p-6 ${containerClasses}`}>
      {/* Wallet Connection Buttons */}
      <div className="flex gap-4 mb-8">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
        <WalletDisconnectButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
      </div>

      {/* Balance Display */}
      <div className="mb-8">
        <h2 className="text-2xl text-green-500 mb-4">
          Sol Balance: {wallet.connected ? solBalance || 0 : 0}
        </h2>
      </div>

      {/* Token Accounts (if any) */}
      {data.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl text-blue-500 mb-4">Token Accounts</h3>
          <ul>
            {data.map((pubkey, index) => (
              <li key={index} className="text-sm text-gray-400">{pubkey}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send SOL Section */}
        <div className={`p-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl text-green-500 mb-6">Send Sol</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter address to send"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              className={`w-full p-3 rounded-md ${inputClasses}`}
            />
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              min="0"
              step="0.1"
              className={`w-full p-3 rounded-md ${inputClasses}`}
            />
            <button
              className={`w-full p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
              disabled={!wallet.connected}
              onClick={sendTokens}
            >
              Send
            </button>
          </div>
        </div>

        {/* Request Airdrop Section */}
        <div className={`p-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl text-green-500 mb-6">Request Airdrop</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.1"
              className={`w-full p-3 rounded-md ${inputClasses}`}
            />
            <button
              onClick={requestAirdrop}
              disabled={!wallet.connected || loading}
              className={`w-full p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
            >
              Request Airdrop
            </button>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {!wallet.connected && (
        <div className="mt-6 p-4 bg-red-900/50 text-white rounded-lg">
          Wallet not connected
        </div>
      )}
    </div>
  );
};

export default RequestAirdrop;
