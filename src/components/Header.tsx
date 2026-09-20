import React, { useState } from 'react';
import { Bell, ShieldCheck, UserCheck, Sparkles, CheckCircle2, AlertCircle, Cloud, HardDrive } from 'lucide-react';
import { UserRole } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNotifications: () => void;
  onOpenAdmin?: () => void;
  unreadCount?: number;
  isFirebaseLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenNotifications,
  onOpenAdmin,
  unreadCount = 2,
  isFirebaseLive = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E7EBF5] border-b border-white/70 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand App Name: "IX-H Hub" in Poppins Font */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl neu-flat flex items-center justify-center text-[#1C5FE0] font-heading font-extrabold text-base sm:text-lg flex-shrink-0">
            9H
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-heading font-bold text-lg sm:text-xl tracking-tight text-[#1F3A5F] leading-tight truncate">
                IX-H Hub
              </h1>
              <span className="text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0] flex-shrink-0">
                SMPN 1
              </span>
              {/* Firebase status indicator */}
              <div
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold ${
                  isFirebaseLive
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-[#5C6F84] border border-[#C4CAE0]/40'
                }`}
                title={
                  isFirebaseLive
                    ? 'Firebase Firestore Realtime Aktif'
                    : 'Data tersimpan lokal'
                }
              >
                {isFirebaseLive ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3 h-3 text-[#5C6F84]" />
                    <span>Lokal</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-[#5C6F84] font-medium truncate leading-normal">
              Kompak &bull; Berprestasi &bull; Berkelas
            </p>
          </div>
        </div>

        {/* Right Actions: PWA Install, Admin Button, Role Switcher & Neumorphic Notification Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* PWA Install Button (shows when installable on mobile/desktop) */}
          <PWAInstallButton />

          {/* Dedicated Admin Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1 text-[11px] sm:text-xs font-heading font-bold transition-all active:scale-95 ${
                currentRole === 'ADMIN'
                  ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md ring-2 ring-[#1C5FE0]/30'
                  : 'neu-btn text-[#1F3A5F] hover:text-[#1C5FE0]'
              }`}
              title="Buka Panel Master Admin Kelas"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === 'ADMIN' ? 'text-amber-300' : 'text-[#1C5FE0]'}`} />
              <span>Admin</span>
            </button>
          )}

          {/* Quick Role Toggle Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="neu-btn px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#1F3A5F] active:scale-95"
              title="Ganti peran pengguna untuk mencoba fitur"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#1C5FE0]" />
              <span className="hidden md:inline">{currentRole}</span>
            </button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl neu-flat-lg p-2 z-40 bg-[#E7EBF5] border border-white/60 shadow-xl">
                <div className="text-[10px] font-heading font-extrabold text-[#5C6F84] px-3 py-1 uppercase tracking-wider">
                  Pilih Peran Akses
                </div>
                {(['SISWA', 'BENDAHARA', 'ADMIN'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleMenu(false);
                      if (role === 'ADMIN' && onOpenAdmin) {
                        onOpenAdmin();
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentRole === role
                        ? 'bg-[#1C5FE0] text-white'
                        : 'text-[#1F3A5F] hover:bg-[#DDE3F0]'
                    }`}
                  >
                    <span>
                      {role === 'SISWA'
                        ? 'Siswa (Read-Only)'
                        : role === 'BENDAHARA'
                        ? 'Bendahara (Input Kas)'
                        : 'Admin Kelas (Penuh)'}
                    </span>
                    {currentRole === role && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Circular Neumorphic Notification Button as requested in Teks 2 */}
          <button
            onClick={onOpenNotifications}
            id="notification-bell-btn"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] relative active:scale-90"
            aria-label="Buka Notifikasi & Pengumuman"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1F3A5F]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#EF4444] text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
