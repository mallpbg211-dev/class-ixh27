import React, { useState } from 'react';
import {
  TrendingUp,
  History,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Eye,
  X,
} from 'lucide-react';
import { TryOutHistoryRecord, ChapterEvaluation } from './tkaTypes';
import { soundManager } from '../../lib/gameAudio';

interface RiwayatProgressViewProps {
  history: TryOutHistoryRecord[];
  onStartNewTryOut: () => void;
}

export const RiwayatProgressView: React.FC<RiwayatProgressViewProps> = ({
  history,
  onStartNewTryOut,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<TryOutHistoryRecord | null>(null);

  // Statistics calculation
  const totalAttempts = history.length;
  const highestScore = totalAttempts > 0 ? Math.max(...history.map((h) => h.totalScore1000)) : 0;
  const averageScore =
    totalAttempts > 0
      ? Math.round(history.reduce((a, b) => a + b.totalScore1000, 0) / totalAttempts)
      : 0;

  // Aggregate all chapter evaluations across recent try outs
  const chapterAggregate: Record<string, { name: string; subject: string; correct: number; total: number }> = {};

  history.forEach((rec) => {
    rec.chapterBreakdowns?.forEach((cb) => {
      if (!chapterAggregate[cb.chapterId]) {
        chapterAggregate[cb.chapterId] = {
          name: cb.chapterName,
          subject: cb.subject,
          correct: 0,
          total: 0,
        };
      }
      chapterAggregate[cb.chapterId].correct += cb.correct;
      chapterAggregate[cb.chapterId].total += cb.total;
    });
  });

  const chapterAnalysis = Object.entries(chapterAggregate).map(([id, data]) => {
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return { id, ...data, percentage: pct };
  });

  // Weak chapters (<60%) and strong chapters (>=80%)
  const weakChapters = chapterAnalysis.filter((c) => c.percentage < 60);
  const strongChapters = chapterAnalysis.filter((c) => c.percentage >= 80);

  // Generate SVG points for Score Evolution Line Graph
  // Sorted chronologically
  const chronologicalHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
  const graphPoints = chronologicalHistory.map((rec, idx) => {
    const x =
      chronologicalHistory.length === 1
        ? 50
        : (idx / (chronologicalHistory.length - 1)) * 260 + 20; // x: 20 to 280
    // Score range 200..1000 mapped to y: 120..20
    const normalizedY = (rec.totalScore1000 - 200) / 800;
    const y = 120 - normalizedY * 100;
    return { x, y, score: rec.totalScore1000, date: rec.date };
  });

  const svgPath =
    graphPoints.length > 1
      ? graphPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
      : '';

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Header & Overview Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Simulasi</div>
            <div className="text-xl font-heading font-extrabold text-gray-900">{totalAttempts}x Ujian</div>
          </div>
        </div>

        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Skor Tertinggi</div>
            <div className="text-xl font-heading font-extrabold text-amber-700">
              {highestScore > 0 ? highestScore : '-'} <span className="text-xs text-gray-500 font-normal">/ 1000</span>
            </div>
          </div>
        </div>

        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Rata-Rata Skor</div>
            <div className="text-xl font-heading font-extrabold text-emerald-700">
              {averageScore > 0 ? averageScore : '-'} <span className="text-xs text-gray-500 font-normal">/ 1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Score Progression Trend Graph */}
      {chronologicalHistory.length > 0 ? (
        <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1C5FE0]" />
              <h3 className="text-sm font-heading font-bold text-gray-900">
                Grafik Perkembangan Skor dari Waktu ke Waktu
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-semibold">Skala Standar TKA (200 - 1000)</span>
          </div>

          <div className="relative p-2 bg-white/70 rounded-2xl border border-gray-200">
            <svg viewBox="0 0 300 140" className="w-full h-40 overflow-visible">
              {/* Grid lines */}
              <line x1="20" y1="20" x2="280" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="280" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="120" x2="280" y2="120" stroke="#CBD5E1" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fontSize="8" fill="#94A3B8" fontFamily="monospace">1000</text>
              <text x="5" y="74" fontSize="8" fill="#94A3B8" fontFamily="monospace">600</text>
              <text x="5" y="124" fontSize="8" fill="#94A3B8" fontFamily="monospace">200</text>

              {/* Trend line */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#1C5FE0"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {graphPoints.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#1C5FE0" stroke="#FFFFFF" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1F3A5F"
                  >
                    {pt.score}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      ) : null}

      {/* Chapter Weakness & Mastery Report */}
      <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-heading font-bold text-gray-900">
              Laporan Evaluasi Penguasaan per Bab / Materi
            </h3>
            <p className="text-xs text-gray-500">
              Analisis akurasi jawaban Anda untuk mendeteksi materi yang perlu diperdalam.
            </p>
          </div>
        </div>

        {chapterAnalysis.length > 0 ? (
          <div className="space-y-3">
            {/* Actionable Weakness Alert */}
            {weakChapters.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Bab Perlu Ditingkatkan Segera (&lt; 60%):</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-rose-700">
                  {weakChapters.map((wc) => (
                    <li key={wc.id}>
                      <strong>{wc.subject}:</strong> {wc.name} (Akurasi: {wc.percentage}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* List of chapters with progress bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {chapterAnalysis.map((ch) => (
                <div
                  key={ch.id}
                  className="p-3 rounded-2xl bg-white/75 border border-gray-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 truncate pr-2">{ch.name}</span>
                    <span
                      className={`font-mono font-bold shrink-0 ${
                        ch.percentage >= 80
                          ? 'text-emerald-700'
                          : ch.percentage < 60
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {ch.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ch.percentage >= 80
                          ? 'bg-emerald-500'
                          : ch.percentage < 60
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${ch.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{ch.subject}</span>
                    <span>{ch.correct} benar dari {ch.total} soal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 text-xs bg-white/50 rounded-2xl">
            Selesaikan minimal 1 sesi Try Out untuk melihat laporan peta kekuatan dan kelemahan bab Anda secara otomatis.
          </div>
        )}
      </div>

      {/* History Log List */}
      <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-gray-900">
            Daftar Riwayat Ujian ({history.length})
          </h3>
          {history.length === 0 && (
            <button
              onClick={onStartNewTryOut}
              className="px-3 py-1.5 rounded-xl text-xs font-heading font-bold bg-[#1C5FE0] text-white cursor-pointer shadow-xs"
            >
              Mulai Try Out Sekarang
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="space-y-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-gray-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {item.date}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{item.packageName}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>
                      Benar: <strong className="text-emerald-700">{item.totalCorrect}</strong> / {item.totalQuestions}
                    </span>
                    <span>•</span>
                    <span>
                      Waktu: {Math.floor(item.totalTimeSpentSeconds / 60)} m {item.totalTimeSpentSeconds % 60} d
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-heading font-extrabold text-blue-700">
                      {item.totalScore1000}{' '}
                      <span className="text-[10px] text-gray-500 font-normal">/ 1000</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-semibold">Skor 100: {item.totalScore100}</div>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedRecord(item);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-500">
            Belum ada riwayat Try Out yang tersimpan. Klik menu Try Out untuk memulai simulasi pertama Anda!
          </div>
        )}
      </div>

      {/* Modal Detail Hasil Record */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-heading font-bold text-gray-900">
                  Detail Hasil {selectedRecord.packageName}
                </h3>
                <span className="text-xs text-gray-500">{selectedRecord.date}</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Showcase */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-1 shadow-md">
              <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
                Skor Akhir Simulasi TKA
              </span>
              <div className="text-3xl font-heading font-extrabold">{selectedRecord.totalScore1000}</div>
              <div className="text-xs text-blue-100">
                Skala 100: <strong>{selectedRecord.totalScore100}</strong> ({selectedRecord.totalCorrect} dari {selectedRecord.totalQuestions} Benar)
              </div>
            </div>

            {/* Breakdown per 4 Sessions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Rincian per Sesi Ujian:</h4>
              <div className="space-y-2">
                {selectedRecord.sessions.map((sess, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/80 border border-gray-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{sess.subject}</span>
                      <div className="text-[11px] text-gray-500">
                        {sess.correct} Benar • {sess.wrong} Salah • {sess.unanswered} Kosong
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-700 font-mono text-sm">{sess.score1000}</span>
                      <div className="text-[10px] text-gray-500">Skor 100: {sess.score100}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2.5 rounded-xl text-xs font-heading font-bold neu-button text-gray-800 cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
