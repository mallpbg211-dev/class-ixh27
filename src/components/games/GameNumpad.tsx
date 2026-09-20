import React from 'react';
import { Delete, Check } from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface GameNumpadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  allowNegative?: boolean;
  disabled?: boolean;
}

export const GameNumpad: React.FC<GameNumpadProps> = ({
  value,
  onChange,
  onSubmit,
  allowNegative = true,
  disabled = false,
}) => {
  const handleDigit = (digit: string) => {
    if (disabled) return;
    soundManager.playClick();
    if (value.length < 8) {
      onChange(value + digit);
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    soundManager.playClick();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    soundManager.playClick();
    onChange('');
  };

  const handleToggleNegative = () => {
    if (disabled || !allowNegative) return;
    soundManager.playClick();
    if (value.startsWith('-')) {
      onChange(value.slice(1));
    } else {
      onChange('-' + value);
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(String(num))}
            className="h-13 sm:h-14 rounded-2xl bg-[#131C2E] hover:bg-[#1C2840] active:scale-95 text-white font-heading font-extrabold text-2xl border border-slate-700/80 shadow-md transition-all flex items-center justify-center cursor-pointer select-none"
          >
            {num}
          </button>
        ))}

        {allowNegative ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleToggleNegative}
            className="h-13 sm:h-14 rounded-2xl bg-[#1A2338] hover:bg-[#23304E] active:scale-95 text-slate-300 font-heading font-bold text-lg border border-slate-700/60 shadow transition-all flex items-center justify-center cursor-pointer select-none"
          >
            ± / -
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="h-13 sm:h-14 rounded-2xl bg-[#1A2338] hover:bg-[#23304E] active:scale-95 text-rose-400 font-heading font-bold text-xs uppercase border border-slate-700/60 shadow transition-all flex items-center justify-center cursor-pointer select-none"
          >
            Hapus
          </button>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="h-13 sm:h-14 rounded-2xl bg-[#131C2E] hover:bg-[#1C2840] active:scale-95 text-white font-heading font-extrabold text-2xl border border-slate-700/80 shadow-md transition-all flex items-center justify-center cursor-pointer select-none"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleBackspace}
          className="h-13 sm:h-14 rounded-2xl bg-[#1A2338] hover:bg-[#23304E] active:scale-95 text-slate-300 border border-slate-700/60 shadow transition-all flex items-center justify-center cursor-pointer select-none"
        >
          <Delete className="w-6 h-6 text-slate-300" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled || value.trim() === '' || value === '-'}
        onClick={onSubmit}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 disabled:opacity-40 disabled:pointer-events-none text-white font-heading font-extrabold text-base tracking-wide shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
      >
        <Check className="w-5 h-5 stroke-[3]" />
        <span>Kirim Jawaban</span>
      </button>
    </div>
  );
};
