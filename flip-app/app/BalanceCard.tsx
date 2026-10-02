'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { worldchain } from 'viem/chains';

// Public RPC Client untuk World Chain Mainnet
const publicClient = createPublicClient({
  chain: worldchain,
  transport: http('https://rpc.worldchain.org'),
});

// Alamat Kontrak Token WLD di World Chain
const WLD_CONTRACT = '0x2cf8bf4ded589b166eeee1066c6293202b1c4002';

// Minimal ABI untuk membaca saldo ERC-20
const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

interface BalanceCardProps {
  address: string | null;
}

export default function BalanceCard({ address }: BalanceCardProps) {
  const [ethBalance, setEthBalance] = useState<string>('0.00');
  const [wldBalance, setWldBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBalances = useCallback(async () => {
    if (!address || !address.startsWith('0x')) return;

    setIsLoading(true);
    try {
      // 1. Ambil Saldo Native ETH
      const rawEth = await publicClient.getBalance({
        address: address as `0x${string}`,
      });
      setEthBalance(Number(formatEther(rawEth)).toFixed(4));

      // 2. Ambil Saldo Token WLD
      const rawWld = await publicClient.readContract({
        address: WLD_CONTRACT as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });
      setWldBalance(Number(formatEther(rawWld as bigint)).toFixed(2));
    } catch (error) {
      console.error('Gagal mengambil saldo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (!address) {
    return (
      <div className="p-6 my-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
        <p className="text-xs text-slate-400">Hubungkan dompet World ID Anda untuk melihat saldo aset.</p>
      </div>
    );
  }

  return (
    <div className="p-5 my-4 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-2xl shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Aset Dompet</span>
        <button
          onClick={fetchBalances}
          disabled={isLoading}
          className="text-[11px] text-slate-400 hover:text-emerald-300 transition-colors"
        >
          {isLoading ? 'Memuat...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Kartu WLD */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-400 font-medium">Worldcoin (WLD)</p>
          <p className="text-lg font-bold text-white mt-1">
            {wldBalance} <span className="text-xs font-normal text-emerald-400">WLD</span>
          </p>
        </div>

        {/* Kartu ETH */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-400 font-medium">Ether (ETH)</p>
          <p className="text-lg font-bold text-white mt-1">
            {ethBalance} <span className="text-xs font-normal text-emerald-400">ETH</span>
          </p>
        </div>
      </div>
    </div>
  );
}