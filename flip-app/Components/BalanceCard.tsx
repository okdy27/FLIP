'use client';

export type Language = 'id' | 'en' | 'es';

export interface BalanceCardProps {
  userAddress?: string;
  wldBalance?: string | number;
  usdcBalance?: string | number;
  btcBalance?: string | number;
  ethBalance?: string | number;
  sushiBalance?: string | number;
  isLoading?: boolean;
  lang?: Language;
  onSend?: () => void;
  onReceive?: () => void;
  onHistory?: () => void;
}

export default function BalanceCard({
  wldBalance = '12.50',
  usdcBalance = '25.00',
  btcBalance = '0.0012',
  isLoading = false,
  lang = 'en',
  onSend,
  onReceive,
  onHistory,
}: BalanceCardProps) {
  // Kamus Penerjemahan Komprehensif
  const labels = {
    id: {
      totalBalance: 'TOTAL SALDO',
      send: 'Kirim',
      receive: 'Terima',
      history: 'Riwayat',
      marketPrices: 'HARGA PASAR CRYPTO',
      liveUpdate: 'Langsung',
      loading: 'Memuat...',
    },
    en: {
      totalBalance: 'TOTAL BALANCE',
      send: 'Send',
      receive: 'Receive',
      history: 'History',
      marketPrices: 'CRYPTO MARKET PRICES',
      liveUpdate: 'Live Update',
      loading: 'Loading...',
    },
    es: {
      totalBalance: 'SALDO TOTAL',
      send: 'Enviar',
      receive: 'Recibir',
      history: 'Historial',
      marketPrices: 'PRECIOS DE MERCADO',
      liveUpdate: 'En Vivo',
      loading: 'Cargando...',
    },
  }[lang];

  const calculatedTotal = (
    Number(usdcBalance) +
    Number(wldBalance) * 2.15 +
    Number(btcBalance) * 64000
  ).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Tampilan Saldo Utama */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
          {labels.totalBalance}
        </span>

        <div className="text-4xl md:text-5xl font-black text-white tracking-tight my-1">
          {isLoading ? (
            <span className="text-slate-500 animate-pulse text-3xl">{labels.loading}</span>
          ) : (
            `$${calculatedTotal}`
          )}
        </div>

        <div className="mt-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span>▲ +2.4%</span>
          <span className="text-slate-400 text-[10px]">24h</span>
        </div>
      </div>

      {/* 3 Tombol Utama: Send, Receive, History */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onSend}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#101a23] border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#14222f] transition-all group active:scale-95 shadow-md"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            {labels.send}
          </span>
        </button>

        <button
          onClick={onReceive}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#101a23] border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#14222f] transition-all group active:scale-95 shadow-md"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            {labels.receive}
          </span>
        </button>

        <button
          onClick={onHistory}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#101a23] border border-slate-800/80 hover:border-amber-500/50 hover:bg-[#14222f] transition-all group active:scale-95 shadow-md"
        >
          <div className="w-11 h-11 rounded-full bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            {labels.history}
          </span>
        </button>
      </div>

      {/* Tampilan Harga Pasar WLD & BTC */}
      <div className="bg-[#101a23] border border-slate-800 rounded-2xl p-4 shadow-lg mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {labels.marketPrices}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {labels.liveUpdate}
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center bg-[#0b131a] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-white">
                WLD
              </div>
              <div>
                <div className="text-xs font-bold text-white">Worldcoin</div>
                <div className="text-[10px] text-slate-400">Rp 34.200</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">$2.15</div>
              <div className="text-[10px] text-emerald-400 font-semibold">+3.20%</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#0b131a] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xs">
                ₿
              </div>
              <div>
                <div className="text-xs font-bold text-white">Bitcoin</div>
                <div className="text-[10px] text-slate-400">Rp 1.025.000.000</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">$64,200</div>
              <div className="text-[10px] text-emerald-400 font-semibold">+1.45%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}