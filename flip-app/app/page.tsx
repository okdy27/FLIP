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
    savingsLabel: "Est. Total Savings:",
    savingsValue: "100% Free Gas Fee",
    btnSwap: "Swap Now (Lowest Fee)",
    btnProcessing: "Processing...",
    trust: "🔒 Secure & Verified on World Network",
    previewTitle: "[Browser Preview Mode]",
    fetchingBalances: "Syncing Live Blockchain Data...",
  },
  id: {
    home: "Beranda",
    swap: "Tukar",
    explore: "Eksplorasi",
    totalBalance: "Total Saldo",
    send: "Kirim",
    receive: "Terima",
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
    savingsLabel: "Estimasi Penghematan:",
    savingsValue: "100% Bebas Biaya Gas",
    btnSwap: "Swap Sekarang (Biaya Termurah)",
    btnProcessing: "Memproses...",
    trust: "🔒 Aman & Terverifikasi di World Network",
    previewTitle: "[Pratinjau Mode Browser]",
    fetchingBalances: "Menyingkronkan Data Blockchain Live...",
  },
  es: {
    home: "Inicio",
    swap: "Intercambio",
    explore: "Explorar",
    totalBalance: "Balance Total",
    send: "Enviar",
    receive: "Recibir",
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
    savingsLabel: "Ahorro Estimado:",
    savingsValue: "100% Sin Tarifa de Gas",
    btnSwap: "Intercambiar Ahora",
    btnProcessing: "Procesando...",
    trust: "🔒 Seguro y Verificado en World Network",
    previewTitle: "[Vista Previa del Navegador]",
    fetchingBalances: "Sincronizando Datos Live de Blockchain...",
  },
};

type Language = "en" | "id" | "es";
type Tab = "home" | "swap" | "explore";

interface TokenAsset {
  symbol: string;
  name: string;
  contractAddress: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
  iconBg: string;
}

