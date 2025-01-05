import React, { useState, useMemo } from "react";
import { Menu, Wallet, Settings, Info, Coins } from "lucide-react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import ExplorerSearch from "./components/ExplorerSearch";
import Sidebar from "./components/Sidebar";
import WebWallet from "./components/WebWallet";
import RequestAirdrop from "./components/RequestAirdrop";

// Import wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

// Menu configuration
const MENU_ITEMS = [
  {
    id: "webWallet",
    label: "Web-Wallet",
    icon: Wallet,
    component: WebWallet,
  },
  {
    id: "requestAirdrop",
    label: "Request Airdrop",
    icon: Coins,
    component: RequestAirdrop,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    component: () => <div>Settings Page (Coming Soon)</div>,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
    component: () => <div>About Page (Coming Soon)</div>,
  },
];

const App = () => {
  // Solana Connection Configuration
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add other wallet adapters here if needed
    ],
    []
  );

  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [activeExplorer, setActiveExplorer] = useState(null);
  const [activeComponent, setActiveComponent] = useState("webWallet");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const openExplorer = (type) => {
    setActiveExplorer(type);
    setExplorerOpen(true);
  };

  // Function to render the active component
  const renderActiveComponent = () => {
    const menuItem = MENU_ITEMS.find((item) => item.id === activeComponent);
    if (menuItem) {
      const Component = menuItem.component;
      return <Component darkMode={darkMode} />;
    }
    return <div>Select an option from the menu</div>;
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div
            className={`min-h-screen ${
              darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}
          >
            {/* Header */}
            <header
              className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-gray-800 to-gray-900"
                  : "bg-gradient-to-r from-white to-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className={`inline-flex items-center justify-center p-2 rounded-md ${
                    darkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-200 text-gray-900"
                  }`}
                  aria-label="Toggle Sidebar"
                >
                  <Menu className="h-6 w-6" />
                </button>

                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <span>🪙</span> Wallet Generator
                </h1>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  onClick={() => openExplorer("sol")}
                >
                  SOL Explorer
                </button>
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  onClick={() => openExplorer("eth")}
                >
                  ETH Explorer
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                    darkMode
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                      : "bg-black hover:bg-gray-700"
                  }`}
                  onClick={toggleDarkMode}
                >
                  {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>
              </div>
            </header>

            <div className="flex">
              {/* Sidebar */}
              <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                darkMode={darkMode}
                setActiveComponent={setActiveComponent}
                activeComponent={activeComponent}
                menuItems={MENU_ITEMS}
              />

              {/* Main Content */}
              <main
                className={`flex-1 transition-all duration-300 ${
                  isSidebarOpen ? "md:ml-64" : "md:ml-0"
                }`}
              >
                <div className="max-w-7xl mx-auto px-6 py-8">
                  {renderActiveComponent()}
                </div>
              </main>
            </div>

            {/* Explorer Search */}
            <ExplorerSearch
              isOpen={explorerOpen}
              onClose={() => setExplorerOpen(false)}
              type={activeExplorer}
              darkMode={darkMode}
            />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
