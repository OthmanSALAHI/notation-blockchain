import React from "react";

interface ConnectWalletProps {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  account,
  isConnected,
  connectWallet,
}) => {
  // Shorten address: 0x1234...5678
  const shortAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="flex items-center justify-between bg-gray-900 px-6 py-4 rounded-xl shadow-lg">
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          N
        </div>
        <h1 className="text-white font-bold text-lg tracking-wide">
          Notation Enseignants
        </h1>
      </div>

      {/* Wallet Button */}
      {isConnected && account ? (
        <div className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 text-sm font-mono">
            {shortAddress(account)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Connecter MetaMask
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;