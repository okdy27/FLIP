'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function FlipHomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Silakan hubungkan dompet atau verifikasi.');

  // Cek apakah user sudah terautentikasi sebelumnya via MiniKit
  useEffect(() => {
    if (MiniKit.isInstalled() && MiniKit.user?.walletAddress) {
      setWalletAddress(MiniKit.user.walletAddress);
      setStatusMessage('Terhubung via MiniKit');
    }
  }, []);

  // 1. Fungsi untuk Menghubungkan Dompet (Wallet Auth)
  const handleConnectWallet = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Silakan buka Mini App ini di dalam aplikasi World App!');
      return;
    }

    try {
      setStatusMessage('Meminta izin dompet...');

      const res = await MiniKit.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        statement: "Hubungkan Dompet FLIP di World App",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      if (res?.executedWith === "minikit" && res.data) {
        setWalletAddress(res.data.address);
        setStatusMessage('Dompet berhasil terhubung!');
      } else {
        setStatusMessage('Koneksi dompet dibatalkan/gagal.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatusMessage('Terjadi kesalahan saat menghubungkan dompet.');
    }
  };

  // 2. Fungsi untuk Memverifikasi World ID
  const handleVerifyWorldID = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Silakan buka Mini App ini di dalam aplikasi World App!');
      return;
    }

    try {
      setStatusMessage('Memproses verifikasi World ID...');

      const verifyPayload = {
        action: 'verify-flip-user',
        signal: 'flipsignal',
        verification_level: 'orb',
      };

      const res = await (MiniKit as any).commandsAsync.verify(verifyPayload);
      const finalPayload = res?.finalPayload || res?.data;

      if (finalPayload && (finalPayload.status === 'success' || finalPayload.nullifier_hash)) {
        setVerificationResult(finalPayload);
        setStatusMessage('World ID berhasil diverifikasi!');
      } else {
        setStatusMessage('Verifikasi World ID dibatalkan atau gagal.');
      }
    } catch (error) {
      console.error('Error verifying World ID:', error);
      setStatusMessage('Terjadi kesalahan saat verifikasi World ID.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-2">Dompet FLIP</h1>
        <p className="text-sm text-slate-400 mb-6">Mini App Keuangan Anda di World Chain</p>

        {/* JIKA BELUM TERHUBUNG: Tampilkan Tombol Koneksi & Verifikasi */}
        {!walletAddress ? (
          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-xl text-left">
              <p className="text-xs text-slate-400 mb-1">1. Alamat Dompet (Wallet Address):</p>
              <button
                onClick={handleConnectWallet}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm"
              >
                Hubungkan Wallet
              </button>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-xl text-left">
              <p className="text-xs text-slate-400 mb-1">2. Verifikasi World ID:</p>
              <button
                onClick={handleVerifyWorldID}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm"
              >
                Verifikasi World ID
              </button>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400">Status Sistem:</p>
              <p className="font-medium text-amber-400 text-sm">{statusMessage}</p>
            </div>
          </div>
        ) : (
          /* JIKA SUDAH TERHUBUNG: Masuk ke Tampilan Utama / Dashboard Dompet FLIP */
          <div className="space-y-4 text-left">
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl">
              <p className="text-xs text-emerald-400 font-semibold mb-1">Status:</p>
              <p className="text-sm text-emerald-200 font-medium">Berhasil terhubung!</p>
              <p className="text-xs text-slate-400 mt-3 mb-1">Alamat Dompet Anda:</p>
              <p className="font-mono text-xs bg-slate-900 p-2.5 rounded break-all text-emerald-400">
                {walletAddress}
              </p>
            </div>

            {verificationResult && (
              <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl">
                <p className="text-xs text-purple-300 font-medium">✓ World ID Terverifikasi (Human)</p>
              </div>
            )}

            {/* Menu Fitur Utama Dompet FLIP */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => alert('Fitur Kirim segera hadir!')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow"
              >
                Kirim (Send)
              </button>
              <button 
                onClick={() => alert('Fitur Terima segera hadir!')}
                className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow"
              >
                Terima (Receive)
              </button>
            </div>

            <button
              onClick={() => {
                setWalletAddress(null);
                setVerificationResult(null);
              }}
              className="w-full mt-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30 font-medium py-2 px-4 rounded-xl text-xs transition-all"
            >
              Putuskan Koneksi (Disconnect)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}