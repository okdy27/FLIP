'use client';

export type Language = 'id' | 'en' | 'es';

export interface WalletHeaderProps {
  userAddress?: string;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function WalletHeader({
  userAddress = '0xacad...bc40',
  currentLang = 'en',
  onLanguageChange,
}: WalletHeaderProps) {
  // Format pemotongan alamat wallet (misal: 0x1234...abcd)
  const formattedAddress =
    userAddress && userAddress.length > 10
      ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
      : userAddress;

  return (
    <header className="bg-[#0b131a] text-white px-4 py-3 sticky top-0 z-40 border-b border-slate-800/60">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {/* Identitas FLIP Wallet & Address */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b131a] rounded-full flex items-center justify-center font-black text-emerald-400 text-lg">
              F
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-wide">
              FLIP Wallet
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {formattedAddress}
            </p>
          </div>
        </div>

        {/* Switcher Bahasa: EN | ID | ES */}
        <div className="flex items-center bg-[#131d26] p-1 rounded-full border border-slate-800">
          {(['en', 'id', 'es'] as Language[]).map((lang) => {
            const isActive = currentLang === lang;
            return (
              <button
                key={lang}
                onClick={() => onLanguageChange && onLanguageChange(lang)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}