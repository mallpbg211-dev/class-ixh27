import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  School,
  TrendingUp,
  User,
} from 'lucide-react';
import { LeaderboardStudent } from './tkaTypes';
import {
  getLeaderboardData,
  isLeaderboardEnabled,
  setLeaderboardEnabled,
} from './tkaStorage';
import { subscribeTkaResults } from '../../lib/firebase';
import { UserRole } from '../../types';
import { soundManager } from '../../lib/gameAudio';

interface TkaLeaderboardViewProps {
  currentRole: UserRole;
}

export const TkaLeaderboardView: React.FC<TkaLeaderboardViewProps> = ({ currentRole }) => {
  const [enabled, setEnabled] = useState<boolean>(() => isLeaderboardEnabled());
  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [filterMode, setFilterMode] = useState<'HIGHEST' | 'AVERAGE'>('HIGHEST');

  useEffect(() => {
    // Initial local cache calculation
    setLeaderboard(getLeaderboardData());

    // Real-time Firestore sync
    const unsub = subscribeTkaResults((results) => {
      setLeaderboard(getLeaderboardData(results));
    });
    return () => unsub();
  }, []);

  const handleToggleLeaderboard = () => {
    soundManager.playClick();
    const nextState = !enabled;
    setEnabled(nextState);
    setLeaderboardEnabled(nextState);
  };

  const sortedList = [...leaderboard].sort((a, b) =>
    filterMode === 'HIGHEST' ? b.highestScore - a.highestScore : b.averageScore - a.averageScore
  );

  const top3 = sortedList.slice(0, 3);
  const remaining = sortedList.slice(3);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Admin Toggle Banner */}
      {currentRole === 'ADMIN' && (
        <div className="neu-flat rounded-2xl p-4 bg-amber-500/10 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-900">
            <Shield className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Kontrol Akses Admin: </span>
              <span>Status Leaderboard saat ini: </span>
              <strong className={enabled ? 'text-emerald-700' : 'text-rose-700'}>
                {enabled ? 'AKTIF (Dapat Dilihat Siswa)' : 'NONAKTIF (Disembunyikan dari Siswa)'}
              </strong>
            </div>
          </div>

          <button
            onClick={handleToggleLeaderboard}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all ${
              enabled
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {enabled ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Sembunyikan / Nonaktifkan</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Aktifkan Leaderboard</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* When disabled for regular students */}
      {!enabled && currentRole !== 'ADMIN' ? (
        <div className="neu-flat rounded-3xl p-8 bg-[#E7EBF5] border border-white/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center mx-auto">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-bold text-gray-800">
            Papan Peringkat Sedang Dinonaktifkan
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Fitur peringkat try out saat ini dinonaktifkan oleh Wali Kelas / Admin IX-H untuk menjaga kenyamanan dan fokus belajar siswa. Tetap semangat berlatih di menu Latihan Soal!
          </p>
        </div>
      ) : (
        <>
          {/* Header & Filter */}
          <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-heading font-bold text-gray-900">
                  Papan Peringkat TOBK Kelas IX-H
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Peringkat hasil simulasi ujian khusus 32 siswa kelas IX-H.
              </p>
            </div>

            {/* Sorting Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 border border-gray-200 self-start sm:self-auto">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setFilterMode('HIGHEST');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  filterMode === 'HIGHEST'
                    ? 'bg-[#1C5FE0] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Skor Tertinggi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setFilterMode('AVERAGE');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  filterMode === 'AVERAGE'
                    ? 'bg-[#1C5FE0] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Skor Rata-Rata
              </button>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Silver Rank 2 */}
              <div className="neu-flat rounded-3xl p-4 bg-[#E7EBF5] border border-white/80 text-center space-y-2 order-2 sm:order-1">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center mx-auto shadow-xs">
                  2
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white mx-auto overflow-hidden flex items-center justify-center border border-gray-200">
                  {top3[1].avatarUrl ? (
                    <img
                      src={top3[1].avatarUrl}
                      alt={top3[1].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">{top3[1].name}</h4>
                  <span className="text-[10px] text-gray-500 truncate block">
                    {top3[1].dreamSchool}
                  </span>
                </div>
                <div className="text-base font-heading font-extrabold text-blue-700">
                  {filterMode === 'HIGHEST' ? top3[1].highestScore : top3[1].averageScore}
                  <span className="text-[10px] text-gray-500 font-normal"> / 1000</span>
                </div>
              </div>

              {/* Gold Rank 1 */}
              <div className="neu-flat rounded-3xl p-4.5 bg-[#E7EBF5] border border-amber-300/80 text-center space-y-2 order-1 sm:order-2 ring-2 ring-amber-400/40">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-sm flex items-center justify-center mx-auto shadow-sm">
                  👑 1
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white mx-auto overflow-hidden flex items-center justify-center border-2 border-amber-400">
                  {top3[0].avatarUrl ? (
                    <img
                      src={top3[0].avatarUrl}
                      alt={top3[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 truncate">{top3[0].name}</h4>
                  <span className="text-[10px] text-amber-800 font-semibold truncate block">
                    🎯 {top3[0].dreamSchool}
                  </span>
                </div>
                <div className="text-xl font-heading font-extrabold text-amber-700">
                  {filterMode === 'HIGHEST' ? top3[0].highestScore : top3[0].averageScore}
                  <span className="text-xs text-gray-500 font-normal"> / 1000</span>
                </div>
              </div>

              {/* Bronze Rank 3 */}
              <div className="neu-flat rounded-3xl p-4 bg-[#E7EBF5] border border-white/80 text-center space-y-2 order-3">
                <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center mx-auto shadow-xs">
                  3
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white mx-auto overflow-hidden flex items-center justify-center border border-gray-200">
                  {top3[2].avatarUrl ? (
                    <img
                      src={top3[2].avatarUrl}
                      alt={top3[2].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">{top3[2].name}</h4>
                  <span className="text-[10px] text-gray-500 truncate block">
                    {top3[2].dreamSchool}
                  </span>
                </div>
                <div className="text-base font-heading font-extrabold text-blue-700">
                  {filterMode === 'HIGHEST' ? top3[2].highestScore : top3[2].averageScore}
                  <span className="text-[10px] text-gray-500 font-normal"> / 1000</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Rank Table */}
          <div className="neu-flat rounded-3xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide px-1">
              Daftar Siswa Kelas IX-H Lainnya
            </h3>

            <div className="space-y-1.5">
              {remaining.map((item, idx) => (
                <div
                  key={item.studentId}
                  className="p-3 rounded-2xl bg-white/70 border border-gray-200 hover:bg-white transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-gray-500 font-mono">
                      #{idx + 4}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 block truncate">
                        {item.dreamSchool}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-extrabold text-blue-700 text-sm">
                      {filterMode === 'HIGHEST' ? item.highestScore : item.averageScore}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {item.tryOutCount}x TO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
