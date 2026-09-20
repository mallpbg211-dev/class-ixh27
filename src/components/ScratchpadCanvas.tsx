import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Edit3,
  X,
  RotateCcw,
  RotateCw,
  Trash2,
  Check,
  AlertTriangle,
  Move,
  Minus,
  Sparkles,
  Eraser,
} from 'lucide-react';
import { soundManager } from '../lib/gameAudio';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  width: number;
  isEraser?: boolean;
  points: Point[];
}

const COLOR_PALETTE = [
  { name: 'Hitam', value: '#1F2937', label: 'bg-gray-800' },
  { name: 'Biru', value: '#1C5FE0', label: 'bg-[#1C5FE0]' },
  { name: 'Merah', value: '#DC2626', label: 'bg-red-600' },
  { name: 'Hijau', value: '#16A34A', label: 'bg-green-600' },
  { name: 'Oranye', value: '#EA580C', label: 'bg-orange-600' },
];

const PEN_WIDTHS = [
  { label: 'Tipis', value: 2.5 },
  { label: 'Sedang', value: 4.5 },
  { label: 'Tebal', value: 8 },
];

const STORAGE_FAB_KEY = 'ixh_scratchpad_fab_pos';

export const ScratchpadCanvas: React.FC = () => {
  // Mode buka/tutup canvas overlay
  const [isOpen, setIsOpen] = useState(false);

  // Drawing state
  const [color, setColor] = useState<string>('#1C5FE0');
  const [penWidth, setPenWidth] = useState<number>(4.5);
  const [isEraser, setIsEraser] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Riwayat goresan (global & persisten di memori selama session aplikasi)
  const strokesRef = useRef<Stroke[]>([]);
  const redoStrokesRef = useRef<Stroke[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0); // Trigger re-render UI tombol undo/redo

  // Canvas element & Context
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Posisi FAB (draggable)
  const [fabPos, setFabPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    // Default: kanan bawah (sekitar 24px dari kanan, 90px dari bawah)
    const initialX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 76) : 300;
    const initialY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - 150) : 500;
    return { x: initialX, y: initialY };
  });

  const isDraggingFabRef = useRef(false);
  const fabDragStartRef = useRef<{ startX: number; startY: number; initFabX: number; initFabY: number }>({
    startX: 0,
    startY: 0,
    initFabX: 0,
    initFabY: 0,
  });
  const hasMovedFabRef = useRef(false);

  // Simpan posisi FAB ke localStorage saat berubah
  const updateFabPos = useCallback((newPos: { x: number; y: number }) => {
    // Pastikan posisi tidak keluar batas layar
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const clampedX = Math.min(Math.max(12, newPos.x), winW - 68);
    const clampedY = Math.min(Math.max(12, newPos.y), winH - 68);
    const safePos = { x: clampedX, y: clampedY };
    setFabPos(safePos);
    try {
      localStorage.setItem(STORAGE_FAB_KEY, JSON.stringify(safePos));
    } catch {
      // ignore
    }
  }, []);

  // Redraw semua stroke ke canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = strokesRef.current;
    if (strokes.length === 0) return;

    ctx.save();
    // Device pixel ratio handling sudah diatur di canvas.width
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.width;

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      if (stroke.points.length === 1) {
        // Titik tunggal (dot)
        const pt = stroke.points[0];
        ctx.arc(pt.x, pt.y, stroke.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.isEraser ? 'rgba(0,0,0,1)' : stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = stroke.points[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }
    });

    ctx.restore();
  }, []);

  // Set ukuran canvas sesuai viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    redrawCanvas();
  }, [redrawCanvas]);

  // Efek resize listener
  useEffect(() => {
    if (!isOpen) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, [isOpen, resizeCanvas]);

  // Saat overlay dibuka, render ulang canvas
  useEffect(() => {
    if (isOpen) {
      // Tunggu tick berikutnya agar canvasRef sudah ter-mount
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    }
  }, [isOpen, resizeCanvas]);

  // --------------------------------------------------------------------------
  // POINTER EVENT HANDLERS FOR CANVAS DRAWING
  // --------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isOpen) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer agar stroke tetap halus walau pointer keluar sejenak
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    const newStroke: Stroke = {
      color,
      width: isEraser ? penWidth * 3 : penWidth,
      isEraser,
      points: [{ x, y }],
    };

    currentStrokeRef.current = newStroke;
    strokesRef.current.push(newStroke);
    // Hapus redo history saat ada goresan baru
    redoStrokesRef.current = [];

    // Gambar titik awal ke canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = newStroke.width;

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }

      ctx.arc(x, y, newStroke.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : color;
      ctx.fill();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const stroke = currentStrokeRef.current;
    const prevPoint = stroke.points[stroke.points.length - 1];
    stroke.points.push({ x, y });

    // Gambar segmen garis baru
    const ctx = canvas.getContext('2d');
    if (ctx && prevPoint) {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.width;

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setHistoryVersion((v) => v + 1);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // --------------------------------------------------------------------------
  // TOOLBAR ACTIONS: UNDO, REDO, CLEAR, CLOSE
  // --------------------------------------------------------------------------
  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    soundManager.playClick();
    const popped = strokesRef.current.pop();
    if (popped) {
      redoStrokesRef.current.push(popped);
    }
    redrawCanvas();
    setHistoryVersion((v) => v + 1);
  };

  const handleRedo = () => {
    if (redoStrokesRef.current.length === 0) return;
    soundManager.playClick();
    const restored = redoStrokesRef.current.pop();
    if (restored) {
      strokesRef.current.push(restored);
    }
    redrawCanvas();
    setHistoryVersion((v) => v + 1);
  };

  const handleClearAll = () => {
    soundManager.playClick();
    strokesRef.current = [];
    redoStrokesRef.current = [];
    setShowClearConfirm(false);
    redrawCanvas();
    setHistoryVersion((v) => v + 1);
  };

  const handleToggleOpen = () => {
    soundManager.playClick();
    setIsOpen((prev) => !prev);
  };

  // --------------------------------------------------------------------------
  // POINTER EVENTS FOR DRAGGING FAB BUTTON
  // --------------------------------------------------------------------------
  const handleFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingFabRef.current = true;
    hasMovedFabRef.current = false;
    fabDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initFabX: fabPos.x,
      initFabY: fabPos.y,
    };
  };

  const handleFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingFabRef.current) return;
    const dx = e.clientX - fabDragStartRef.current.startX;
    const dy = e.clientY - fabDragStartRef.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedFabRef.current = true;
    }

    const newX = fabDragStartRef.current.initFabX + dx;
    const newY = fabDragStartRef.current.initFabY + dy;
    updateFabPos({ x: newX, y: newY });
  };

  const handleFabPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingFabRef.current) return;
    isDraggingFabRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Jika tidak digeser (hanya tap/klik), buka canvas
    if (!hasMovedFabRef.current) {
      handleToggleOpen();
    }
  };

  return (
    <>
      {/* ---------------- FLOATING ACTION BUTTON (FAB) ---------------- */}
      {!isOpen && (
        <button
          type="button"
          onPointerDown={handleFabPointerDown}
          onPointerMove={handleFabPointerMove}
          onPointerUp={handleFabPointerUp}
          onPointerCancel={() => {
            isDraggingFabRef.current = false;
          }}
          style={{
            left: `${fabPos.x}px`,
            top: `${fabPos.y}px`,
            touchAction: 'none',
          }}
          className="fixed z-40 w-13 h-13 rounded-full bg-gradient-to-tr from-[#1C5FE0] via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-white/80 active:scale-95 cursor-grab active:cursor-grabbing select-none transition-transform hover:scale-105 group"
          title="Buka Papan Coret-Coretan (Seret untuk pindah posisi)"
        >
          <div className="relative">
            <Edit3 className="w-6 h-6 text-white transition-transform group-hover:rotate-6" />
            {strokesRef.current.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-amber-400 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
        </button>
      )}

      {/* ---------------- CANVAS OVERLAY & TOOLBAR ---------------- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col pointer-events-none select-none animate-fade-in">
          {/* Background overlay transparan sayup-sayup */}
          <div className="absolute inset-0 bg-slate-900/15 pointer-events-none" />

          {/* Native Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
            className="absolute inset-0 w-full h-full cursor-crosshair pointer-events-auto"
          />

          {/* Watermark Tipis di sudut bawah */}
          <div className="absolute bottom-3 left-4 text-[11px] font-heading font-bold text-gray-700/60 pointer-events-none drop-shadow-xs flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-xl backdrop-blur-xs border border-white/40">
            <Edit3 className="w-3.5 h-3.5 text-[#1C5FE0]" />
            <span>Papan Coretan Aktif • {strokesRef.current.length} Goresan</span>
          </div>

          {/* FLOATING TOP TOOLBAR */}
          <div className="relative z-50 p-2 sm:p-3 mx-auto mt-2 sm:mt-4 pointer-events-auto max-w-xl w-[94%]">
            <div className="neu-flat rounded-2xl sm:rounded-3xl bg-[#E7EBF5]/95 backdrop-blur-md border border-white/90 p-2.5 sm:p-3 shadow-2xl flex flex-wrap items-center justify-between gap-2">
              
              {/* Grup Kiri: Pilihan Warna */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {COLOR_PALETTE.map((c) => {
                  const isSelected = !isEraser && color === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setColor(c.value);
                        setIsEraser(false);
                      }}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'ring-3 ring-[#1C5FE0] ring-offset-2 scale-110 shadow-sm'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={`Warna ${c.name}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                    </button>
                  );
                })}

                {/* Penghapus (Eraser) */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setIsEraser((prev) => !prev);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-heading font-bold ${
                    isEraser
                      ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400 scale-105'
                      : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200 shadow-2xs'
                  }`}
                  title="Penghapus (Eraser)"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              {/* Grup Tengah: Ketebalan Pena */}
              <div className="flex items-center gap-1 bg-[#DFE5F2] p-1 rounded-xl border border-white/60">
                {PEN_WIDTHS.map((pw) => {
                  const isSelected = penWidth === pw.value;
                  return (
                    <button
                      key={pw.label}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setPenWidth(pw.value);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-heading font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C5FE0] text-white shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={`Ukuran ${pw.label}`}
                    >
                      {pw.label}
                    </button>
                  );
                })}
              </div>

              {/* Grup Kanan: Undo, Redo, Clear, Tutup */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Undo */}
                <button
                  type="button"
                  disabled={strokesRef.current.length === 0}
                  onClick={handleUndo}
                  className="p-1.5 sm:p-2 rounded-xl bg-white/80 hover:bg-white text-gray-700 disabled:opacity-40 disabled:hover:bg-white/80 border border-gray-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                  title="Undo (Hapus goresan terakhir)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Redo */}
                <button
                  type="button"
                  disabled={redoStrokesRef.current.length === 0}
                  onClick={handleRedo}
                  className="p-1.5 sm:p-2 rounded-xl bg-white/80 hover:bg-white text-gray-700 disabled:opacity-40 disabled:hover:bg-white/80 border border-gray-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                  title="Redo (Kembalikan goresan)"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Clear All */}
                <button
                  type="button"
                  disabled={strokesRef.current.length === 0}
                  onClick={() => {
                    soundManager.playClick();
                    setShowClearConfirm(true);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-40 disabled:hover:bg-rose-50 border border-rose-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                  title="Bersihkan Semua Coretan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-6 bg-gray-300 mx-0.5" />

                {/* Tombol Tutup / Sembunyikan */}
                <button
                  type="button"
                  onClick={handleToggleOpen}
                  className="px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-98"
                  title="Sembunyikan Papan (Gambar tetap tersimpan)"
                >
                  <Check className="w-4 h-4 text-emerald-100" />
                  <span className="hidden xs:inline">Selesai</span>
                </button>
              </div>
            </div>
          </div>

          {/* CONFIRMATION MODAL UNTUK CLEAR ALL */}
          {showClearConfirm && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs pointer-events-auto animate-fade-in">
              <div className="neu-flat rounded-3xl bg-[#E7EBF5] border border-white/90 p-5 max-w-sm w-full shadow-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-base text-[#1F3A5F]">
                    Bersihkan Seluruh Coretan?
                  </h4>
                  <p className="text-xs text-[#5C6F84] leading-relaxed">
                    Semua gambar dan coretan di layar akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-heading font-bold shadow-2xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-heading font-extrabold shadow-md cursor-pointer"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
