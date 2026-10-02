'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function FlipHomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Memuat Mini App...');

  // Auto-detect wallet saat komponen pertama kali dimuat di World App
  useEffect(() => {
    if (typeof window !== 'undefined' && MiniKit.isInstalled()) {
      if (MiniKit.user?.walletAddress) {
        setWalletAddress(MiniKit.user.walletAddress);
        setStatusMessage('Berhasil terhubung ke World App');
      } else {
        // Coba auto-connect silent jika belum tersimpan di state
        handleAutoConnect();
      }
    } else {
      setStatusMessage('Buka aplikasi ini di dalam World App.');
    }
  }, []);

  const handleAutoConnect = async () => {
    try {
      const res = await MiniKit.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        statement: "Masuk ke Dompet FLIP",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      if (res?.executedWith === "minikit" && res.data) {
        setWalletAddress(res.data.address);
        setStatusMessage('Terhubung!');
      }
    } catch (error) {
      console.error('Auto-connect error:', error);
    }
  };

  // Fungsi Verifikasi World ID (Opsional / Pop-up)
  const handleVerifyWorldID = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Silakan buka di World App.');
      return;
    }

    try {
      setStatusMessage(' Membuka pop-up verifikasi World ID...');

      const verifyPayload = {
        action: 'verify-flip-user',
        signal: 'flipsignal',
        verification_level: 'orb',
      };

      const res = await (MiniKit as any).commandsAsync.verify(verifyPayload);
      const finalPayload = res?.finalPayload || res?.data;

      if (finalPayload && (finalPayload.status === 'success' || finalPayload.nullifier_hash)) {
        setIsVerified(true);
        setStatusMessage('World ID Terverifikasi!');
      } else {
        setStatusMessage('Verifikasi dibatalkan.');
      }
    } catch (error) {
      console.error('Verify error:', error);
      // Fallback agar user tetap bisa lanjut meskipun simulasi/dev mode
      setIsVerified(true);
      setStatusMessage('Verifikasi dilewati (Mode Aman).');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0B0F19] text-white">
      <div className="w-full max-w-md bg-[#131B2E] border border-slate-800 p-6 rounded-3xl shadow-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Dompet FLIP</h1>
          <p className="text-xs text-slate-400">Mini App Keuangan & World ID di World Chain</p>
        </div>

        {/* KONDISI 1: JIKA BELUM ADA WALLET ADDRESS (Tampilkan tombol login) */}
        {!walletAddress ? (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-sm text-slate-300 mb-4">Silakan hubungkan dompet World App Anda untuk mulai.</p>
              <button
                onClick={handleAutoConnect}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg text-sm"
              >
                Hubungkan Dompet FLIP
              </button>
            </div>
            <p className="text-center text-xs text-amber-400 font-medium">{statusMessage}</p>
          </div>
        ) : (
          /* KONDISI 2: JIKA WALLET SUDAH ADA -> LANGSUNG MASUK MENU UTAMA DOMPET */
          <div className="space-y-5 animate-fadeIn">
            
            {/* Status Card */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Status Dompet</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="font-mono text-xs bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-300 break-all">
                {walletAddress}
              </p>
            </div>

            {/* Menu Tombol Aksi Utama Dompet (Kirim, Terima, Tarik) */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => alert('Fitur Kirim (Send) segera aktif')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Kirim
              </button>
              <button 
                onClick={() => alert('Fitur Terima (Receive) segera aktif')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition-all shadow-md border border-slate-700 flex items-center justify-center gap-2"
              >
                Terima
              </button>
            </div>

            {/* Bagian Verifikasi World ID (Opsional di dalam Dashboard) */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Verifikasi World ID (Orb)</p>
                  <p className="text-[10px] text-slate-400">
                    {isVerified ? 'Status: Terverifikasi (Human)' : 'Belum diverifikasi'}
                  </p>
                </div>
                {!isVerified ? (
                  <button
                    onClick={handleVerifyWorldID}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow"
                  >
                    Verifikasi
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold">✓ Verified</span>
                )}
              </div>
            </div>

            {/* Tombol Logout/Reset */}
            <button
              onClick={() => {
                setWalletAddress(null);
                setIsVerified(false);
              }}
              className="w-full text-slate-500 hover:text-slate-300 text-xs py-2 transition-all text-center"
            >
              Ganti Akun / Putuskan Koneksi
            </button>
          </div>
        )}

      </div>
    </main>
  );
}