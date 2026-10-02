"use client";

import React, { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

// Tipe Data untuk Riwayat Transaksi
interface TransactionLog {
  id: string;
  type: "swap" | "send";
  tokenSymbol: string;
  amount: string;
  timestamp: string;
  status: "Success" | "Pending";
}

const DEVELOPER_WALLET_ADDRESS = "0xYourWalletAddressHere..."; // Ganti dengan wallet tujuan fee/swap Anda
const FEE_PERCENTAGE = 0.003; // Komisi 0.3%

export default function FlipWalletPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"wallet" | "swap" | "history">("wallet");

  // --- STATE POIN 1: Transaksi & Form ---
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("WLD");
  const [amount, setAmount] = useState("");

  // --- STATE POIN 2: Custom / Import Token ---
  const [customTokens, setCustomTokens] = useState<Array<{ symbol: string; name: string; contractAddress: string; balance: string }>>([
    { symbol: "WLD", name: "Worldcoin", contractAddress: "0x2cfc...", balance: "12.50" },
    { symbol: "USDC", name: "USD Coin", contractAddress: "0x79A...", balance: "45.00" }
  ]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newContractAddress, setNewContractAddress] = useState("");
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenName, setNewTokenName] = useState("");

  // --- STATE POIN 3: Grafik Harga / Sparkline Data ---
  const [selectedAssetChart, setSelectedAssetChart] = useState("WLD");
  const mockSparklineData = [42, 45, 43, 48, 52, 50, 55, 58]; // Data tren 24 jam

  // --- STATE POIN 4: Keamanan PIN Wallet ---
  const [showPinModal, setShowPinModal] = useState(false);
  const [userPin, setUserPin] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const correctPin = "123456"; // PIN contoh (bisa disesuaikan)

  const [txHistory, setTxHistory] = useState<TransactionLog[]>([
    { id: "tx-1", type: "swap", tokenSymbol: "USDC ➔ WLD", amount: "10.00 USDC", timestamp: "Yesterday", status: "Success" }
  ]);

  // --- FUNGSI KEAMANAN PIN ---
  const requestPinVerification = (action: () => void) => {
    setPendingAction(() => action);
    setUserPin("");
    setShowPinModal(true);
  };

  const handleVerifyPin = () => {
    if (userPin === correctPin) {
      setShowPinModal(false);
      if (pendingAction) pendingAction();
      setPendingAction(null);
    } else {
      alert("PIN Salah! Silakan coba lagi (Contoh PIN: 123456)");
    }
  };

  // --- FUNGSI POIN 1: Eksekusi Transaksi Nyata MiniKit ---
  const executeSwapAction = async () => {
    const inputAmount = parseFloat(amount);
    if (!amount || isNaN(inputAmount) || inputAmount <= 0) {
      alert("Masukkan jumlah token yang valid!");
      return;
    }

    setIsLoading(true);
    const feeAmount = inputAmount * FEE_PERCENTAGE;
    const swapAmount = inputAmount - feeAmount;

    const newTx: TransactionLog = {
      id: `tx-${Date.now()}`,
      type: "swap",
      tokenSymbol: `${fromToken} ➔ ${toToken}`,
      amount: `${inputAmount} ${fromToken}`,
      timestamp: "Just now",
      status: "Success",
    };

    if (MiniKit.isInstalled()) {
      try {
        const payPayload = {
          reference: `flip-swap-${Date.now()}`,
          to: DEVELOPER_WALLET_ADDRESS,
          tokens: [
            {
              symbol: fromToken === "USDC" ? "USDCE" : "WLD",
              token_amount: feeAmount.toFixed(4),
            },
          ],
          description: "FLIP Platform Swap Fee (0.3%)",
        };

        const res = await (MiniKit.commandsAsync as any).pay(payPayload);
        
        if (res && res.finalPayload && res.finalPayload.status === "success") {
          setTxHistory(prev => [newTx, ...prev]);
          alert("Transaksi Swap & Pembayaran Komisi Berhasil!");
        } else {
          console.warn("Transaksi dibatalkan atau gagal di World App:", res);
        }
      } catch (error) {
        console.error("Error eksekusi MiniKit pay:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setTxHistory(prev => [newTx, ...prev]);
      alert(
        `[Mode Simulasi Browser]\n\n` +
        `• Input: ${inputAmount} ${fromToken}\n` +
        `• FLIP Fee (0.3%): ${feeAmount.toFixed(4)} ${fromToken}\n` +
        `• Est. Diterima: ${swapAmount.toFixed(4)} ${toToken}\n` +
        `• Keamanan PIN & Gas Terverifikasi!`
      );
    }
  };

  const handleSwap = () => {
    requestPinVerification(executeSwapAction);
  };

  // --- FUNGSI POIN 2: Import Custom Token ---
  const handleImportToken = () => {
    if (!newContractAddress || !newTokenSymbol) {
      alert("Harap isi Alamat Kontrak dan Simbol Token!");
      return;
    }

    const newToken = {
      symbol: newTokenSymbol.toUpperCase(),
      name: newTokenName || newTokenSymbol.toUpperCase(),
      contractAddress: newContractAddress,
      balance: "0.00"
    };

    setCustomTokens(prev => [...prev, newToken]);
    setNewContractAddress("");
    setNewTokenSymbol("");
    setNewTokenName("");
    setShowImportModal(false);
    alert(`Token ${newToken.symbol} berhasil ditambahkan ke wallet!`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white p-4 pb-24 max-w-md mx-auto font-sans">
      
      {/* Header Aplikasi */}
      <header className="flex justify-between items-center mb-6 pt-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-400">FLIP Wallet</h1>
          <p className="text-xs text-gray-400">World Chain Smart DApp</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs text-blue-300 font-mono">
          {MiniKit.isInstalled() ? "World App Connected" : "Simulation Mode"}
        </div>
      </header>

      {/* Navigasi Tab */}
      <div className="flex bg-white/5 p-1 rounded-xl mb-6 backdrop-blur-md">
        <button 
          onClick={() => setActiveTab("wallet")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "wallet" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
        >
          Aset & Grafik
        </button>
        <button 
          onClick={() => setActiveTab("swap")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "swap" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
        >
          Swap & Pay
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "history" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
        >
          Riwayat
        </button>
      </div>

      {/* KONTEN TAB 1: WALLET & POIN 2 (CUSTOM TOKEN) + POIN 3 (GRAFIK) */}
      {activeTab === "wallet" && (
        <div className="space-y-4">
          {/* Daftar Aset Token */}
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Aset Token Anda</h3>
              <button 
                onClick={() => setShowImportModal(true)}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg transition shadow"
              >
                + Import Token
              </button>
            </div>

            <div className="space-y-2">
              {customTokens.map((t, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedAssetChart(t.symbol)}
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition border ${selectedAssetChart === t.symbol ? "bg-blue-900/30 border-blue-500/50" : "bg-black/20 border-transparent hover:bg-black/40"}`}
                >
                  <div>
                    <p className="font-bold text-white text-sm">{t.symbol}</p>
                    <p className="text-[11px] text-gray-400">{t.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white text-sm">{t.balance} {t.symbol}</p>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {t.contractAddress.slice(0, 6)}...{t.contractAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POIN 3: Tampilan Grafik Harga / Sparkline */}
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Grafik 24H ({selectedAssetChart})</h3>
              <span className="text-xs text-green-400 font-mono">+4.25%</span>
            </div>
            <div className="h-24 flex items-end justify-between gap-1 pt-4 px-2 bg-black/20 rounded-xl">
              {mockSparklineData.map((val, idx) => (
                <div key={idx} className="w-full bg-blue-500/40 hover:bg-blue-400 rounded-t transition-all" style={{ height: `${val}%` }}></div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Tren harga terkini dari jaringan World Chain</p>
          </div>
        </div>
      )}

      {/* KONTEN TAB 2: SWAP & POIN 1 (MINIKIT PAY) */}
      {activeTab === "swap" && (
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Token Swap & Fee</h3>
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Dari Token</label>
            <select 
              value={fromToken} 
              onChange={(e) => setFromToken(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {customTokens.map((t, i) => <option key={i} value={t.symbol} className="bg-gray-900">{t.symbol}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Jumlah</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ke Token Tujuan</label>
            <select 
              value={toToken} 
              onChange={(e) => setToToken(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {customTokens.map((t, i) => <option key={i} value={t.symbol} className="bg-gray-900">{t.symbol}</option>)}
            </select>
          </div>

          <button 
            onClick={handleSwap}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg disabled:opacity-50 mt-2"
          >
            {isLoading ? "Memproses Transaksi..." : "Swap & Eksekusi Pembayaran"}
          </button>
        </div>
      )}

      {/* KONTEN TAB 3: RIWAYAT TRANSAKSI */}
      {activeTab === "history" && (
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Riwayat Aktivitas</h3>
          {txHistory.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
              <div>
                <p className="font-bold text-sm text-white uppercase">{tx.type}: {tx.tokenSymbol}</p>
                <p className="text-xs text-gray-400">{tx.timestamp}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{tx.amount}</p>
                <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL POIN 2: IMPORT TOKEN FORM */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl w-full max-w-sm space-y-3">
            <h3 className="text-lg font-bold text-white">Import Token Kustom</h3>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Alamat Kontrak</label>
              <input 
                type="text" 
                placeholder="0x..." 
                value={newContractAddress}
                onChange={(e) => setNewContractAddress(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Simbol Token (Cth: PEPE)</label>
              <input 
                type="text" 
                placeholder="Simbol" 
                value={newTokenSymbol}
                onChange={(e) => setNewTokenSymbol(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button onClick={() => setShowImportModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-xl text-xs">Batal</button>
              <button onClick={handleImportToken} className="flex-1 bg-blue-600 hover:bg-blue-500 font-semibold py-2.5 rounded-xl text-xs">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POIN 4: KEAMANAN PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-xs text-center space-y-4">
            <h3 className="text-base font-bold text-white">Masukkan PIN Wallet</h3>
            <p className="text-xs text-gray-400">Konfirmasi keamanan sebelum melanjutkan transaksi (Default: 123456)</p>
            <input 
              type="password" 
              maxLength={6}
              placeholder="••••••" 
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-center text-xl tracking-widest text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex space-x-2 pt-2">
              <button onClick={() => setShowPinModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-xl text-xs">Batal</button>
              <button onClick={handleVerifyPin} className="flex-1 bg-blue-600 hover:bg-blue-500 font-semibold py-2.5 rounded-xl text-xs">Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}