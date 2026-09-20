import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Sliders,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  School,
  FileText,
  Target,
  Info,
  X,
  Save,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
} from 'lucide-react';
import { TryOutHistoryRecord } from './tkaTypes';
import {
  loadTryOutHistory,
  getMyStudentId,
} from './tkaStorage';
import {
  subscribeTkaConfig,
  saveTkaConfig,
  TkaSpmbConfig,
  DEFAULT_TKA_CONFIG,
} from '../../lib/firebase';
import { UserRole } from '../../types';
import { soundManager } from '../../lib/gameAudio';
import { INITIAL_STUDENTS } from '../../data/classData';
import {
  PURBALINGGA_SCHOOLS,
  findSchoolByName,
  SchoolReference,
} from '../../data/purbalinggaSchoolsData';

interface KalkulatorSmaViewProps {
  currentRole: UserRole;
  history?: TryOutHistoryRecord[];
}

export const KalkulatorSmaView: React.FC<KalkulatorSmaViewProps> = ({
  currentRole,
  history: propHistory,
}) => {
  // Student Context
  const myStudentId = getMyStudentId();
  const myStudent = useMemo(
    () => INITIAL_STUDENTS.find((s) => s.id === myStudentId) || INITIAL_STUDENTS[0],
    [myStudentId]
  );

  // History
  const history = useMemo(() => {
    const raw = propHistory && propHistory.length > 0 ? propHistory : loadTryOutHistory();
    return raw.filter((r) => !r.studentId || r.studentId === myStudentId);
  }, [propHistory, myStudentId]);

  // Best & Latest TKA Scores from history (scale 0-100)
  const latestTkaScore = useMemo(() => {
    if (history.length === 0) return 82.0;
    return Number(((history[0].totalScore1000 || 0) / 10).toFixed(1));
  }, [history]);

  const bestTkaScore = useMemo(() => {
    if (history.length === 0) return 85.0;
    const max = Math.max(...history.map((h) => h.totalScore1000 || 0));
    return Number((max / 10).toFixed(1));
  }, [history]);

  // Config Bobot (Firestore synchronized)
  const [config, setConfig] = useState<TkaSpmbConfig>(DEFAULT_TKA_CONFIG);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempBobotRapor, setTempBobotRapor] = useState(50);
  const [tempBobotTka, setTempBobotTka] = useState(50);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    const unsub = subscribeTkaConfig((cfg) => {
      setConfig(cfg);
      setTempBobotRapor(cfg.bobotRapor);
      setTempBobotTka(cfg.bobotTka);
    });
    return () => unsub();
  }, []);

  // Form State: Rapor
  const [raporMode, setRaporMode] = useState<'AVERAGE' | 'SEMESTERS'>('AVERAGE');
  const [directRapor, setDirectRapor] = useState<number>(87.5);
  const [semesters, setSemesters] = useState<[number, number, number, number, number]>([
    86.0, 87.0, 88.5, 87.5, 88.5,
  ]);

  const finalRaporScore = useMemo(() => {
    if (raporMode === 'AVERAGE') {
      return directRapor;
    }
    const sum = semesters.reduce((a, b) => a + b, 0);
    return Number((sum / 5).toFixed(2));
  }, [raporMode, directRapor, semesters]);

  // Form State: TKA
  const [tkaScore, setTkaScore] = useState<number>(bestTkaScore);

  // Form State: SMA Impian & Passing Grade
  const initialSchoolMatch = findSchoolByName(myStudent.dreamSchool || 'SMAN 1 Purbalingga');
  const [targetSchool, setTargetSchool] = useState<string>(myStudent.dreamSchool || 'SMAN 1 Purbalingga');
  const [passingGrade, setPassingGrade] = useState<number>(initialSchoolMatch ? initialSchoolMatch.passingGrade : 87.2);
  const [isAiSourced, setIsAiSourced] = useState<boolean>(true);
  const [isSearchingAi, setIsSearchingAi] = useState<boolean>(false);
  const [aiResultNotice, setAiResultNotice] = useState<string | null>(
    initialSchoolMatch
      ? `${initialSchoolMatch.explanation} (${initialSchoolMatch.scoreText})`
      : 'Passing grade acuan resmi PPDB Purbalingga.'
  );
  const [aiSources, setAiSources] = useState<{ title: string; url: string }[]>([
    {
      title: 'Portal PPDB Jateng & Data Resmi Sekolah Purbalingga',
      url: 'https://ppdb.jatengprov.go.id',
    },
  ]);

  // Modal State for Purbalingga SMA & SMK Catalog
  const [showSchoolModal, setShowSchoolModal] = useState<boolean>(false);
  const [schoolSearchFilter, setSchoolSearchFilter] = useState<string>('');
  const [schoolCategoryTab, setSchoolCategoryTab] = useState<'ALL' | 'SMA' | 'SMK' | 'MA' | 'SEKITAR'>('ALL');

  // Check if current targetSchool input matches curated Purbalingga database
  const matchedCuratedSchool = useMemo(() => {
    return findSchoolByName(targetSchool);
  }, [targetSchool]);

  // Handle Select School from Purbalingga Catalog
  const handleSelectSchool = (school: SchoolReference) => {
    setTargetSchool(school.name);
    setPassingGrade(school.passingGrade);
    setIsAiSourced(true);
    setAiResultNotice(
      `${school.name} (Passing Grade ${school.scoreText}) • Akreditasi ${school.akreditasi} di Kec. ${school.subdistrict}. ${school.explanation}`
    );
    setAiSources([
      {
        title: 'Portal PPDB Jawa Tengah & Disdik Purbalingga',
        url: 'https://ppdb.jatengprov.go.id',
      },
    ]);
    setShowSchoolModal(false);
    soundManager.playCorrect();
  };

  // Filtered Schools for Purbalingga SMA/SMK Catalog Modal
  const filteredSchools = useMemo(() => {
    return PURBALINGGA_SCHOOLS.filter((s) => {
      // Tab Category Filter
      if (schoolCategoryTab === 'SMA' && s.category !== 'SMA') return false;
      if (schoolCategoryTab === 'SMK' && s.category !== 'SMK') return false;
      if (schoolCategoryTab === 'MA' && s.category !== 'MA') return false;
      if (schoolCategoryTab === 'SEKITAR' && s.type !== 'SEKITAR') return false;

      // Text Search Filter
      if (!schoolSearchFilter.trim()) return true;
      const q = schoolSearchFilter.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.subdistrict.toLowerCase().includes(q) ||
        (s.favoritePrograms && s.favoritePrograms.some((p) => p.toLowerCase().includes(q))) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [schoolCategoryTab, schoolSearchFilter]);

  // Search Passing Grade with Gemini Google Search Grounding & Smart Purbalingga Cache
  const handleSearchPassingGradeAi = async () => {
    if (!targetSchool.trim()) {
      alert('Ketik nama SMA atau SMK tujuan terlebih dahulu.');
      return;
    }

    // Cek database lokal terlebih dahulu untuk menghindari limit 429
    const localMatch = findSchoolByName(targetSchool.trim());
    if (localMatch) {
      handleSelectSchool(localMatch);
      return;
    }

    setIsSearchingAi(true);
    setAiResultNotice(null);
    setAiSources([]);
    soundManager.playClick();

    try {
      const res = await fetch('/api/tka/search-sma-passing-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: targetSchool.trim(),
          city: 'Purbalingga / Jawa Tengah',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data?.error || 'Layanan penelusuran sedang sibuk. Silakan isi angka passing grade secara manual.';
        setAiResultNotice(msg);
        setIsAiSourced(false);
        return;
      }

      if (data.found && typeof data.passingGrade === 'number') {
        setPassingGrade(Number(data.passingGrade.toFixed(2)));
        setIsAiSourced(true);
        setAiResultNotice(data.explanation || data.originalScoreText || 'Passing grade berhasil dimuat.');
        setAiSources(data.sources || []);
        soundManager.playCorrect();
      } else {
        setIsAiSourced(false);
        setAiResultNotice(data.explanation || 'Data tidak ditemukan di sumber publik resmi, silakan isi nilai ambang batas secara manual.');
        setAiSources(data.sources || []);
      }
    } catch {
      setAiResultNotice('Koneksi sedang terbatas. Silakan isi angka passing grade target sekolah secara manual.');
      setIsAiSourced(false);
    } finally {
      setIsSearchingAi(false);
    }
  };

  // Calculations
  const calculatedComposite = useMemo(() => {
    const bobotR = config.bobotRapor / 100;
    const bobotT = config.bobotTka / 100;
    const val = (finalRaporScore * bobotR) + (tkaScore * bobotT);
    return Number(val.toFixed(2));
  }, [finalRaporScore, tkaScore, config]);

  const scoreDiff = useMemo(() => {
    return Number((calculatedComposite - passingGrade).toFixed(2));
  }, [calculatedComposite, passingGrade]);

  // Status Category
  const statusCategory = useMemo(() => {
    if (scoreDiff >= 2.0) {
      return {
        label: 'Aman (Target Terlampaui)',
        color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        badge: 'bg-emerald-600 text-white',
        icon: ShieldCheck,
        type: 'SAFE',
      };
    } else if (scoreDiff >= -2.0) {
      return {
        label: 'Waspada (Nilai Bersaing Ketat)',
        color: 'text-amber-800 bg-amber-100 border-amber-300',
        badge: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        type: 'WARNING',
      };
    } else {
      return {
        label: 'Perlu Ditingkatkan',
        color: 'text-red-700 bg-red-100 border-red-300',
        badge: 'bg-red-600 text-white',
        icon: TrendingUp,
        type: 'DANGER',
      };
    }
  }, [scoreDiff]);

  // Target TKA Needed to Reach Passing Grade
  const tkaNeededForTarget = useMemo(() => {
    // passingGrade = (rapor * bR) + (targetTka * bT)
    // targetTka = (passingGrade - (rapor * bR)) / bT
    const bR = config.bobotRapor / 100;
    const bT = config.bobotTka / 100;
    if (bT <= 0) return 0;
    const needed = (passingGrade - (finalRaporScore * bR)) / bT;
    return Number(Math.max(0, Math.min(100, needed)).toFixed(1));
  }, [passingGrade, finalRaporScore, config]);

  const additionalTkaPoints = useMemo(() => {
    const diff = tkaNeededForTarget - tkaScore;
    return Number(Math.max(0, diff).toFixed(1));
  }, [tkaNeededForTarget, tkaScore]);

  // Handle Save Config (Admin Only)
  const handleSaveConfig = async () => {
    if (tempBobotRapor + tempBobotTka !== 100) {
      alert(`Jumlah total bobot harus 100%. Saat ini: ${tempBobotRapor + tempBobotTka}%`);
      return;
    }
    setIsSavingConfig(true);
    try {
      await saveTkaConfig({
        bobotRapor: tempBobotRapor,
        bobotTka: tempBobotTka,
      });
      setShowConfigModal(false);
      soundManager.playCorrect();
    } catch (err: any) {
      alert('Gagal menyimpan bobot: ' + err?.message);
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                  Simulasi SPMB / PPDB
                </span>
                <span className="text-xs text-gray-500 font-medium">Jalur Prestasi Nilai</span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mt-0.5">
                Kalkulator Peluang Masuk SMA Impian
              </h2>
            </div>
          </div>

          {/* Admin Adjust Weights Button */}
          {currentRole === 'ADMIN' && (
            <button
              onClick={() => {
                soundManager.playClick();
                setShowConfigModal(true);
              }}
              className="px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-start sm:self-center shadow-xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Atur Bobot Kelas</span>
              <span className="text-[10px] text-gray-400">({config.bobotRapor}:{config.bobotTka})</span>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Hitung prediksi nilai gabungan akhir (Rapor + TKA) untuk mendaftar ke SMA/SMK Negeri impian. Gunakan fitur pencarian AI dengan Google Search grounding untuk menemukan passing grade resmi tahun sebelumnya.
        </p>

        {/* Current Weight Formula Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-gray-200 text-xs text-gray-700">
          <span className="font-bold text-indigo-700">Rumus Aktif:</span>
          <span>
            ({config.bobotRapor}% × Rapor) + ({config.bobotTka}% × TKA) = Nilai Akhir
          </span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Inputs Form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Input Nilai Rapor */}
          <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-heading font-bold text-gray-900">
                  1. Nilai Rapor Siswa
                </h3>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-gray-200/70 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setRaporMode('AVERAGE')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    raporMode === 'AVERAGE' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rata-rata Langsung
                </button>
                <button
                  type="button"
                  onClick={() => setRaporMode('SEMESTERS')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    raporMode === 'SEMESTERS' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rincian Sem 1–5
                </button>
              </div>
            </div>

            {raporMode === 'AVERAGE' ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rata-rata Nilai Rapor Semester 1 s.d. 5 (Skala 0–100)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={directRapor}
                    onChange={(e) => setDirectRapor(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-gray-500">Poin</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-gray-500">
                  Masukkan nilai rata-rata per semester untuk menghitung rata-rata otomatis:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {semesters.map((val, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="block text-[10px] font-bold text-gray-500 text-center">
                        Sem {idx + 1}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={val}
                        onChange={(e) => {
                          const updated = [...semesters] as [number, number, number, number, number];
                          updated[idx] = parseFloat(e.target.value) || 0;
                          setSemesters(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-center text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Rata-rata 5 Semester:</span>
                  <span className="font-bold text-blue-700 text-sm">{finalRaporScore}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Input Nilai TKA */}
          <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-heading font-bold text-gray-900">
                  2. Nilai TKA (Tes Kemampuan Akademik)
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTkaScore(bestTkaScore);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold hover:bg-purple-100 transition-colors"
                  title="Gunakan nilai tryout terbaik yang tersimpan"
                >
                  Pakai TO Terbaik ({bestTkaScore})
                </button>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setTkaScore(latestTkaScore);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-semibold hover:bg-gray-200 transition-colors"
                    title="Gunakan nilai tryout terakhir"
                  >
                    Terakhir ({latestTkaScore})
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nilai TKA yang Diperhitungkan (Skala 0–100)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={tkaScore}
                  onChange={(e) => setTkaScore(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-gray-500">Poin</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                Kamu bisa mengubah angka di atas untuk mensimulasikan "bagaimana jika nilai TKA saya naik?".
              </p>
            </div>
          </div>

          {/* Card 3: SMA & SMK Tujuan & Passing Grade (Purbalingga Database + AI) */}
          <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-heading font-bold text-gray-900">
                  3. Target SMA / SMK Impian & Passing Grade
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Purbalingga & Sekitarnya
              </span>
            </div>

            {/* Quick Catalog Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowSchoolModal(true);
              }}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-105 text-white text-xs font-bold shadow-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-200" />
                <span>Pilih dari Database Lengkap SMA & SMK Purbalingga</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-extrabold uppercase tracking-wide">
                {PURBALINGGA_SCHOOLS.length} Sekolah (Bebas Limit)
              </span>
            </button>

            {/* Quick Pick Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">
                Pilihan Populer:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'SMAN 1 Purbalingga',
                  'SMAN 2 Purbalingga',
                  'SMKN 1 Purbalingga',
                  'SMKN 1 Bojongsari (Purbalingga)',
                  'SMKN 2 Purbalingga',
                  'SMAN 1 Bobotsari',
                  'SMAN 1 Bukateja',
                  'SMAN 1 Padamara',
                  'SMKN 1 Kaligondang',
                  'MAN Purbalingga',
                ].map((name) => {
                  const target = PURBALINGGA_SCHOOLS.find((s) => s.name === name);
                  const isSelected = targetSchool.toLowerCase().trim() === name.toLowerCase().trim();
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        if (target) handleSelectSchool(target);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border-gray-200'
                      }`}
                    >
                      {name.replace(' (Purbalingga)', '')}
                      {name.includes('Bojongsari') && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">Lokal</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama SMA / SMK Negeri / Swasta Tujuan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMAN 1 Purbalingga, SMKN 1 Bojongsari, SMAN 1 Bobotsari..."
                  value={targetSchool}
                  onChange={(e) => setTargetSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Matched Curated School Quick Sync Banner */}
              {matchedCuratedSchool && passingGrade !== matchedCuratedSchool.passingGrade && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Data resmi <strong>{matchedCuratedSchool.name}</strong>:{' '}
                      <strong>{matchedCuratedSchool.passingGrade}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSchool(matchedCuratedSchool)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shrink-0 hover:bg-emerald-700 shadow-xs"
                  >
                    Gunakan Nilai Resmi
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span>Passing Grade / Nilai Ambang Batas</span>
                    {isAiSourced ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Data Resmi Terverifikasi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                        Input Manual
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={passingGrade}
                    onChange={(e) => {
                      setPassingGrade(parseFloat(e.target.value) || 0);
                      setIsAiSourced(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />

                  {/* AI Grounding Search Button (Optional / Sekolah Lain) */}
                  <button
                    type="button"
                    onClick={handleSearchPassingGradeAi}
                    disabled={isSearchingAi}
                    title="Cek nilai via database lokal atau pencarian web"
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSearchingAi ? 'Mencari...' : 'Cek Nilai'}</span>
                  </button>
                </div>
              </div>

              {/* AI / Reference Explanation & Sources Callout */}
              {aiResultNotice && (
                <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {aiResultNotice}
                    </p>
                  </div>

                  {aiSources.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Sumber Web Resmi Terverifikasi:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-[11px] text-emerald-700 font-semibold transition-colors border border-gray-200"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="max-w-[200px] truncate">{src.title || src.url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Results & Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 space-y-5">
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                Hasil Prediksi Gabungan
              </span>
              <h3 className="text-base font-heading font-bold text-gray-900 mt-1">
                Estimasi Skor SPMB Kamu
              </h3>
            </div>

            {/* Huge Composite Score Display */}
            <div className="p-5 rounded-3xl bg-white border border-gray-200 text-center space-y-1 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nilai Akhir Gabungan
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-gray-900 tracking-tight">
                {calculatedComposite}
              </div>
              <div className="text-xs text-gray-500 pt-1">
                Rapor ({finalRaporScore} × {config.bobotRapor}%) + TKA ({tkaScore} × {config.bobotTka}%)
              </div>
            </div>

            {/* Target Comparison Card */}
            <div className={`p-4 rounded-2xl border ${statusCategory.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Status Peluang:</span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${statusCategory.badge}`}>
                  {statusCategory.label}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-current/20 text-xs">
                <span>Passing Grade {targetSchool || 'SMA Tujuan'}:</span>
                <span className="font-bold text-sm">{passingGrade}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>Selisih Poin (Margin):</span>
                <span className="font-extrabold text-sm">
                  {scoreDiff >= 0 ? `+${scoreDiff}` : `${scoreDiff}`} Poin
                </span>
              </div>
            </div>

            {/* Personal Recommendation Action Box */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Rekomendasi Tindakan</span>
              </h4>

              {scoreDiff >= 2.0 ? (
                <p className="text-xs text-gray-700 leading-relaxed">
                  Luar biasa! Nilai gabungan kamu saat ini berada di zona aman (+{scoreDiff} poin di atas passing grade {targetSchool}). Pertahankan ritme belajar dan terus latih kecepatan pengerjaan soal dengan trik The King.
                </p>
              ) : scoreDiff >= 0 ? (
                <p className="text-xs text-gray-700 leading-relaxed">
                  Peluang kamu terbuka, namun berada di margin ketat (+{scoreDiff} poin). Naikkan nilai TKA setidaknya <strong className="text-indigo-700">{(2 - scoreDiff).toFixed(1)} poin</strong> lagi agar lebih aman dari lonjakan pendaftar baru.
                </p>
              ) : (
                <p className="text-xs text-gray-700 leading-relaxed">
                  Untuk mencapai target {targetSchool}, kamu perlu menaikkan nilai TKA minimal{' '}
                  <strong className="text-red-600 font-bold">{additionalTkaPoints} poin</strong> lagi (menjadi target TKA <strong className="text-indigo-700 font-bold">{tkaNeededForTarget}</strong>) pada Try Out berikutnya. Fokuskan belajar pada bab-bab yang masih lemah di menu Analisis & Rekomendasi!
                </p>
              )}
            </div>

            {/* Educational Disclaimer */}
            <div className="pt-1 text-[11px] text-gray-500 leading-relaxed border-t border-gray-200/80">
              <p className="italic">
                * Catatan: Perhitungan ini merupakan estimasi berbasis data tahun sebelumnya. Daya tampung dan passing grade sesungguhnya dapat berubah tergantung pendaftar tahun berjalan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Adjust Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-heading font-bold text-gray-900">
                  Pengaturan Bobot SPMB Kelas
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Ubah persentase pembobotan seleksi untuk seluruh siswa Kelas IX-H sesuai ketentuan dinas pendidikan wilayah setempat.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bobot Nilai Rapor (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tempBobotRapor}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTempBobotRapor(val);
                    setTempBobotTka(Math.max(0, 100 - val));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bobot Nilai TKA (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tempBobotTka}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTempBobotTka(val);
                    setTempBobotRapor(Math.max(0, 100 - val));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <span>Total Bobot:</span>
                <span className={tempBobotRapor + tempBobotTka === 100 ? 'text-emerald-600' : 'text-red-600'}>
                  {tempBobotRapor + tempBobotTka}%
                </span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSavingConfig || tempBobotRapor + tempBobotTka !== 100}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingConfig ? 'Menyimpan...' : 'Simpan ke Firestore'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purbalingga SMA & SMK Catalog Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-bold text-gray-900">
                      Bank Data SMA & SMK Purbalingga
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Bebas Limit AI
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Data passing grade rujukan PPDB resmi Jawa Tengah untuk sekolah di Kabupaten Purbalingga & sekitarnya.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={schoolSearchFilter}
                onChange={(e) => setSchoolSearchFilter(e.target.value)}
                placeholder="Cari nama sekolah, kecamatan, atau jurusan (contoh: Bojongsari, Boga, RPL, Mesin)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {schoolSearchFilter && (
                <button
                  type="button"
                  onClick={() => setSchoolSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-[11px] font-semibold">
              {[
                { key: 'ALL', label: `Semua (${PURBALINGGA_SCHOOLS.length})` },
                {
                  key: 'SMA',
                  label: `SMA Negeri (${PURBALINGGA_SCHOOLS.filter((s) => s.type === 'SMA_NEGERI').length})`,
                },
                {
                  key: 'SMK',
                  label: `SMK Negeri (${PURBALINGGA_SCHOOLS.filter((s) => s.type === 'SMK_NEGERI').length})`,
                },
                {
                  key: 'MA',
                  label: `Swasta & MA (${PURBALINGGA_SCHOOLS.filter((s) => s.type.includes('SWASTA') || s.type === 'MA_NEGERI').length})`,
                },
                {
                  key: 'SEKITAR',
                  label: `Banyumas/Pwt (${PURBALINGGA_SCHOOLS.filter((s) => s.type === 'SEKITAR').length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSchoolCategoryTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                    schoolCategoryTab === tab.key
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* School List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 max-h-[50vh]">
              {filteredSchools.length === 0 ? (
                <div className="p-8 text-center bg-white/60 rounded-2xl border border-gray-200 space-y-2">
                  <School className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold">
                    Tidak ditemukan sekolah dengan kata kunci "{schoolSearchFilter}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSchoolSearchFilter('');
                      setSchoolCategoryTab('ALL');
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Reset Pencarian
                  </button>
                </div>
              ) : (
                filteredSchools.map((school) => {
                  const isCurrent = targetSchool.toLowerCase().trim() === school.name.toLowerCase().trim();
                  return (
                    <div
                      key={school.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400 shadow-xs'
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                school.category === 'SMA'
                                  ? 'bg-blue-100 text-blue-800'
                                  : school.category === 'SMK'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {school.type === 'SMA_NEGERI'
                                ? 'SMA Negeri'
                                : school.type === 'SMK_NEGERI'
                                ? 'SMK Negeri'
                                : school.type === 'MA_NEGERI'
                                ? 'MA Negeri'
                                : school.type === 'SEKITAR'
                                ? 'Sekitar Purwokerto'
                                : 'Swasta'}
                            </span>

                            <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{school.subdistrict}</span>
                            </span>

                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 border border-gray-200">
                              Akreditasi {school.akreditasi}
                            </span>
                          </div>

                          <h4 className="text-sm font-heading font-bold text-gray-900">
                            {school.name}
                          </h4>

                          <p className="text-xs text-gray-600 leading-relaxed">
                            {school.explanation}
                          </p>

                          {school.favoritePrograms && school.favoritePrograms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-[10px] font-bold text-gray-400">Kompetensi/Jurusan:</span>
                              {school.favoritePrograms.map((jurusan, jIdx) => (
                                <span
                                  key={jIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium"
                                >
                                  {jurusan}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Passing Grade & Select Button */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="text-left sm:text-right">
                            <span className="block text-[10px] uppercase font-bold text-gray-400">
                              Passing Grade
                            </span>
                            <span className="text-base sm:text-lg font-heading font-extrabold text-emerald-700">
                              {school.passingGrade.toFixed(2)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectSchool(school)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-900 hover:bg-emerald-600 text-white'
                            }`}
                          >
                            {isCurrent ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Terpilih</span>
                              </>
                            ) : (
                              <span>Pilih Sekolah</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <p className="text-[11px] text-gray-500 italic text-center sm:text-left">
                * Nilai acuan dihimpun dari ambang batas terendah PPDB Jawa Tengah jalur prestasi rapor.
              </p>
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
