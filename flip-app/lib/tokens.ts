export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon: string;
}

export const WORLD_CHAIN_TOKENS: Token[] = [
  {
    symbol: 'WLD',
    name: 'Worldcoin',
    address: '0x2cfd12399a79f333a43423175ff24040203936aa', // Sesuaikan dengan contract WLD World Chain
    decimals: 18,
    icon: '🌐',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x79a60a8438cc914800cbae917621a876b28824d1', // Native / Bridged USDC di World Chain
    decimals: 6, // Catatan: USDC menggunakan 6 decimals
    icon: '💵',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x9fd0b9554a718a8d85c21eeef359dc850604d006',
    decimals: 18,
    icon: '🔷',
  },
];