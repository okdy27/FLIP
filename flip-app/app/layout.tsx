import './globals.css';
import MiniKitProvider from '@/Providers/minikit-provider';

export const metadata = {
  title: 'FLIP Wallet',
  description: 'World Chain Mini App Wallet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MiniKitProvider>
          {children}
        </MiniKitProvider>
      </body>
    </html>
  );
}