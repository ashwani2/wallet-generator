import React, { useState, useEffect } from "react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createInitializeMintInstruction,
  getMint,
} from "@solana/spl-token";

const TokenLaunchpad = ({ darkMode }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [mintAddress, setMintAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);

  const createToken = async () => {
    if (!wallet.publicKey || !tokenName || !tokenSymbol) {
      alert("Please fill in all fields and connect your wallet.");
      return;
    }

    const mintKeypair = Keypair.generate();

    try {
      setLoading(true);

      const lamports = await connection.getMinimumBalanceForRentExemption(82);

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
          9,
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
          initialSupply * 10 ** 9,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction3, connection);

      setMintAddress(mintKeypair.publicKey.toBase58());
      alert("Token created successfully!");
    } catch (error) {
      alert(`Error creating token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);

    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const fetchedTokens = await Promise.all(
        tokenAccounts.value.map(async (accountInfo) => {
          const { data } = accountInfo.account;

          // Safely access parsed data
          if (
            data &&
            data.parsed &&
            data.parsed.info &&
            data.parsed.info.mint &&
            data.parsed.info.tokenAmount
          ) {
            const { mint, tokenAmount } = data.parsed.info;

            // Fetch mint metadata
            const mintAccount = await getMint(connection, new PublicKey(mint));

            return {
              mint,
              amount: tokenAmount.uiAmount || 0,
              decimals: mintAccount.decimals,
            };
          } else {
            console.warn(
              "Skipped account with unexpected structure:",
              accountInfo
            );
            return null; // Skip invalid accounts
          }
        })
      );

      // Filter out null values (invalid accounts)
      setTokens(fetchedTokens.filter((token) => token !== null));
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchTokens();
    }
  }, [wallet.connected]);

  const containerClasses = darkMode
    ? "bg-black text-white"
    : "bg-white text-black";
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
      {/* Wallet Buttons */}
      <div className="flex gap-4 mb-8">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
        <WalletDisconnectButton className="!bg-red-600 hover:!bg-red-700 !rounded-md" />
      </div>

      <h1 className="text-3xl font-bold text-green-500 mb-6">
        Solana Token Launchpad
      </h1>

      {/* Token Form */}
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

      {/* Display Created Token Details */}
      {mintAddress && (
        <div className={`mt-8 p-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-bold text-green-500 mb-4">
            Token Created Successfully!
          </h2>
          <p>
            <strong>Name:</strong> {tokenName}
          </p>
          <p>
            <strong>Symbol:</strong> {tokenSymbol}
          </p>
          <p>
            <strong>Mint Address:</strong> {mintAddress}
          </p>
          <p>
            <strong>Initial Supply:</strong> {initialSupply} (in full tokens)
          </p>
        </div>
      )}

      {/* Display Wallet Tokens */}
      {tokens.length > 0 && (
        <div className={`mt-8 p-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-bold text-blue-500 mb-4">Your Tokens</h2>
          <ul>
            {tokens.map((token, index) => (
              <li key={index} className="mb-2">
                <strong>Mint:</strong> {token.mint} <br />
                <strong>Balance:</strong> {token.balance}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!wallet.connected && (
        <div className="mt-6 p-4 bg-red-900/50 text-white rounded-lg">
          Wallet not connected
        </div>
      )}
    </div>
  );
};

export default TokenLaunchpad;
