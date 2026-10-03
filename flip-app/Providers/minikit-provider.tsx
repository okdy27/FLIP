'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Memastikan MiniKit diinisialisasi dengan benar
    try {
      MiniKit.install();
    } catch (error) {
      console.error('Gagal menginstal MiniKit:', error);
    }
  }, []);

  return <>{children}</>;
}