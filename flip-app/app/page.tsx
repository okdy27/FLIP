'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function FlipHomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Belum terhubung');

  // Cek apakah user sudah terautentikasi sebelumnya
  useEffect(() => {
    if (MiniKit.isInstalled() && MiniKit.user?.walletAddress) {
      setWalletAddress(MiniKit.user.walletAddress);
      setStatusMessage('Terhubung via MiniKit');
    }
  }, []);

  // Fungsi untuk menghubungkan dompet World App
  const handleConnectWallet = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Silakan buka Mini App ini di dalam aplikasi World App!');
      return;
    }

    try {
      setStatusMessage('Meminta izin dompet...');

      // Memanggil walletAuth tanpa properti 'uri'
      const res = await MiniKit.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        statement: "Masuk ke Dompet FLIP di World App",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      if (res?.executedWith === "minikit" && res.data) {
        const { address } = res.data;
        setWalletAddress(address);
        setStatusMessage('Berhasil terhubung!');
        console.log("Wallet Address:", address);
      } else {
        setStatusMessage('Autentikasi dompet dibatalkan/gagal.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatusMessage('Terjadi kesalahan saat menghubungkan dompet.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-2">Dompet FLIP</h1>
        <p className="text-sm text-slate-400 mb-6">Mini App Keuangan Anda di World Chain</p>

        <div className="bg-slate-700/50 p-4 rounded-xl mb-6">
          <p className="text-xs text-slate-400">Status:</p>
          <p className="font-medium text-amber-400">{statusMessage}</p>
          
          {walletAddress ? (
            <div className="mt-3">
              <p className="text-xs text-slate-400">Alamat Dompet Anda:</p>
              <p className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 break-all text-emerald-400">
                {walletAddress}
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg"
            >
              Hubungkan Wallet World App
            </button>
          )}
        </div>
      </div>
    </main>
  );
}