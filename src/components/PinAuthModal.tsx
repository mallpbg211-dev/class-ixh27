import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, X } from 'lucide-react';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetRole: 'ADMIN' | 'BENDAHARA';
  title?: string;
  description?: string;
  adminPin?: string;
  kasPin?: string;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole,
  title,
  description,
  adminPin = '9090',
  kasPin = '1234',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const displayTitle =
    title ||
    (targetRole === 'ADMIN'
      ? 'Akses Master Admin'
      : 'Kunci Pengaman Uang Kas');

  const displayDesc =
    description ||
    (targetRole === 'ADMIN'
      ? 'Masukkan PIN Master Admin untuk mengakses panel pengaturan'
      : 'Masukkan PIN Bendahara untuk mengakses pembukuan kas');

  const isPinValid = (inputPin: string) => {
    if (targetRole === 'ADMIN') {
      return inputPin === adminPin;
    }
    return inputPin === kasPin || inputPin === adminPin;
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isPinValid(pin)) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('PIN yang dimasukkan salah.');
    }
  };

  const handleNumberClick = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (isPinValid(nextPin)) {
        setTimeout(() => {
          setPin('');
          setError('');
          onSuccess();
        }, 150);
      } else if (nextPin.length >= Math.max(adminPin.length, kasPin.length)) {
        setError('PIN yang dimasukkan salah.');
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const targetLength = targetRole === 'ADMIN' ? adminPin.length : kasPin.length;
  const numDots = Math.max(targetLength || 4, 4);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 shadow-2xl text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#5C6F84] active:scale-95 text-lg"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl mx-auto neu-flat flex items-center justify-center text-[#1C5FE0] mb-3">
            {targetRole === 'ADMIN' ? (
              <ShieldCheck className="w-7 h-7 text-amber-500" />
            ) : (
              <Lock className="w-7 h-7 text-[#1C5FE0]" />
            )}
          </div>

          <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
            {displayTitle}
          </h3>
          <p className="text-xs text-[#5C6F84] mt-1 leading-relaxed px-2">
            {displayDesc}
          </p>

          {/* PIN Dots display */}
          <div className="flex items-center justify-center gap-3 my-4">
            {Array.from({ length: numDots }).map((_, idx) => {
              const isFilled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all ${
                    isFilled
                      ? 'bg-[#1C5FE0] scale-110 shadow-sm'
                      : 'neu-inset bg-[#DDE3F0]'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-500 font-semibold mb-3 flex items-center justify-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Numeric Keypad for fast touch on phones */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <motion.button
                key={digit}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNumberClick(digit)}
                className="neu-btn h-12 rounded-2xl font-heading font-bold text-base text-[#1F3A5F] active:scale-95"
              >
                {digit}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleClear}
              className="neu-btn h-12 rounded-2xl font-heading font-bold text-xs text-[#5C6F84] active:scale-95"
            >
              Reset
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleNumberClick('0')}
              className="neu-btn h-12 rounded-2xl font-heading font-bold text-base text-[#1F3A5F] active:scale-95"
            >
              0
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleBackspace}
              className="neu-btn h-12 rounded-2xl font-heading font-bold text-sm text-[#EF4444] active:scale-95"
            >
              &larr;
            </motion.button>
          </div>

          <button
            type="button"
            onClick={() => handleVerify()}
            className="w-full max-w-[240px] mx-auto py-2.5 rounded-2xl bg-[#1C5FE0] text-white font-heading font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Verifikasi PIN
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
