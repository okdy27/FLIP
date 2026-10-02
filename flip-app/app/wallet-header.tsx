'use client';

import { useState, useEffect, useCallback } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function WalletHeader() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectWorldIDWallet = useCallback(async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      if (!MiniKit.isInstalled()) {
        setErrorMessage('Silakan buka aplikasi ini di dalam World App.');
        setIsConnecting(false);
        return;
      }

      // 1. Cek jika alamat dompet sudah tersimpan di MiniKit
      const existingAddress =
        (MiniKit as any).walletAddress || (MiniKit as any).user?.walletAddress;

      if (existingAddress) {
        setWalletAddress(`${existingAddress.slice(0, 6)}...${existingAddress.slice(-4)}`);
        setIsConnecting(false);
        return;
      }

      // 2. Memanggil POP-UP Native World App untuk koneksi dompet (Wallet Auth / SIWE)
      const nonce = Math.random().toString(36).substring(2, 15);

      const authRes = await (MiniKit as any).commandsAsync?.walletAuth({
        nonce: nonce,
        requestId: `flip-auth-${Date.now()}`,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: 'Hubungkan dompet World ID Anda ke FLIP Wallet & Swap',
      });

      console.log('Response Wallet Auth:', authRes);

      if (authRes?.finalPayload?.status === 'success') {
        const address =
          authRes?.finalPayload?.address ||
          (MiniKit as any).walletAddress ||
          (MiniKit as any).user?.walletAddress;

        if (address) {
          setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        } else {
          setWalletAddress('Terhubung');
        }
      } else {
        setErrorMessage('Koneksi dompet dibatalkan.');
      }
    } catch (err: any) {
      console.error('Error Wallet Auth:', err);
      setErrorMessage(err?.message || 'Gagal menghubungkan dompet World ID');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Memunculkan pop-up koneksi secara otomatis saat pertama kali dimuat di World App
  useEffect(() => {
    if (MiniKit.isInstalled() && !walletAddress) {
      connectWorldIDWallet();
    }
  }, [connectWorldIDWallet, walletAddress]);

  return (
    <header className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-emerald-400">
          FLIP
        </h1>
        <p className="text-[10px] text-slate-400">World Chain Wallet & Swap</p>
      </div>

      <div>
        {walletAddress ? (
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs font-mono font-bold text-emerald-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{walletAddress}</span>
          </div>
        ) : (
          <button
            onClick={connectWorldIDWallet}
            disabled={isConnecting}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
          >
            {isConnecting ? 'Menghubungkan...' : 'Konek World ID'}
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="absolute top-16 left-4 right-4 p-2 bg-rose-950/90 border border-rose-800 rounded-lg text-xs text-rose-200 text-center">
          {errorMessage}
        </div>
      )}
    </header>
  );
}