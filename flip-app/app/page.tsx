'use client';

import { useState } from 'react';
import WalletHeader from './wallet-header';
import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'swap'>('wallet');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fungsi untuk mengeksekusi Swap menggunakan MiniKit Pay / Transaction
  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Masukkan jumlah token yang valid.');
      return;
    }

    if (!MiniKit.isInstalled()) {
      alert('Buka aplikasi FLIP melalui World App untuk melakukan Swap.');
      return;
    }

    setIsProcessing(true);

    try {
      const payPayload = {
        reference: `flip-swap-${Date.now()}`,
        to: '0x000ed6c7f4c9de18b91b60691baa27ec4f1b0000', // Alamat Router / Receiver FLIP
        tokens: [
          {
            symbol: 'WLD',
            token_amount: amount,
          },
        ],
        description: `FLIP Swap: ${amount} WLD`,
      };

      const response = await (MiniKit as any).commandsAsync?.pay(payPayload);

      if (response?.finalPayload?.status === 'success') {
        alert('Transaksi Swap berhasil diajukan!');
        setAmount('');
      } else {
        alert('Transaksi dibatalkan atau gagal.');
      }
    } catch (err: any) {
      console.error('Error saat Swap:', err);
      alert('Terjadi kesalahan saat memproses Swap.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-900 border-x border-slate-800 shadow-2xl">
        
        {/* Header Autentikasi World ID */}
        <WalletHeader />

        {/* Konten Utama */}
        <div className="flex-1 p-4 space-y-6">
          
          {/* Ringkasan Saldo Dompet */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-800 to-slate-900 border border-emerald-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 font-bold text-6xl select-none">
              FLIP
            </div>
            
            <p className="text-xs font-medium text-emerald-400 tracking-wider uppercase mb-1">
              Total Estimasi Saldo
            </p>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Rp 0 <span className="text-xs text-slate-400 font-normal">IDR</span>
            </h2>

            {/* Tombol Navigasi Cepat */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setActiveTab('swap')}
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1"
              >
                <span>Swap Token</span>
              </button>
              <button
                onClick={() => alert('Fitur Transfer Kirim Dompet akan segera aktif!')}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center space-x-1"
              >
                <span>Kirim</span>
              </button>
            </div>
          </div>

          {/* Navigasi Tab */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'wallet'
                  ? 'bg-slate-800 text-emerald-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dompet & Aset
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'swap'
                  ? 'bg-slate-800 text-emerald-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FLIP Swap
            </button>
          </div>

          {/* Area Tampilan Berdasarkan Tab */}
          {activeTab === 'wallet' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                Aset Terhubung (World Chain)
              </h3>

              <div className="p-3.5 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    WLD
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-100">Worldcoin</p>
                    <p className="text-xs text-slate-400">0.00 WLD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-slate-200">Rp 0</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 text-slate-300 border border-slate-600 flex items-center justify-center font-bold text-sm">
                    USD
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-100">USDC</p>
                    <p className="text-xs text-slate-400">0.00 USDC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-slate-200">Rp 0</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-emerald-400">FLIP Instant Swap</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                  World Chain
                </span>
              </div>

              {/* Input Token Asal */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Anda Bayar</span>
                  <span>Saldo: 0.00 WLD</span>
                </div>
                <div className="flex justify-between items-center">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-xl font-bold text-white outline-none w-1/2"
                  />
                  <span className="font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400">
                    WLD
                  </span>
                </div>
              </div>

              {/* Estimasi Token Tujuan */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Anda Terima (Estimasi)</span>
                  <span>Saldo: 0.00 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amount ? (parseFloat(amount) * 1.5).toFixed(2) : ''}
                    disabled
                    className="bg-transparent text-xl font-bold text-slate-400 outline-none w-1/2"
                  />
                  <span className="font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                    USDC
                  </span>
                </div>
              </div>

              {/* Tombol Eksekusi */}
              <button
                onClick={handleSwap}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 text-center"
              >
                {isProcessing ? 'Memproses Swap...' : 'Eksekusi Swap'}
              </button>
            </div>
          )}

        </div>

        <footer className="p-3 text-center text-[11px] text-slate-500 border-t border-slate-800">
          FLIP Wallet Mini App &bull; Powered by World Chain & MiniKit SDK
        </footer>

      </div>
    </main>
  );
}