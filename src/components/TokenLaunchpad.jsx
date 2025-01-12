import React, { useState } from "react";
import {
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createInitializeMintInstruction,
} from "@solana/spl-token";

const TokenLaunchpad = ({ darkMode }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [loading, setLoading] = useState(false);

  const createToken = async () => {
    if (!wallet.publicKey || !tokenName || !tokenSymbol) {
      alert("Please fill in all fields and connect your wallet.");
      return;
    }

    const mintKeypair = Keypair.generate();

    try {
      setLoading(true);

      const lamports = await connection.getMinimumBalanceForRentExemption(82); // Minimum size for a token mint account

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9, // Decimals
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);

      const associatedTokenAddress = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAddress,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction2, connection);

      const transaction3 = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAddress,
          wallet.publicKey,
          initialSupply * 10 ** 9, // Initial supply in smallest units
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction3, connection);

      alert("Token created successfully!");
      console.log(`Token Mint: ${mintKeypair.publicKey.toBase58()}`);
    } catch (error) {
      alert(`Error creating token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Styling variables based on dark mode
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
      <h1 className="text-3xl font-bold text-green-500 mb-6">Solana Token Launchpad</h1>
      <div className={`p-6 rounded-lg ${cardClasses}`}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Token Name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className={`w-full p-3 rounded-md ${inputClasses}`}
          />
          <input
            type="text"
            placeholder="Token Symbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className={`w-full p-3 rounded-md ${inputClasses}`}
          />
          <input
            type="text"
            placeholder="Metadata URI (Optional)"
            value={tokenUri}
            onChange={(e) => setTokenUri(e.target.value)}
            className={`w-full p-3 rounded-md ${inputClasses}`}
          />
          <input
            type="number"
            placeholder="Initial Supply"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            className={`w-full p-3 rounded-md ${inputClasses}`}
          />
          <button
            onClick={createToken}
            disabled={!wallet.connected || loading}
            className={`w-full p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
          >
            {loading ? "Creating Token..." : "Create Token"}
          </button>
        </div>
      </div>

      {!wallet.connected && (
        <div className="mt-6 p-4 bg-red-900/50 text-white rounded-lg">
          Wallet not connected
        </div>
      )}
    </div>
  );
};

export default TokenLaunchpad;
