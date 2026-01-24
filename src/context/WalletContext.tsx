import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { connectWallet as connectWalletFn, initDemoData } from '@/lib/blockchain';

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  isAdmin: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setIsAdmin: (value: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize demo data on mount
    initDemoData();
    
    // Check for stored wallet
    const stored = localStorage.getItem('wallet_address');
    if (stored) {
      setAddress(stored);
    }
    
    const storedAdmin = localStorage.getItem('is_admin');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      const addr = await connectWalletFn();
      setAddress(addr);
      localStorage.setItem('wallet_address', addr);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setIsAdmin(false);
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('is_admin');
  }, []);

  const handleSetIsAdmin = useCallback((value: boolean) => {
    setIsAdmin(value);
    localStorage.setItem('is_admin', String(value));
  }, []);

  return (
    <WalletContext.Provider value={{ 
      address, 
      isConnecting, 
      isAdmin,
      connectWallet, 
      disconnectWallet,
      setIsAdmin: handleSetIsAdmin,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
