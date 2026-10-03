'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Inisialisasi MiniKit SDK menggunakan App ID resmi dari Developer Portal
      MiniKit.install('app_912ee97b1ce0fef8dd0ff97a1c501804');
      console.log('MiniKit successfully installed with App ID');
    } catch (error) {
      console.error('MiniKit installation failed:', error);
    }
  }, []);

  return <>{children}</>;
}