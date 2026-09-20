import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA / APK, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="neu-btn px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] sm:text-xs font-heading font-bold text-[#1C5FE0] bg-blue-50/50 hover:bg-blue-100/50 active:scale-95 transition-all shadow-sm"
        title="Pasang aplikasi IX-H Hub di HP kamu"
      >
        <Download className="w-3.5 h-3.5 text-[#1C5FE0] animate-bounce" />
        <span className="hidden sm:inline">Install APK / App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="neu-btn px-2.5 py-1.5 rounded-full flex items-center gap-1 text-[11px] font-heading font-semibold text-[#1F3A5F] active:scale-95"
          title="Pasang di iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#1C5FE0]" />
          <span className="hidden sm:inline">Pasang di iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-[#E7EBF5] p-6 neu-flat-lg border border-white shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full neu-btn text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-heading font-extrabold text-[#1F3A5F]">
                Pasang di iPhone / iPad
              </h3>
              <p className="mt-3 text-xs text-[#5C6F84] leading-relaxed">
                1. Buka halaman ini di browser <strong>Safari</strong>.<br />
                2. Ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah.<br />
                3. Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#1C5FE0] text-white font-heading font-bold text-xs shadow-md active:scale-95"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
