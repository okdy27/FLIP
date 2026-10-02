'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function FlipHomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Belum terhubung & terverifikasi');

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

  // 2. Fungsi untuk Memverifikasi World ID (Menggunakan type assertion agar aman dari error TS)
  const handleVerifyWorldID = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Silakan buka Mini App ini di dalam aplikasi World App!');
      return;
    }

    try {
      setStatusMessage('Memproses verifikasi World ID...');

      const verifyPayload = {
        action: 'verify-flip-user', // Pastikan Action ID ini sesuai dengan Worldcoin Developer Portal Anda
        signal: 'flipsignal',
        verification_level: 'orb', // Bisa diubah ke 'device' jika diperlukan
      };

      // Menggunakan casting (as any) untuk mengakomodasi struktur commandsAsync pada versi SDK ini
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
        <p className="text-sm text-slate-400 mb-6">Mini App Keuangan & World ID</p>

        <div className="space-y-4">
          {/* Bagian Wallet Address */}
          <div className="bg-slate-700/50 p-4 rounded-xl text-left">
            <p className="text-xs text-slate-400">1. Alamat Dompet (Wallet Address):</p>
            {walletAddress ? (
              <p className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 break-all text-emerald-400">
                {walletAddress}
              </p>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Hubungkan Wallet
              </button>
            )}
          </div>

          {/* Bagian World ID Verification */}
          <div className="bg-slate-700/50 p-4 rounded-xl text-left">
            <p className="text-xs text-slate-400">2. Verifikasi World ID:</p>
            {verificationResult ? (
              <p className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 break-all text-emerald-400">
                Terverifikasi (Nullifier: {verificationResult.nullifier_hash?.slice(0, 10)}...)
              </p>
            ) : (
              <button
                onClick={handleVerifyWorldID}
                className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Verifikasi World ID
              </button>
            )}
          </div>

          <div className="pt-2">
            <p className="text-xs text-slate-400">Status Sistem:</p>
            <p className="font-medium text-amber-400 text-sm">{statusMessage}</p>
          </div>
        </div>
      </div>
    </main>
  );
}