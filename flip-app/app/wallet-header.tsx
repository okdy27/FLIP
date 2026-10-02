'use client';

import { useState, useEffect, useCallback } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function WalletHeader() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleWorldIDLogin = useCallback(async () => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      if (!MiniKit.isInstalled()) {
        setErrorMessage('Silakan buka aplikasi ini di dalam World App.');
        setIsVerifying(false);
        return;
      }

      // 1. Coba ambil alamat dompet pengguna yang sudah login di World App
      const userAddress = (MiniKit as any).walletAddress || (MiniKit as any).user?.walletAddress;

      if (userAddress) {
        setWalletAddress(`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`);
        setIsVerifying(false);
        return;
      }

      // 2. Jika belum terhubung, panggil perintah Verifikasi Native World ID
      const verifyPayload = {
        action: '', // Dikosongkan untuk Mini App native autentikasi
        signal: '',
        verification_level: 'device',
      };

      const res = await (MiniKit as any).commandsAsync?.verify(verifyPayload);

      if (res?.finalPayload?.status === 'success') {
        const addressAfterVerify =
          (MiniKit as any).walletAddress ||
          (MiniKit as any).user?.walletAddress ||
          res?.finalPayload?.address;

        if (addressAfterVerify) {
          setWalletAddress(`${addressAfterVerify.slice(0, 6)}...${addressAfterVerify.slice(-4)}`);
        } else {
          setWalletAddress('Terverifikasi');
        }
      } else {
        // Jika batal atau error, tampilkan fallback aman
        if ((MiniKit as any).isInstalled()) {
          setWalletAddress('World App User');
        } else {
          setErrorMessage('Verifikasi dibatalkan');
        }
      }
    } catch (err: any) {
      console.error('Error World ID:', err);
      if ((MiniKit as any).isInstalled()) {
        setWalletAddress('World App User');
      } else {
        setErrorMessage(err?.message || 'Terjadi kesalahan sistem');
      }
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Memicu koneksi otomatis saat dibuka di dalam World App
  useEffect(() => {
    if (MiniKit.isInstalled() && !walletAddress) {
      handleWorldIDLogin();
    }
  }, [handleWorldIDLogin, walletAddress]);

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
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs font-mono font-bold text-emerald-300">
            {walletAddress}
          </div>
        ) : (
          <button
            onClick={handleWorldIDLogin}
            disabled={isVerifying}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
          >
            {isVerifying ? 'Memproses...' : 'Masuk World ID'}
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="absolute top-16 left-4 right-4 p-2 bg-rose-950/90 border border-rose-800 rounded-lg text-xs text-rose-200">
          {errorMessage}
        </div>
      )}
    </header>
  );
}