'use client';

import { useState, useEffect, useCallback } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import WalletHeader, { Language } from '@/Components/wallet-header';
import BalanceCard from '@/Components/BalanceCard';
import SwapCard from '@/Components/SwapCard';
import TxHistory, { TransactionItem } from '@/Components/TxHistory';
import { fetchLiveBalances } from '@/lib/worldchain';

export default function Home() {
  // Alamat fallback default jika dibuka di luar World App (browser biasa)
  const FALLBACK_ADDRESS = '0xd8d24c556d53f627fbb9bccafd659ad1bb8e6045';

  const [userAddress, setUserAddress] = useState<string>(FALLBACK_ADDRESS);
  const [activeTab, setActiveTab] = useState<'home' | 'swap' | 'history'>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);

  const [balances, setBalances] = useState({
    USDC: '0.00',
    WLD: '0.00',
    SUSHI: '0.00',
    ETH: '0.0000',
    BTC: '0.0012',
  });

  // 1. Deteksi Otomatis Wallet Address dari MiniKit SDK (World App)
  useEffect(() => {
    try {
      if (MiniKit.isInstalled()) {
        const minikitAddress = MiniKit.user?.walletAddress || (MiniKit as unknown as { walletAddress?: string }).walletAddress;
        if (minikitAddress) {
          setUserAddress(minikitAddress);
        }
      }
    } catch (error) {
      console.warn('MiniKit belum terinstal atau berjalan di browser biasa:', error);
    }
  }, []);

  // 2. Ambil Saldo Real-Time On-Chain dari World Chain RPC
  const loadBalances = useCallback(async () => {
    setIsLoadingBalance(true);
    const targetAddress = (userAddress && userAddress.startsWith('0x')
      ? userAddress
      : FALLBACK_ADDRESS) as `0x${string}`;

    const liveData = await fetchLiveBalances(targetAddress);
    setBalances(liveData);
    setIsLoadingBalance(false);
  }, [userAddress]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  // 3. Sync Tab Aktif via URL Query Params (?tab=home|swap|history)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as 'home' | 'swap' | 'history';
    if (tabParam && ['home', 'swap', 'history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleTabChange = (tab: 'home' | 'swap' | 'history') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'tx-1',
      type: 'SWAP',
      fromToken: 'WLD',
      toToken: 'USDC',
      fromAmount: '5.0',
      toAmount: '9.25',
      status: 'success',
      timestamp: 'Baru saja',
      txHash: '0xabc...123',
    },
  ]);

  const handleSend = () => {
    alert(
      language === 'id'
        ? `Fitur Kirim Token (World Chain)`
        : language === 'en'
        ? `Send Token Feature (World Chain)`
        : `Función Enviar Token (World Chain)`
    );
  };

  const handleReceive = () => {
    alert(
      language === 'id'
        ? `Alamat Wallet Anda: ${userAddress}`
        : language === 'en'
        ? `Your Wallet Address: ${userAddress}`
        : `Su Dirección de Billetera: ${userAddress}`
    );
  };

  return (
    <div className="min-h-screen bg-[#070d12] text-white pb-24 relative font-sans select-none">
      {/* HEADER ATAS */}
      <WalletHeader
        userAddress={userAddress}
        currentLang={language}
        onLanguageChange={(lang) => setLanguage(lang)}
      />

      {/* KONTEN UTAMA */}
      <main className="p-4 md:p-6 max-w-lg mx-auto w-full transition-all duration-300">
        {/* TAB HOME */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            <BalanceCard
              userAddress={userAddress}
              wldBalance={balances.WLD}
              usdcBalance={balances.USDC}
              btcBalance={balances.BTC}
              isLoading={isLoadingBalance}
              lang={language}
              onSend={handleSend}
              onReceive={handleReceive}
              onHistory={() => handleTabChange('history')}
            />
          </div>
        )}

        {/* TAB SWAP */}
        {activeTab === 'swap' && (
          <div className="pt-2 animate-fadeIn">
            <SwapCard
              userAddress={userAddress}
              balances={balances}
              lang={language}
            />
          </div>
        )}

        {/* TAB RIWAYAT */}
        {activeTab === 'history' && (
          <div className="pt-2 animate-fadeIn">
            <TxHistory
              transactions={transactions}
              lang={language}
              onClearHistory={() => setTransactions([])}
            />
          </div>
        )}
      </main>

      {/* NAVIGASI BAWAH */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-[#0b131a]/95 backdrop-blur-md border-t border-slate-800/80">
        <nav className="w-full max-w-lg flex justify-around items-center py-3 px-4">
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px]">
              {language === 'id' ? 'Home' : language === 'en' ? 'Home' : 'Inicio'}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('swap')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'swap'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-[10px]">
              {language === 'id' ? 'Swap' : language === 'en' ? 'Swap' : 'Intercambio'}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('history')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'history'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px]">
              {language === 'id' ? 'Riwayat' : language === 'en' ? 'History' : 'Historial'}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}