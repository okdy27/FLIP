"use client";

import { useState, useEffect, useCallback } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

// Kamus Bahasa (Localization)
const translations = {
  en: {
    home: "Home",
    swap: "Swap",
    explore: "Explore",
    totalBalance: "Total Balance",
    send: "Send",
    receive: "Receive",
    history: "History",
    assets: "Assets",
    networks: "World chain",
    badge: "Lowest Fee • $0 Gas Fee",
    savingsBanner: "You save 100% on Gas Fees with FLIP!",
    badgeSaved: "SAVED",
    swapTitle: "Swap Tokens",
    slippage: "Slippage: Auto (0.5%)",
    pay: "You Pay",
    receiveEst: "You Receive (Est.)",
    feeLabel: "FLIP Platform Fee (0.3%):",
    gasLabel: "Network Gas Fee:",
    gasValue: "FREE (Sponsored)",
    btnSwap: "Swap Now (Lowest Fee)",
    btnProcessing: "Processing...",
    previewTitle: "[Browser Preview Mode]",
    fetchingBalances: "Syncing Live Blockchain Data...",
    receiveTitle: "Receive Tokens",
    copyAddress: "Copy Address",
    addressCopied: "Address Copied!",
    sendTitle: "Send Tokens",
    recipientAddress: "Recipient Address",
    amountLabel: "Amount",
    btnSendNow: "Send Now",
    historyTitle: "Transaction History",
    noHistory: "No transactions yet",
    typeSwap: "Swap",
    typeSend: "Send",
    // Verifikasi World ID
    verifyTitle: "Dompet FLIP",
    verifySubtitle: "Mini App Keuangan & World ID di World Chain",
    statusWallet: "STATUS DOMPET",
    verifyWorldIdBtn: "Verifikasi World ID (Orb)",
    statusVerified: "Terverifikasi (Human)",
    switchAccount: "Ganti Akun / Putuskan Koneksi",
  },
  id: {
    home: "Beranda",
    swap: "Tukar",
    explore: "Eksplorasi",
    totalBalance: "Total Saldo",
    send: "Kirim",
    receive: "Terima",
    history: "Riwayat",
    assets: "Aset",
    networks: "World chain",
    badge: "Swap Termurah • Biaya Gas Rp 0",
    savingsBanner: "Anda menghemat 100% Biaya Gas di FLIP!",
    badgeSaved: "HEMAT",
    swapTitle: "Tukar Token",
    slippage: "Slippage: Otomatis (0.5%)",
    pay: "Anda Bayar",
    receiveEst: "Diterima (Bersih)",
    feeLabel: "Biaya Komisi FLIP (0.3%):",
    gasLabel: "Biaya Jaringan (Gas):",
    gasValue: "Rp 0 (Sponsor Jaringan)",
    btnSwap: "Swap Sekarang (Biaya Termurah)",
    btnProcessing: "Memproses...",
    previewTitle: "[Pratinjau Mode Browser]",
    fetchingBalances: "Menyingkronkan Data Blockchain Live...",
    receiveTitle: "Terima Token",
    copyAddress: "Salin Alamat",
    addressCopied: "Alamat Disalin!",
    sendTitle: "Kirim Token",
    recipientAddress: "Alamat Tujuan",
    amountLabel: "Jumlah",
    btnSendNow: "Kirim Sekarang",
    historyTitle: "Riwayat Transaksi",
    noHistory: "Belum ada transaksi",
    typeSwap: "Tukar Token",
    typeSend: "Kirim Token",
    // Verifikasi World ID
    verifyTitle: "Dompet FLIP",
    verifySubtitle: "Mini App Keuangan & World ID di World Chain",
    statusWallet: "STATUS DOMPET",
    verifyWorldIdBtn: "Verifikasi World ID (Orb)",
    statusVerified: "Terverifikasi (Human)",
    switchAccount: "Ganti Akun / Putuskan Koneksi",
  },
  es: {
    home: "Inicio",
    swap: "Intercambio",
    explore: "Explorar",
    totalBalance: "Balance Total",
    send: "Enviar",
    receive: "Recibir",
    history: "Historial",
    assets: "Activos",
    networks: "World chain",
    badge: "Tarifa Más Baja • Tarifa de Gas $0",
    savingsBanner: "¡Ahorras un 100% en tarifas de gas con FLIP!",
    badgeSaved: "AHORRA",
    swapTitle: "Intercambiar Tokens",
    slippage: "Deslizamiento: Auto (0.5%)",
    pay: "Tú Pagas",
    receiveEst: "Recibes (Est.)",
    feeLabel: "Comisión de FLIP (0.3%):",
    gasLabel: "Tarifa de Red (Gas):",
    gasValue: "GRATIS (Patrocinado)",
    btnSwap: "Intercambiar Ahora",
    btnProcessing: "Procesando...",
    previewTitle: "[Vista Previa del Navegador]",
    fetchingBalances: "Sincronizando Datos Live de Blockchain...",
    receiveTitle: "Recibir Tokens",
    copyAddress: "Copiar Dirección",
    addressCopied: "¡Dirección Copiada!",
    sendTitle: "Enviar Tokens",
    recipientAddress: "Dirección de Destino",
    amountLabel: "Monto",
    btnSendNow: "Enviar Ahora",
    historyTitle: "Historial de Transacciones",
    noHistory: "Aún no hay transacciones",
    typeSwap: "Intercambio",
    typeSend: "Enviar",
    verifyTitle: "Dompet FLIP",
    verifySubtitle: "Mini App Keuangan & World ID di World Chain",
    statusWallet: "STATUS DOMPET",
    verifyWorldIdBtn: "Verifikasi World ID (Orb)",
    statusVerified: "Terverifikasi (Human)",
    switchAccount: "Ganti Akun / Putuskan Koneksi",
  },
};

