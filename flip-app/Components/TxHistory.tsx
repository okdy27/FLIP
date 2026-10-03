'use client';

export type Language = 'id' | 'en' | 'es';

export interface TransactionItem {
  id: string;
  type: 'SWAP' | 'SEND' | 'RECEIVE';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  txHash: string;
}

export interface TxHistoryProps {
  transactions?: TransactionItem[];
  lang?: Language;
  onClearHistory?: () => void;
}

export default function TxHistory({
  transactions = [],
  lang = 'en',
  onClearHistory,
}: TxHistoryProps) {
  const labels = {
    id: {
      title: 'Riwayat Transaksi',
      clear: 'Hapus Semua',
      empty: 'Belum ada riwayat transaksi.',
      justNow: 'Baru saja',
      success: 'Sukses',
    },
    en: {
      title: 'Transaction History',
      clear: 'Clear All',
      empty: 'No transaction history yet.',
      justNow: 'Just now',
      success: 'Success',
    },
    es: {
      title: 'Historial de Transacciones',
      clear: 'Borrar Todo',
      empty: 'Aún no hay historial de transacciones.',
      justNow: 'Justo ahora',
      success: 'Éxito',
    },
  }[lang];

  return (
    <div className="bg-[#101a23] border border-slate-800 rounded-2xl p-5 shadow-xl max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white">{labels.title}</h3>
        {transactions.length > 0 && onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            {labels.clear}
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#0b131a] p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🔄
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    Swap {tx.fromToken} → {tx.toToken}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {tx.timestamp === 'Baru saja' ? labels.justNow : tx.timestamp}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-slate-200">
                  -{tx.fromAmount} / +{tx.toAmount}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  {labels.success}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}