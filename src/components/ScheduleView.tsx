import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  CheckCircle2,
  ListTodo,
  BookOpen,
  Edit2,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Student,
  UserRole,
  LessonItem,
  PicketGroup,
} from '../types';

interface ScheduleViewProps {
  students: Student[];
  currentRole: UserRole;
  lessons: LessonItem[];
  picketDuties: PicketGroup[];
  onSelectStudent: (student: Student) => void;
  onOpenAdminSchedule?: () => void;
  onOpenAdminPicket?: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  students,
  currentRole,
  lessons,
  picketDuties,
  onSelectStudent,
  onOpenAdminSchedule,
  onOpenAdminPicket,
}) => {
  const [subTab, setSubTab] = useState<'pelajaran' | 'piket'>('pelajaran');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Current day calculation
  const todayName = useMemo(() => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const map = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return map[dayIndex] === 'Minggu' ? 'Senin' : map[dayIndex];
  }, []);

  const [selectedDay, setSelectedDay] = useState<string>(todayName);

  // Local state for picket task checks
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    'Senin-0': true,
    'Senin-1': true,
    'Senin-2': true,
  });

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Lessons for selected day
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => l.day === selectedDay);
  }, [lessons, selectedDay]);

  // Picket for selected day
  const currentPicket = useMemo(() => {
    return (
      picketDuties.find((p) => p.day === selectedDay) ||
      picketDuties[0] || { day: selectedDay, studentIds: [], tasks: [] }
    );
  }, [picketDuties, selectedDay]);

  const picketStudents = useMemo(() => {
    return currentPicket.studentIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean) as Student[];
  }, [currentPicket, students]);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-5">
      {/* Sub-Tab Switcher */}
      <div className="flex justify-center">
        <div className="neu-inset rounded-2xl p-1 flex items-center gap-1 border border-white/60 bg-[#E7EBF5]">
          <button
            onClick={() => setSubTab('pelajaran')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              subTab === 'pelajaran'
                ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                : 'text-[#5C6F84] hover:text-[#1F3A5F]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jadwal Pelajaran</span>
          </button>

          <button
            onClick={() => setSubTab('piket')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              subTab === 'piket'
                ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                : 'text-[#5C6F84] hover:text-[#1F3A5F]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Piket Kebersihan</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills (for Pelajaran & Piket) */}
      <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar justify-start sm:justify-center">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'neu-btn-active bg-[#1F3A5F] text-white'
                    : 'neu-btn text-[#1F3A5F]'
                }`}
              >
                {day}
              </button>
            );
          })}
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: JADWAL PELAJARAN */}
      {/* ======================================================== */}
      {subTab === 'pelajaran' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-heading font-bold text-[#1F3A5F]">
                Mata Pelajaran Hari {selectedDay}
              </span>
              <span className="text-[11px] font-semibold text-[#5C6F84] ml-2">
                ({filteredLessons.length} Sesi Belajar)
              </span>
            </div>

            {/* Ubah Jadwal Action Button (Admin only) */}
            {currentRole === 'ADMIN' && onOpenAdminSchedule && (
              <button
                onClick={onOpenAdminSchedule}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] hover:text-blue-700 flex items-center gap-1.5 shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah Jadwal</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredLessons.length === 0 ? (
              <div className="neu-flat rounded-2xl p-6 text-center text-[#5C6F84] bg-[#E7EBF5]">
                <Calendar className="w-8 h-8 mx-auto text-[#8B9BB0] mb-2" />
                <p className="text-xs font-bold">Tidak ada jadwal pelajaran di hari {selectedDay}.</p>
                {currentRole === 'ADMIN' && onOpenAdminSchedule && (
                  <button
                    onClick={onOpenAdminSchedule}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-[#1C5FE0] text-white font-heading font-bold text-xs shadow-md"
                  >
                    + Tambahkan Pelajaran
                  </button>
                )}
              </div>
            ) : (
              filteredLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/60 hover:translate-y-[-1px] transition-transform"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl neu-flat-sm flex flex-col items-center justify-center text-[#1C5FE0] flex-shrink-0 bg-gradient-to-br from-blue-50 to-white">
                      <Clock className="w-4 h-4 text-[#1C5FE0]" />
                      <span className="text-[9px] font-bold mt-0.5 text-[#1F3A5F]">
                        #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                        {lesson.subject}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6F84] mt-0.5">
                        <span className="font-semibold text-[#1C5FE0]">{lesson.time}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#5C6F84]" />
                          {lesson.teacher}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl neu-inset-sm text-[11px] font-heading font-bold text-[#1F3A5F] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#1C5FE0]" />
                      {lesson.room}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: JADWAL PIKET KEBERSIHAN */}
      {/* ======================================================== */}
      {subTab === 'piket' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#1C5FE0] mb-1">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider">
                  Petugas Piket Hari {selectedDay}
                </h4>
              </div>
              <p className="text-xs text-[#5C6F84]">
                Petugas piket bertanggung jawab menjaga kebersihan ruang IX-H sebelum bel masuk dan setelah pulang sekolah.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] whitespace-nowrap">
                {picketStudents.length} Siswa Terdaftar
              </span>

              {currentRole === 'ADMIN' && onOpenAdminPicket && (
                <button
                  onClick={onOpenAdminPicket}
                  className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Kelola Piket</span>
                </button>
              )}
            </div>
          </div>

          {/* List of Picket Students (Chips/Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {picketStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className="neu-flat-sm rounded-2xl p-3 bg-[#E7EBF5] flex items-center gap-2.5 cursor-pointer hover:bg-white/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {s.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-[#5C6F84]">
                    Absen #{s.id} &bull; "{s.nickname}"
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checklist of Tasks */}
          <div className="neu-inset-deep rounded-3xl p-5 border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                Daftar Tugas Kebersihan
              </span>
              <span className="text-[10px] text-[#5C6F84]">
                {currentRole === 'SISWA' ? 'Mode Lihat' : 'Centang jika selesai'}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentPicket.tasks.map((task, idx) => {
                const key = `${selectedDay}-${idx}`;
                const isChecked = !!completedTasks[key];
                return (
                  <div
                    key={idx}
                    onClick={() => currentRole !== 'SISWA' && toggleTask(key)}
                    className={`neu-flat rounded-2xl p-3 flex items-center justify-between gap-3 bg-[#E7EBF5] ${
                      currentRole !== 'SISWA' ? 'cursor-pointer hover:bg-white/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#10B981] text-white shadow-sm'
                            : 'neu-inset-sm text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isChecked ? 'line-through text-[#8B9BB0]' : 'text-[#1F3A5F]'
                        }`}
                      >
                        {task}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#5C6F84]">
                      {isChecked ? 'Tuntas' : 'Belum'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
