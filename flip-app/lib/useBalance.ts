'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http, formatEther, formatUnits } from 'viem';

// Konfigurasi RPC World Chain Mainnet
const worldChainClient = createPublicClient({
  transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
});

// Masukkan alamat smart contract token ERC-20 (misal WLD atau SUSHI di World Chain)
// Jika belum ada contract address pasti, bisa diisi WLD Token Address World Chain: 0x2cfd12399a79f333a43423175ff24040203936aa
const SUSHI_TOKEN_ADDRESS = '0x2cfd12399a79f333a43423175ff24040203936aa'; 

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export function useWalletBalance(userAddress?: string) {
  const [ethBalance, setEthBalance] = useState<string>('0.00');
  const [sushiBalance, setSushiBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userAddress || userAddress === 'Not Connected') {
      setLoading(false);
      return;
    }

    async function fetchBalances() {
      setLoading(true);

      // 1. Fetch Native Balance (ETH)
      try {
        const rawEth = await worldChainClient.getBalance({
          address: userAddress as `0x${string}`,
        });
        setEthBalance(parseFloat(formatEther(rawEth)).toFixed(4));
      } catch (err) {
        console.error('Gagal mengambil saldo ETH:', err);
        setEthBalance('0.00');
      }

      // 2. Fetch ERC-20 Balance (diberi try-catch terpisah agar tidak bikin error aplikasi)
      try {
        if (SUSHI_TOKEN_ADDRESS && SUSHI_TOKEN_ADDRESS.startsWith('0x')) {
          const rawSushi = await worldChainClient.readContract({
            address: SUSHI_TOKEN_ADDRESS as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [userAddress as `0x${string}`],
          });
          setSushiBalance(parseFloat(formatUnits(rawSushi as bigint, 18)).toFixed(2));
        }
      } catch (err) {
        console.warn('Gagal/belum terkoneksi ke kontrak token ERC-20:', err);
        setSushiBalance('0.00');
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, [userAddress]);

  return { ethBalance, sushiBalance, loading };
}