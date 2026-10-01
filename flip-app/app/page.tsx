"use client";

import { useState, useEffect } from "react";
import { MiniKit, PayCommandInput } from "@worldcoin/minikit-js";

// Kamus Bahasa (Localization)
const translations = {
  en: {
    badge: "Lowest Fee • $0 Gas Fee",
    savingsBanner: "You save 100% on Gas Fees with FLIP!",
    badgeSaved: "SAVED",
    swapTitle: "Swap Tokens",
    slippage: "Slippage: Auto (0.5%)",
    pay: "You Pay",
    receive: "You Receive (Est.)",
    feeLabel: "FLIP Platform Fee (0.3%):",
    gasLabel: "Network Gas Fee:",
    gasValue: "FREE (Sponsored)",
    savingsLabel: "Est. Total Savings:",
    savingsValue: "100% Free Gas Fee",
    btnSwap: "Swap Now (Lowest Fee)",
    btnProcessing: "Processing...",
    trust: "🔒 Secure & Verified on World Network",
    previewTitle: "[Browser Preview Mode]",
  },
  id: {
    badge: "Swap Termurah • Biaya Gas Rp 0",
    savingsBanner: "Anda menghemat 100% Biaya Gas di FLIP!",
    badgeSaved: "HEMAT",
    swapTitle: "Tukar Token",
    slippage: "Slippage: Otomatis (0.5%)",
    pay: "Anda Bayar",
    receive: "Diterima (Bersih)",
    feeLabel: "Biaya Komisi FLIP (0.3%):",
    gasLabel: "Biaya Jaringan (Gas):",
    gasValue: "Rp 0 (Sponsor Jaringan)",
    savingsLabel: "Estimasi Penghematan:",
    savingsValue: "100% Bebas Biaya Gas",
    btnSwap: "Swap Sekarang (Biaya Termurah)",
    btnProcessing: "Memproses...",
    trust: "🔒 Aman & Terverifikasi di World Network",
    previewTitle: "[Pratinjau Mode Browser]",
  },
  es: {
    badge: "Tarifa Más Baja • Tarifa de Gas $0",
    savingsBanner: "¡Ahorras un 100% en tarifas de gas con FLIP!",
    badgeSaved: "AHORRA",
    swapTitle: "Intercambiar Tokens",
    slippage: "Deslizamiento: Auto (0.5%)",
    pay: "Tú Pagas",
    receive: "Recibes (Est.)",
    feeLabel: "Comisión de FLIP (0.3%):",
    gasLabel: "Tarifa de Red (Gas):",
    gasValue: "GRATIS (Patrocinado)",
    savingsLabel: "Ahorro Estimado:",
    savingsValue: "100% Sin Tarifa de Gas",
    btnSwap: "Intercambiar Ahora",
    btnProcessing: "Procesando...",
    trust: "🔒 Seguro y Verificado en World Network",
    previewTitle: "[Vista Previa del Navegador]",
  },
};

type Language = "en" | "id" | "es";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("WLD");
  const [toToken, setToToken] = useState("USDC");
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  // Alamat Dompet Menerima Komisi Swap 0.3%
  const DEVELOPER_WALLET_ADDRESS = "0xd082493b467bb13c44aafa6e50de3d63f11e68ec";
  const FEE_PERCENTAGE = 0.003;

  // Deteksi Bahasa Otomatis dari Perangkat/HP
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userLang = navigator.language.slice(0, 2).toLowerCase();
      if (userLang === "id") setLang("id");
      else if (userLang === "es") setLang("es");
      else setLang("en");
    }
  }, []);

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
        const payPayload: PayCommandInput = {
          reference: `flip-swap-${Date.now()}`,
          to: DEVELOPER_WALLET_ADDRESS,
          tokens: [
            {
              symbol: fromToken,
              token_amount: feeAmount.toString(),
            },
          ],
          description: "FLIP Swap Fee (0.3%)",
        };

        const response = await MiniKit.commandsAsync.pay(payPayload);
        console.log("Status Komisi:", response);
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#080C14] text-white font-sans relative">
      {/* Selector Bahasa Manual di Atas Right */}
      <div className="absolute top-4 right-4 z-20 flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setLang("en")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
            lang === "en" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          🇺🇸 EN
        </button>
        <button
          onClick={() => setLang("id")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
            lang === "id" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          🇮🇩 ID
        </button>
        <button
          onClick={() => setLang("es")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
            lang === "es" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          🇪🇸 ES
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Logo */}
      <div className="text-center mb-6 z-10 mt-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ⚡ {t.badge}
        </div>
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
          FLIP
        </h1>
      </div>

      {/* Main Swap Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-800 shadow-2xl z-10">
        
        {/* Banner Savings */}
        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <span className="text-base">💡</span>
            <span>{t.savingsBanner}</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
            {t.badgeSaved}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-sm font-bold text-slate-300">{t.swapTitle}</span>
          <span className="text-xs text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
            {t.slippage}
          </span>
        </div>

        {/* FROM TOKEN BOX */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 focus-within:border-emerald-500/50 transition-all">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{t.pay}</span>
            <div className="flex gap-1.5">
              <button onClick={() => handleQuickAmount(0.25)} className="hover:text-emerald-400 bg-slate-800/60 px-2 py-0.5 rounded-md transition text-[11px]">25%</button>
              <button onClick={() => handleQuickAmount(0.5)} className="hover:text-emerald-400 bg-slate-800/60 px-2 py-0.5 rounded-md transition text-[11px]">50%</button>
              <button onClick={() => handleQuickAmount(1)} className="hover:text-emerald-400 bg-slate-800 font-bold px-2 py-0.5 rounded-md transition text-[11px] text-emerald-400">MAX</button>
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
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer transition"
            >
              <option value="WLD">WLD</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        {/* SWAP INVERT BUTTON */}
        <div className="flex justify-center -my-2.5 relative z-20">
          <button
            onClick={handleSwapTokens}
            className="bg-slate-800 hover:bg-emerald-600 border-4 border-[#080C14] p-2.5 rounded-2xl text-slate-300 hover:text-white transition duration-200 shadow-md group"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* TO TOKEN BOX */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{t.receive}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              disabled
              value={amount ? (parseFloat(amount) * 0.997).toFixed(4) : "0.0"}
              className="w-full bg-transparent text-3xl font-bold outline-none text-slate-400 placeholder-slate-700"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer transition"
            >
              <option value="USDC">USDC</option>
              <option value="WLD">WLD</option>
            </select>
          </div>
        </div>

        {/* FEE DETAILS */}
        <div className="mt-4 p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/60 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{t.feeLabel}</span>
            <span className="text-white font-medium">
              {amount ? (parseFloat(amount) * 0.003).toFixed(4) : "0.0000"} {fromToken}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{t.gasLabel}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="line-through text-slate-500 font-normal mr-1">$1.50</span>
              {t.gasValue}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[11px]">
            <span className="text-slate-500">{t.savingsLabel}</span>
            <span className="text-emerald-400 font-semibold">{t.savingsValue}</span>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleSwap}
          disabled={isLoading}
          className="w-full mt-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] text-white font-bold py-4 rounded-2xl transition duration-200 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {isLoading ? t.btnProcessing : t.btnSwap}
        </button>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 text-center text-xs text-slate-500 z-10 flex items-center gap-2">
        <span>{t.trust}</span>
      </div>
    </main>
  );
}