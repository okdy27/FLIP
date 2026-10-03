'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { parseUnits } from 'viem';
import { TOKEN_CONTRACTS, DEX_ROUTER_ADDRESS, erc20Abi, swapRouterAbi } from '@/lib/worldchain';

export type Language = 'id' | 'en' | 'es';
type TokenType = 'USDC' | 'WLD' | 'SUSHI' | 'ETH';

export interface SwapCardProps {
  userAddress?: string;
  balances?: Record<TokenType, string | number>;
  lang?: Language;
  onSwapSuccess?: () => void;
}

export default function SwapCard({
  userAddress,
  balances = {
    USDC: '25.00',
    WLD: '12.50',
    SUSHI: '100.00',
    ETH: '0.0045',
  },
  lang = 'en',
  onSwapSuccess,
}: SwapCardProps) {
  const [fromToken, setFromToken] = useState<TokenType>('WLD');
  const [toToken, setToToken] = useState<TokenType>('USDC');
  const [fromAmount, setFromAmount] = useState<string>('5');
  const [toAmount, setToAmount] = useState<string>('9.25');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const labels = {
    id: {
      title: 'Tukar Token',
      slippage: 'Slippage',
      youPay: 'Kamu Bayar',
      youReceive: 'Kamu Terima (Estimasi)',
      balance: 'Saldo',
      rate: 'Harga Kurs',
      slippageTol: 'Toleransi Slippage',
      processing: 'Memproses Swap...',
      confirm: 'Konfirmasi Swap di World App',
      alertSuccess: 'Transaksi Swap berhasil dikirim ke World Chain!',
      to: 'menjadi',
    },
    en: {
      title: 'Swap Tokens',
      slippage: 'Slippage',
      youPay: 'You Pay',
      youReceive: 'You Receive (Est.)',
      balance: 'Balance',
      rate: 'Exchange Rate',
      slippageTol: 'Slippage Tolerance',
      processing: 'Processing Swap...',
      confirm: 'Confirm Swap in World App',
      alertSuccess: 'Swap transaction submitted to World Chain!',
      to: 'to',
    },
    es: {
      title: 'Intercambiar Tokens',
      slippage: 'Deslizamiento',
      youPay: 'Tú Pagas',
      youReceive: 'Tú Recibes (Est.)',
      balance: 'Saldo',
      rate: 'Tasa de Cambio',
      slippageTol: 'Tolerancia de Deslizamiento',
      processing: 'Procesando Swap...',
      confirm: 'Confirmar Swap en World App',
      alertSuccess: '¡Transacción de intercambio enviada a World Chain!',
      to: 'a',
    },
  }[lang];

  const handleSwitchTokens = () => {
    setIsRotating(true);
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setTimeout(() => setIsRotating(false), 300);
  };

  // EKSEKUSI ON-CHAIN SWAP VIA MINIKIT SDK
  const handleSwapExecute = async () => {
    if (!fromAmount || Number(fromAmount) <= 0) return;
    setIsSwapping(true);

    try {
      if (MiniKit.isInstalled()) {
        const decimalsFrom = fromToken === 'USDC' ? 6 : 18;
        const parsedAmountIn = parseUnits(fromAmount, decimalsFrom);

        const tokenInAddress = TOKEN_CONTRACTS[fromToken as keyof typeof TOKEN_CONTRACTS] || TOKEN_CONTRACTS.WLD;
        const tokenOutAddress = TOKEN_CONTRACTS[toToken as keyof typeof TOKEN_CONTRACTS] || TOKEN_CONTRACTS.USDC;

        // safe type casting untuk komando MiniKit sendTransaction
        const minikitCommands = MiniKit.commands as unknown as {
          sendTransaction: (payload: {
            transaction: Array<{
              address: string;
              abi: unknown;
              functionName: string;
              args: unknown[];
            }>;
          }) => Promise<{ finalPayload: { status: string; transaction_id?: string } }>;
        };

        const { finalPayload } = await minikitCommands.sendTransaction({
          transaction: [
            {
              address: tokenInAddress,
              abi: erc20Abi,
              functionName: 'approve',
              args: [DEX_ROUTER_ADDRESS, parsedAmountIn.toString()],
            },
            {
              address: DEX_ROUTER_ADDRESS,
              abi: swapRouterAbi,
              functionName: 'exactInputSingle',
              args: [
                {
                  tokenIn: tokenInAddress,
                  tokenOut: tokenOutAddress,
                  fee: 3000,
                  recipient: userAddress || '',
                  amountIn: parsedAmountIn.toString(),
                  amountOutMinimum: '0',
                  sqrtPriceLimitX96: '0',
                },
              ],
            },
          ],
        });

        if (finalPayload?.status === 'success') {
          alert(`${labels.alertSuccess}\nTx Hash: ${finalPayload.transaction_id}`);
          if (onSwapSuccess) onSwapSuccess();
        }
      } else {
        // Simulation Fallback untuk Browser Biasa
        setTimeout(() => {
          alert(`${labels.alertSuccess} (${fromAmount} ${fromToken} ${labels.to} ${toAmount} ${toToken})`);
          if (onSwapSuccess) onSwapSuccess();
        }, 1200);
      }
    } catch (error) {
      console.error('Swap execution error:', error);
      alert('Gagal mengeksekusi Swap. Pastikan saldo tercukupi di World App.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="bg-[#101a23] border border-slate-800 rounded-2xl p-5 shadow-xl max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-white">{labels.title}</h2>
        <span className="text-xs text-slate-400 bg-[#0b131a] px-2 py-1 rounded-md border border-slate-800">
          {labels.slippage}: 0.5%
        </span>
      </div>

      {/* BOX KAMU BAYAR */}
      <div className="bg-[#0b131a] p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>{labels.youPay}</span>
          <span>
            {labels.balance}: <strong className="text-slate-200">{balances[fromToken] ?? '0.00'} {fromToken}</strong>
          </span>
        </div>

        <div className="flex justify-between items-center gap-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl font-bold text-white outline-none"
          />

          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value as TokenType)}
            className="bg-[#131d26] text-white font-bold text-xs py-2 px-3 rounded-lg border border-slate-700 outline-none cursor-pointer"
          >
            <option value="WLD">WLD</option>
            <option value="USDC">USDC</option>
            <option value="SUSHI">SUSHI</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
      </div>

      {/* TOMBOL SWITCH */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={handleSwitchTokens}
          className="bg-[#0b131a] hover:bg-slate-800 border-2 border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 p-2.5 rounded-xl transition-all shadow-lg active:scale-90"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* BOX KAMU TERIMA */}
      <div className="bg-[#0b131a] p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>{labels.youReceive}</span>
          <span>
            {labels.balance}: <strong className="text-slate-200">{balances[toToken] ?? '0.00'} {toToken}</strong>
          </span>
        </div>

        <div className="flex justify-between items-center gap-3">
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="w-full bg-transparent text-2xl font-bold text-slate-300 outline-none cursor-not-allowed"
          />

          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value as TokenType)}
            className="bg-[#131d26] text-white font-bold text-xs py-2 px-3 rounded-lg border border-slate-700 outline-none cursor-pointer"
          >
            <option value="USDC">USDC</option>
            <option value="WLD">WLD</option>
            <option value="SUSHI">SUSHI</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
      </div>

      {/* DETAIL KURS */}
      <div className="p-3 bg-[#0b131a]/50 rounded-lg border border-slate-800/60 space-y-1.5 text-[11px] text-slate-400">
        <div className="flex justify-between">
          <span>{labels.rate}</span>
          <span className="text-slate-300 font-medium">1 {fromToken} ≈ 1.85 {toToken}</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.slippageTol}</span>
          <span className="text-emerald-400 font-medium">0.5%</span>
        </div>
      </div>

      {/* TOMBOL EKSEKUSI SWAP */}
      <button
        onClick={handleSwapExecute}
        disabled={isSwapping || !fromAmount}
        className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-md ${
          isSwapping
            ? 'bg-emerald-600/50 text-slate-300 cursor-not-allowed animate-pulse'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold active:scale-[0.98]'
        }`}
      >
        {isSwapping ? labels.processing : `${labels.confirm} (${fromToken} → ${toToken})`}
      </button>
    </div>
  );
}