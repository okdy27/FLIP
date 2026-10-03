import './globals.css';
import MiniKitProvider from '@/Providers/minikit-provider';

export const metadata = {
  title: 'FLIP Dompet',
  description: 'World Chain Mini App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <MiniKitProvider>
          {children}
        </MiniKitProvider>
      </body>
    </html>
  );
}