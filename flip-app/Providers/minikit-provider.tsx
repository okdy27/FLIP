'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Inisialisasi MiniKit dengan App ID resmi
      MiniKit.install('app_912ee97b1ce0fef8dd0ff97a1c501804');
      console.log('MiniKit installed successfully');
    } catch (error) {
      console.error('MiniKit installation error:', error);
    }
  }, []);

  return <>{children}</>;
}