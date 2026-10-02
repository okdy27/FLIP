import './globals.css';
import MiniKitProvider from './minikit-provider'; // Sesuaikan path jika perlu

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-white min-h-screen">
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}