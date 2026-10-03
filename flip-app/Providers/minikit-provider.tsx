'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Inisialisasi MiniKit SDK
      MiniKit.install();
      console.log('MiniKit successfully installed');
    } catch (error) {
      console.error('MiniKit installation failed:', error);
    }
  }, []);

  return <>{children}</>;
}