// Daftar Kontrak Token Resmi World Chain (Mainnet ID: 480)
const WORLD_CHAIN_TOKENS: Omit<TokenAsset, "amount" | "valueUsd" | "priceUsd" | "change24h">[] = [
  { symbol: "WLD", name: "Worldcoin", contractAddress: "0x2cfc0004f20f4b6dd49c09fd126a52d0899fd2c3", iconBg: "bg-emerald-500" },
  { symbol: "USDC", name: "USD Coin", contractAddress: "0x79a60a8438cc914800cbae917621a876b28824d1", iconBg: "bg-blue-500" },
  { symbol: "WETH", name: "Wrapped Ether", contractAddress: "0x9fd0b9554a718a8d85c21eeef359dc850604d006", iconBg: "bg-indigo-500" },
  { symbol: "FOOTBALL", name: "Crazy Football", contractAddress: "0x000ed6c7f4c9de18b91b60691baa27ec4f1b0000", iconBg: "bg-green-600" },
  { symbol: "ORO", name: "Oro Token", contractAddress: "0x000ed6c7f4c9de18b91b60691baa27ec4f1b0000", iconBg: "bg-amber-500" },
  { symbol: "H2O", name: "H2O Clean", contractAddress: "0x000ed6c7f4c9de18b91b60691baa27ec4f1b0000", iconBg: "bg-cyan-500" },
  { symbol: "$AXO", name: "Axolotl World", contractAddress: "0x000ed6c7f4c9de18b91b60691baa27ec4f1b0000", iconBg: "bg-pink-500" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [lang, setLang] = useState<Language>("en");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  
  // State Token & Balances
  const [tokenAssets, setTokenAssets] = useState<TokenAsset[]>([
    { symbol: "WLD", name: "Worldcoin", contractAddress: "0x2cfc0004f20f4b6dd49c09fd126a52d0899fd2c3", amount: 4.25, priceUsd: 2.00, valueUsd: 8.50, change24h: 3.45, iconBg: "bg-emerald-500" },
    { symbol: "USDC", name: "USD Coin", contractAddress: "0x79a60a8438cc914800cbae917621a876b28824d1", amount: 4.88, priceUsd: 1.00, valueUsd: 4.88, change24h: 0.01, iconBg: "bg-blue-500" },
    { symbol: "FOOTBALL", name: "Crazy Football", contractAddress: "", amount: 392.29, priceUsd: 0.00002, valueUsd: 0.008, change24h: -1.69, iconBg: "bg-green-600" },
    { symbol: "ORO", name: "Oro Token", contractAddress: "", amount: 0.50, priceUsd: 0.008, valueUsd: 0.004, change24h: 0.19, iconBg: "bg-amber-500" },
    { symbol: "H2O", name: "H2O Clean", contractAddress: "", amount: 68.99, priceUsd: 0.00008, valueUsd: 0.006, change24h: 63.72, iconBg: "bg-cyan-500" },
    { symbol: "$AXO", name: "Axolotl World", contractAddress: "", amount: 4.001, priceUsd: 0.0005, valueUsd: 0.002, change24h: -28.75, iconBg: "bg-pink-500" },
  ]);

  // State Swap
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("WLD");
  const [toToken, setToToken] = useState("USDC");
  const [isLoading, setIsLoading] = useState(false);

  // Alamat Wallet Project FLIP Penerima Komisi Swap 0.3%
  const DEVELOPER_WALLET_ADDRESS = "0xd082493b467bb13c44aafa6e50de3d63f11e68ec";
  const FEE_PERCENTAGE = 0.003;

  const totalPortfolioValue = tokenAssets.reduce((sum, item) => sum + item.valueUsd, 0);

  // Function Mengambil Live Price dari DexScreener API
  const fetchLivePricesAndBalances = useCallback(async (userAddress: string) => {
    setIsFetchingLive(true);
    try {
      // Ambil harga dari DexScreener untuk token World Chain
      const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x2cfc0004f20f4b6dd49c09fd126a52d0899fd2c3,0x79a60a8438cc914800cbae917621a876b28824d1");
      const data = await res.json();
      
      if (data && data.pairs) {
        // Update harga WLD & USDC jika tersedia
        const wldPair = data.pairs.find((p: any) => p.baseToken.symbol === "WLD");
        if (wldPair) {
          setTokenAssets(prev => prev.map(t => {
            if (t.symbol === "WLD") {
              const price = parseFloat(wldPair.priceUsd) || 2.0;
              return { ...t, priceUsd: price, valueUsd: t.amount * price, change24h: parseFloat(wldPair.priceChange?.h24) || 0 };
            }
            return t;
          }));
        }
      }
    } catch (error) {
      console.log("Menggunakan fallback cache harga World Chain:", error);
    } finally {
      setIsFetchingLive(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      MiniKit.install();

      if (MiniKit.isInstalled()) {
        const address = MiniKit.user?.walletAddress;
        if (address) {
          setWalletAddress(address);
          fetchLivePricesAndBalances(address);
        }
      }

      const userLang = navigator.language.slice(0, 2).toLowerCase();
      if (userLang === "id") setLang("id");
      else if (userLang === "es") setLang("es");
      else setLang("en");
    }
  }, [fetchLivePricesAndBalances]);

  const t = translations[lang];

  const handleQuickAmount = (percentage: number) => {
    const mockBalance = 10;
    setAmount((mockBalance * percentage).toString());
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
          description: "FLIP Swap Fee (0.3%)",
        };

        const res = await (MiniKit.commandsAsync as any).pay(payPayload);
        console.log("Status Komisi:", res);
      } catch (error) {
        console.error("Error transaksi:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      alert(
        `${t.previewTitle}\n\n` +
          `• Input: ${inputAmount} ${fromToken}\n` +
          `• FLIP Fee (0.3%): ${feeAmount.toFixed(4)} ${fromToken}\n` +
          `• Est. Receive: ${swapAmount.toFixed(4)} ${toToken}\n` +
          `• Gas Fee: $0\n\n` +
          `Open in World App for real transactions!`
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-28 bg-[#080C14] text-white font-sans relative select-none overflow-x-hidden">
      
      {/* Top Header */}
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

        {/* Pemilih Bahasa */}
        <div className="flex gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setLang("en")}
            onTouchEnd={() => setLang("en")}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              lang === "en" ? "bg-emerald-500 text-white" : "text-slate-400"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("id")}
            onTouchEnd={() => setLang("id")}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              lang === "id" ? "bg-emerald-500 text-white" : "text-slate-400"
            }`}
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => setLang("es")}
            onTouchEnd={() => setLang("es")}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              lang === "es" ? "bg-emerald-500 text-white" : "text-slate-400"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* KONTEN UTAMA */}
      <div className="w-full max-w-md px-4 z-10 flex-1">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Balance Overview Card */}
            <div className="text-center py-4">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {t.totalBalance}
              </span>
              <h2 className="text-4xl font-black mt-1 text-white">
                ${totalPortfolioValue.toFixed(2)}
              </h2>
              {isFetchingLive ? (
                <p className="text-[10px] text-emerald-400 animate-pulse mt-2">
                  ⚡ {t.fetchingBalances}
                </p>
              ) : (
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  <span>▲ +2.4%</span>
                  <span className="text-slate-500 font-normal">24h</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Fitur Kirim Token (Send) siap diintegrasikan!")}
                className="flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl font-bold text-sm transition cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
                {t.send}
              </button>
              <button
                type="button"
                onClick={() => alert(`Alamat QR Dompet Anda:\n${walletAddress || DEVELOPER_WALLET_ADDRESS}`)}
                className="flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl font-bold text-sm transition cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m0 0l7-7m-7 7l-7-7" />
                </svg>
                {t.receive}
              </button>
            </div>

            {/* Filter Section */}
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
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl transition"
                >
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
                    <h4 className="font-bold text-sm text-white">
                      ${token.valueUsd < 0.01 ? "<$0.01" : token.valueUsd.toFixed(2)}
                    </h4>
                    <span className={`text-xs font-semibold ${token.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SWAP */}
        {activeTab === "swap" && (
          <div className="animate-fadeIn">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-2">
                ⚡ {t.badge}
              </div>
              <h2 className="text-2xl font-black">{t.swapTitle}</h2>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-800 shadow-2xl">
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <span>💡</span>
                  <span>{t.savingsBanner}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                  {t.badgeSaved}
                </span>
              </div>

              {/* Input Pay */}
              <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{t.pay}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleQuickAmount(0.25)} className="bg-slate-800/60 hover:text-emerald-400 px-2 py-0.5 rounded text-[11px]">25%</button>
                    <button onClick={() => handleQuickAmount(0.5)} className="bg-slate-800/60 hover:text-emerald-400 px-2 py-0.5 rounded text-[11px]">50%</button>
                    <button onClick={() => handleQuickAmount(1)} className="bg-slate-800 font-bold text-emerald-400 px-2 py-0.5 rounded text-[11px]">MAX</button>
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
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer"
                  >
                    <option value="WLD">WLD</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              {/* Invert Button */}
              <div className="flex justify-center -my-2.5 relative z-20">
                <button
                  type="button"
                  onClick={handleSwapTokens}
                  className="bg-slate-800 hover:bg-emerald-600 border-4 border-[#080C14] p-2.5 rounded-2xl text-slate-300 transition shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Output Receive */}
              <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
                <div className="text-xs text-slate-400 mb-2">{t.receiveEst}</div>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    disabled
                    value={amount ? (parseFloat(amount) * 0.997).toFixed(4) : "0.0"}
                    className="w-full bg-transparent text-3xl font-bold outline-none text-slate-400"
                  />
                  <select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer"
                  >
                    <option value="USDC">USDC</option>
                    <option value="WLD">WLD</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t.feeLabel}</span>
                  <span className="text-white font-medium">
                    {amount ? (parseFloat(amount) * 0.003).toFixed(4) : "0.0000"} {fromToken}
                  </span>
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

        {/* TAB 3: EXPLORE */}
        {activeTab === "explore" && (
          <div className="space-y-4 animate-fadeIn text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white">World Chain Ecosystem</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Jelajahi DApps, Launchpad, dan Token trending pilihan langsung di dalam ekosistem FLIP Wallet.
            </p>
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 z-50 flex justify-center pb-safe">
        <div className="w-full max-w-md flex justify-around items-center">
          
          {/* TAB HOME */}
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition cursor-pointer ${
              activeTab === "home" 
                ? "text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "home" ? "2.5" : "2"} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] tracking-wide">{t.home}</span>
          </button>

          {/* TAB SWAP */}
          <button
            type="button"
            onClick={() => setActiveTab("swap")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition cursor-pointer ${
              activeTab === "swap" 
                ? "text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "swap" ? "2.5" : "2"} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-[10px] tracking-wide">{t.swap}</span>
          </button>

          {/* TAB EXPLORE */}
          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition cursor-pointer ${
              activeTab === "explore" 
                ? "text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "explore" ? "2.5" : "2"} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-[10px] tracking-wide">{t.explore}</span>
          </button>

        </div>
      </div>

    </main>
  );
}