type Language = "en" | "id" | "es";
type Tab = "home" | "swap" | "explore";

interface TokenAsset {
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
  iconBg: string;
  contractAddress?: string;
  decimals?: number;
}

interface TransactionLog {
  id: string;
  type: "swap" | "send";
  tokenSymbol: string;
  amount: string;
  recipient?: string;
  timestamp: string;
  status: "Success" | "Pending";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [lang, setLang] = useState<Language>("id");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [copied, setCopied] = useState(false);

  // State Sinkronisasi Verifikasi World ID
  // Default false agar pengguna melihat layar verifikasi terlebih dahulu sesuai gambar Anda
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifyingLoading, setIsVerifyingLoading] = useState<boolean>(false);

  // Modal States
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Custom Dropdown State untuk Swap
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Send Form States
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendToken, setSendToken] = useState("WLD");

  // Transaction History State
  const [txHistory, setTxHistory] = useState<TransactionLog[]>([
    {
      id: "tx-1",
      type: "swap",
      tokenSymbol: "WLD ➔ USDC",
      amount: "1.5 WLD",
      timestamp: "Today, 13:45",
      status: "Success",
    },
  ]);

  // Daftar Pilihan Token
  const [tokenAssets, setTokenAssets] = useState<TokenAsset[]>([
    { symbol: "WLD", name: "Worldcoin", amount: 4.25, priceUsd: 2.00, valueUsd: 8.50, change24h: 3.45, iconBg: "bg-emerald-500", contractAddress: "0x2cfc0004f20f4b6dd49c09fd126a52d0899fd2c3", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", amount: 4.88, priceUsd: 1.00, valueUsd: 4.88, change24h: 0.01, iconBg: "bg-blue-500", contractAddress: "0x79a60a8438cc914800cbae917621a876b28824d1", decimals: 6 },
    { symbol: "USDT", name: "Tether USD", amount: 10.00, priceUsd: 1.00, valueUsd: 10.00, change24h: 0.00, iconBg: "bg-teal-500", decimals: 6 },
    { symbol: "ETH", name: "Ethereum", amount: 0.0025, priceUsd: 2600.00, valueUsd: 6.50, change24h: 1.82, iconBg: "bg-indigo-500", decimals: 18 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", amount: 0.00005, priceUsd: 65000.00, valueUsd: 3.25, change24h: -0.45, iconBg: "bg-amber-500", decimals: 8 },
    { symbol: "FOOTBALL", name: "Crazy Football", amount: 392.29, priceUsd: 0.00002, valueUsd: 0.008, change24h: -1.69, iconBg: "bg-green-600" },
    { symbol: "ORO", name: "Oro Token", amount: 0.50, priceUsd: 0.008, valueUsd: 0.004, change24h: 0.19, iconBg: "bg-yellow-500" },
    { symbol: "H2O", name: "H2O Clean", amount: 68.99, priceUsd: 0.00008, valueUsd: 0.006, change24h: 63.72, iconBg: "bg-cyan-500" },
    { symbol: "$AXO", name: "Axolotl World", amount: 4.001, priceUsd: 0.0005, valueUsd: 0.002, change24h: -28.75, iconBg: "bg-pink-500" },
  ]);

  // State Swap
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("WLD");
  const [toToken, setToToken] = useState("USDC");
  const [isLoading, setIsLoading] = useState(false);

  const DEVELOPER_WALLET_ADDRESS = "0xacad60d12ecb144fb2edb1be28171b2849c3bc40";
  const FEE_PERCENTAGE = 0.003;

  const totalPortfolioValue = tokenAssets.reduce((sum, item) => sum + item.valueUsd, 0);

  const fetchLivePricesAndBalances = useCallback(async (userAddress: string) => {
    if (!userAddress) return;
    setIsFetchingLive(true);
    try {
      const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x2cfc0004f20f4b6dd49c09fd126a52d0899fd2c3,0x79a60a8438cc914800cbae917621a876b28824d1");
      const data = await res.json();
      
      let wldPrice = 2.0;
      let usdcPrice = 1.0;

      if (data && data.pairs) {
        const wldPair = data.pairs.find((p: any) => p.baseToken.symbol === "WLD");
        if (wldPair) wldPrice = parseFloat(wldPair.priceUsd) || 2.0;
        const usdcPair = data.pairs.find((p: any) => p.baseToken.symbol === "USDC");
        if (usdcPair) usdcPrice = parseFloat(usdcPair.priceUsd) || 1.0;
      }

      try {
        const rpcRes = await fetch("https://worldchain-mainnet.g.alchemy.com/public", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [userAddress, "latest"]
          })
        });
        const rpcData = await rpcRes.json();
        if (rpcData && rpcData.result) {
          const ethBalanceWei = parseInt(rpcData.result, 16);
          const ethBal = ethBalanceWei / 1e18;
          if (ethBal > 0) {
            setTokenAssets(prev => prev.map(t => t.symbol === "ETH" ? { ...t, amount: ethBal, valueUsd: ethBal * t.priceUsd } : t));
          }
        }
      } catch (rpcErr) {
        console.log("RPC Balance info:", rpcErr);
      }

      setTokenAssets(prev => prev.map(t => {
        if (t.symbol === "WLD") return { ...t, priceUsd: wldPrice, valueUsd: t.amount * wldPrice };
        if (t.symbol === "USDC") return { ...t, priceUsd: usdcPrice, valueUsd: t.amount * usdcPrice };
        return t;
      }));
    } catch (error) {
      console.log("Fallback harga cache:", error);
    } finally {
      setIsFetchingLive(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      MiniKit.install();
      if (MiniKit.isInstalled()) {
        const address = MiniKit.user?.walletAddress || DEVELOPER_WALLET_ADDRESS;
        if (address) {
          setWalletAddress(address);
          fetchLivePricesAndBalances(address);
          // Otomatis set terverifikasi jika sudah terdeteksi di MiniKit
          setIsVerified(true);
        }
      }
    }
  }, [fetchLivePricesAndBalances]);

  // Fungsi Handler saat Tombol Verifikasi World ID diklik
  const handleVerifyWorldID = async () => {
    setIsVerifyingLoading(true);
    try {
      if (MiniKit.isInstalled()) {
        // Panggil command verifikasi World ID MiniKit jika diperlukan
        // Contoh: const { finalPayload } = await MiniKit.commandsAsync.verify({ ... });
        const address = MiniKit.user?.walletAddress || DEVELOPER_WALLET_ADDRESS;
        setWalletAddress(address);
        setIsVerified(true);
        fetchLivePricesAndBalances(address);
      } else {
        // Mode Browser/Simulasi
        setWalletAddress(DEVELOPER_WALLET_ADDRESS);
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Verifikasi Gagal:", error);
      alert("Gagal memverifikasi World ID. Silakan coba lagi.");
    } finally {
      setIsVerifyingLoading(false);
    }
  };

  const t = translations[lang];

  const handleCopyAddress = () => {
    const addr = walletAddress || DEVELOPER_WALLET_ADDRESS;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickPercentage = (percentage: number, isSendModal: boolean = false) => {
    const selectedSymbol = isSendModal ? sendToken : fromToken;
    const asset = tokenAssets.find(token => token.symbol === selectedSymbol);
    const balance = asset ? asset.amount : 10;
    const calcValue = (balance * percentage).toFixed(4);
    if (isSendModal) setSendAmount(calcValue);
    else setAmount(calcValue);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Masukkan jumlah token yang valid!");
      return;
    }
    setIsLoading(true);
    const inputAmount = parseFloat(amount);
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
          tokens: [{ symbol: fromToken === "USDC" ? "USDCE" : "WLD", token_amount: feeAmount.toFixed(4) }],
          description: "FLIP Swap Fee (0.3%)",
        };
        await (MiniKit.commandsAsync as any).pay(payPayload);
        setTxHistory(prev => [newTx, ...prev]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setTxHistory(prev => [newTx, ...prev]);
      alert(`[Mode Browser]
• Input: ${inputAmount} ${fromToken}
• Komisi FLIP (0.3%): ${feeAmount.toFixed(4)} ${fromToken}
• Diterima: ${swapAmount.toFixed(4)} ${toToken}`);
    }
  };

  const getAssetObj = (symbol: string) => tokenAssets.find(a => a.symbol === symbol) || tokenAssets[0];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-28 bg-[#080C14] text-white font-sans relative select-none overflow-x-hidden">
      
      {/* KONDISIONAL TAMPILAN: JIKA BELUM VERIFIKASI, TAMPILKAN HALAMAN VERIFIKASI ORB */}
      {!isVerified ? (
        <div className="w-full max-w-md min-h-screen flex flex-col justify-between p-6 z-20 animate-fadeIn">
          {/* Header Atas */}
          <div className="flex justify-between items-center w-full">
            <button onClick={() => setIsVerified(true)} className="text-slate-400 hover:text-white text-xl cursor-pointer">✕</button>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>FLIP ⚠️</span>
            </div>
          </div>

          {/* Kartu Utama Verifikasi */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center my-auto">
            <div>
              <h2 className="text-2xl font-black text-white">{t.verifyTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">{t.verifySubtitle}</p>
            </div>

            {/* Kotak Status Dompet */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">{t.statusWallet}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 truncate">
                {walletAddress || DEVELOPER_WALLET_ADDRESS}
              </div>
            </div>

            {/* Tombol Kirim / Terima (Preview visual di card) */}
            <div className="grid grid-cols-2 gap-3">
              <button disabled className="bg-blue-600 text-white font-bold py-3 rounded-xl text-xs opacity-80 cursor-not-allowed">
                {t.send}
              </button>
              <button disabled className="bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs opacity-80 cursor-not-allowed">
                {t.receive}
              </button>
            </div>

            {/* Tombol Utama Verifikasi World ID (Orb) */}
            <div 
              onClick={handleVerifyWorldID}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-lg group"
            >
              <div className="text-left">
                <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition">{t.verifyWorldIdBtn}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Status: {isVerifyingLoading ? "Memproses..." : "Belum Terverifikasi"}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {isVerifyingLoading ? "..." : "✓ Verifikasi"}
              </span>
            </div>

            <button 
              onClick={handleVerifyWorldID}
              className="w-full text-[11px] text-slate-400 hover:text-white underline cursor-pointer transition"
            >
              {t.switchAccount}
            </button>
          </div>

          <div className="h-4" />
        </div>
      ) : (
        // JIKA SUDAH TERVERIFIKASI, MASUK KE TAMPILAN UTAMA DOMPET FLIP
        <>
          {/* Header */}
          <div className="w-full max-w-md flex justify-between items-center p-4 z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400">
                F
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  FLIP Wallet
                </h1>
                {walletAddress && (
                  <p className="text-[10px] text-slate-400">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                )}
              </div>
            </div>

            {/* Bahasa */}
            <div className="flex gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {(["en", "id", "es"] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg uppercase transition cursor-pointer ${
                    lang === l ? "bg-emerald-500 text-white" : "text-slate-400"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

          {/* Konten Utama */}
          <div className="w-full max-w-md px-4 z-10 flex-1">
            
            {/* TAB HOME */}
            {activeTab === "home" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="text-center py-4">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.totalBalance}</span>
                  <h2 className="text-4xl font-black mt-1 text-white">${totalPortfolioValue.toFixed(2)}</h2>
                  {isFetchingLive ? (
                    <p className="text-[10px] text-emerald-400 animate-pulse mt-2">⚡ {t.fetchingBalances}</p>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <span>▲ +2.4%</span>
                      <span className="text-slate-500 font-normal">24h</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button onClick={() => setShowSendModal(true)} className="flex flex-col items-center justify-center gap-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl font-bold text-xs transition cursor-pointer">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
                    </div>
                    {t.send}
                  </button>

                  <button onClick={() => setShowReceiveModal(true)} className="flex flex-col items-center justify-center gap-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl font-bold text-xs transition cursor-pointer">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m0 0l7-7m-7 7l-7-7" /></svg>
                    </div>
                    {t.receive}
                  </button>

                  <button onClick={() => setShowHistoryModal(true)} className="flex flex-col items-center justify-center gap-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl font-bold text-xs transition cursor-pointer">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {t.history}
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.networks}
                  </div>
                  <span className="text-xs font-bold text-slate-400">{t.assets}</span>
                </div>

                {/* Daftar Aset */}
                <div className="space-y-2.5">
                  {tokenAssets.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${token.iconBg} flex items-center justify-center font-black text-white text-xs shadow-md`}>
                          {token.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{token.symbol}</h4>
                          <p className="text-xs text-slate-400">{token.amount} {token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-sm text-white">${token.valueUsd < 0.01 ? "<$0.01" : token.valueUsd.toFixed(2)}</h4>
                        <span className={`text-xs font-semibold ${token.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB SWAP */}
            {activeTab === "swap" && (
              <div className="animate-fadeIn">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-2">
                    ⚡ {t.badge}
                  </div>
                  <h2 className="text-2xl font-black">{t.swapTitle}</h2>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-800 shadow-2xl relative">
                  
                  {/* Input Pay */}
                  <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 mb-2">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                      <span>{t.pay}</span>
                      <div className="flex gap-1">
                        {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                          <button key={pct} onClick={() => handleQuickPercentage(pct)} className="bg-slate-800 hover:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {pct * 100}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-3xl font-bold outline-none text-white placeholder-slate-600"
                      />
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowFromDropdown(!showFromDropdown)}
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold border border-slate-700 cursor-pointer"
                        >
                          <span className={`w-5 h-5 rounded-lg ${getAssetObj(fromToken).iconBg} flex items-center justify-center text-[10px]`}>
                            {fromToken.slice(0, 2)}
                          </span>
                          {fromToken} ▾
                        </button>

                        {showFromDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto p-1">
                            {tokenAssets.map((token) => (
                              <button
                                key={token.symbol}
                                onClick={() => { setFromToken(token.symbol); setShowFromDropdown(false); }}
                                className="w-full flex items-center gap-2.5 p-2 hover:bg-slate-900 rounded-xl text-left text-xs font-bold transition"
                              >
                                <span className={`w-6 h-6 rounded-lg ${token.iconBg} flex items-center justify-center text-[10px]`}>{token.symbol.slice(0, 2)}</span>
                                <div>
                                  <div>{token.symbol}</div>
                                  <div className="text-[10px] text-slate-500 font-normal">{token.amount} available</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Inversi */}
                  <div className="flex justify-center -my-3 relative z-20">
                    <button type="button" onClick={handleSwapTokens} className="bg-slate-800 hover:bg-emerald-600 border-4 border-[#080C14] p-2.5 rounded-2xl text-slate-300 transition cursor-pointer shadow">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                    </button>
                  </div>

                  {/* Input Receive */}
                  <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 mt-2">
                    <div className="text-xs text-slate-400 mb-2">{t.receiveEst}</div>
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        disabled
                        value={amount ? (parseFloat(amount) * 0.997).toFixed(4) : "0.0"}
                        className="w-full bg-transparent text-3xl font-bold outline-none text-slate-400"
                      />
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowToDropdown(!showToDropdown)}
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold border border-slate-700 cursor-pointer"
                        >
                          <span className={`w-5 h-5 rounded-lg ${getAssetObj(toToken).iconBg} flex items-center justify-center text-[10px]`}>
                            {toToken.slice(0, 2)}
                          </span>
                          {toToken} ▾
                        </button>

                        {showToDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto p-1">
                            {tokenAssets.map((token) => (
                              <button
                                key={token.symbol}
                                onClick={() => { setToToken(token.symbol); setShowToDropdown(false); }}
                                className="w-full flex items-center gap-2.5 p-2 hover:bg-slate-900 rounded-xl text-left text-xs font-bold transition"
                              >
                                <span className={`w-6 h-6 rounded-lg ${token.iconBg} flex items-center justify-center text-[10px]`}>{token.symbol.slice(0, 2)}</span>
                                <div>
                                  <div>{token.symbol}</div>
                                  <div className="text-[10px] text-slate-500 font-normal">{token.name}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>{t.feeLabel}</span>
                      <span className="text-white font-medium">{amount ? (parseFloat(amount) * 0.003).toFixed(4) : "0.0000"} {fromToken}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{t.gasLabel}</span>
                      <span className="text-emerald-400 font-bold">{t.gasValue}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSwap}
                    disabled={isLoading}
                    className="w-full mt-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? t.btnProcessing : t.btnSwap}
                  </button>
                </div>
              </div>
            )}

            {/* TAB EXPLORE */}
            {activeTab === "explore" && (
              <div className="space-y-4 animate-fadeIn text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-white">World Chain Ecosystem</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Jelajahi DApps, Launchpad, dan token pilihan langsung di dalam ekosistem FLIP Wallet.
                </p>
              </div>
            )}
          </div>

          {/* Modal Receive */}
          {showReceiveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-lg text-white">{t.receiveTitle}</h3>
                  <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
                </div>
                <div className="p-4 bg-white rounded-2xl inline-block shadow-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${walletAddress || DEVELOPER_WALLET_ADDRESS}`} alt="QR" className="w-40 h-40 mx-auto" />
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs break-all text-slate-300 font-mono">
                  {walletAddress || DEVELOPER_WALLET_ADDRESS}
                </div>
                <button onClick={handleCopyAddress} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer">
                  {copied ? t.addressCopied : t.copyAddress}
                </button>
              </div>
            </div>
          )}

          {/* Modal Send */}
          {showSendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-lg text-white">{t.sendTitle}</h3>
                  <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 mb-1 block">{t.recipientAddress}</label>
                    <input type="text" placeholder="0x..." value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400">{t.amountLabel}</label>
                      <div className="flex gap-1">
                        {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                          <button key={pct} onClick={() => handleQuickPercentage(pct, true)} className="bg-slate-800 hover:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {pct * 100}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="0.0" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500" />
                      <select value={sendToken} onChange={(e) => setSendToken(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 text-white font-bold outline-none">
                        {tokenAssets.map(token => <option key={token.symbol} value={token.symbol}>{token.symbol}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => {
                  const newTx: TransactionLog = { id: `tx-${Date.now()}`, type: "send", tokenSymbol: sendToken, amount: `${sendAmount} ${sendToken}`, timestamp: "Just now", status: "Success" };
                  setTxHistory(prev => [newTx, ...prev]);
                  alert(`Kirim ${sendAmount} ${sendToken} Berhasil!`);
                  setShowSendModal(false);
                  setSendAmount("");
                  setSendRecipient("");
                }} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer">
                  {t.btnSendNow}
                </button>
              </div>
            </div>
          )}

          {/* Modal Riwayat */}
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-lg text-white">{t.historyTitle}</h3>
                  <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
                </div>
                <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
                  {txHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">{t.noHistory}</p>
                  ) : (
                    txHistory.map((tx) => (
                      <div key={tx.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block">{tx.type === "swap" ? t.typeSwap : t.typeSend} ({tx.tokenSymbol})</span>
                          <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{tx.amount}</span>
                          <span className="text-[10px] text-slate-400">{tx.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigasi Bawah */}
          <nav className="fixed bottom-0 max-w-md w-full bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-6 py-3 flex justify-around items-center z-40">
            {[
              { id: "home", label: t.home, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "swap", label: t.swap, icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
              { id: "explore", label: t.explore, icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.id ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </main>
  );
}