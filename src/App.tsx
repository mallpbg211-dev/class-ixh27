/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  NavTab,
  UserRole,
  Student,
  CashTransaction,
  LessonItem,
  PicketGroup,
  DailyAttendance,
  StudyMaterial,
  CountdownEvent,
  ClassConfig,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  LESSON_SCHEDULES,
  PICKET_DUTIES,
  INITIAL_ATTENDANCE,
  INITIAL_MATERIALS,
  INITIAL_COUNTDOWNS,
} from './data/classData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';
import { AttendanceView } from './components/AttendanceView';
import { ScheduleView } from './components/ScheduleView';
import { CashView } from './components/CashView';
import { BelajarTkaMainView } from './components/tka/BelajarTkaMainView';
import { MaterialsView } from './components/MaterialsView';
import { GameHubView } from './components/GameHubView';
import { GalleryView } from './components/GalleryView';
import { NotificationModal } from './components/NotificationModal';
import { StudentModal } from './components/StudentModal';
import { AdminDashboard, AdminTab } from './components/AdminDashboard';
import { BendaharaDashboard } from './components/BendaharaDashboard';
import { PinAuthModal } from './components/PinAuthModal';
import { SplashScreen } from './components/SplashScreen';
import { RoleSelectScreen } from './components/RoleSelectScreen';
import { PullToRefresh } from './components/PullToRefresh';
import { ScratchpadCanvas } from './components/ScratchpadCanvas';
import {
  isFirebaseConfigured,
  subscribeAttendance,
  subscribeStudents,
  subscribeClassSettings,
  subscribeCashData,
  saveCashData,
  subscribeLessons,
  saveLessonsData,
  subscribePicketDuties,
  savePicketDutiesData,
  saveAttendanceRecord,
  saveStudentData,
  DEFAULT_CLASS_CONFIG,
} from './lib/firebase';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('SISWA');

  // Load class settings & PIN from localStorage with Firestore synchronization
  const [classConfig, setClassConfig] = useState<ClassConfig>(() => {
    try {
      const saved = localStorage.getItem('ixh_class_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CLASS_CONFIG;
  });

  // Load students with localStorage backup
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_students_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [transactions, setTransactions] = useState<CashTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_transactions_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TRANSACTIONS;
  });

  const [nominalKas, setNominalKas] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ixh_nominal_kas');
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 5000;
  });

  const [lessons, setLessons] = useState<LessonItem[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_lessons_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return LESSON_SCHEDULES;
  });

  const [picketDuties, setPicketDuties] = useState<PicketGroup[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_picket_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PICKET_DUTIES;
  });

  // Materials & Countdowns state
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_materials_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MATERIALS;
  });

  const [countdownEvents, setCountdownEvents] = useState<CountdownEvent[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_countdowns_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COUNTDOWNS;
  });

  // Security / PIN Authentication States
  const [isKasUnlocked, setIsKasUnlocked] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinModal, setPinModal] = useState<{
    isOpen: boolean;
    targetRole: 'ADMIN' | 'BENDAHARA';
    title?: string;
    description?: string;
    onSuccess: () => void;
  } | null>(null);

  // Load attendance with localStorage backup
  const [attendance, setAttendance] = useState<Record<string, DailyAttendance>>(() => {
    try {
      const saved = localStorage.getItem('ixh_attendance_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ATTENDANCE;
  });

  // Keep state synced in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ixh_students_data', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_attendance_data', JSON.stringify(attendance));
    } catch {
      // ignore
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_materials_data', JSON.stringify(materials));
    } catch {
      // ignore
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_countdowns_data', JSON.stringify(countdownEvents));
    } catch {
      // ignore
    }
  }, [countdownEvents]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_class_config', JSON.stringify(classConfig));
    } catch {
      // ignore
    }
  }, [classConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_nominal_kas', String(nominalKas));
    } catch {
      // ignore
    }
  }, [nominalKas]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_transactions_data', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_lessons_data', JSON.stringify(lessons));
    } catch {
      // ignore
    }
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_picket_data', JSON.stringify(picketDuties));
    } catch {
      // ignore
    }
  }, [picketDuties]);

  // Realtime Firebase Firestore listeners
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // Realtime attendance listener
    const unsubAttendance = subscribeAttendance((remoteAttendance) => {
      setAttendance((prev) => ({ ...prev, ...remoteAttendance }));
    });

    // Realtime student updates (photoUrl, dreamSchool, bio, and newly created students)
    const unsubStudents = subscribeStudents((remoteMap) => {
      setStudents((prev) => {
        const updated = prev.map((s) => (remoteMap[s.id] ? { ...s, ...remoteMap[s.id] } : s));
        const existingIds = new Set(prev.map((s) => s.id));
        const newlyAdded: Student[] = [];
        Object.entries(remoteMap).forEach(([idStr, studentData]) => {
          const id = Number(idStr);
          if (!existingIds.has(id) && studentData.name) {
            newlyAdded.push({
              id,
              name: studentData.name || `Siswa #${id}`,
              nickname: studentData.nickname || studentData.name || '',
              gender: studentData.gender || 'L',
              role: studentData.role || 'Anggota',
              pin: studentData.pin || '1234',
              dreamSchool: studentData.dreamSchool || 'SMAN 1',
              bio: studentData.bio || '',
              photoUrl: studentData.photoUrl || '',
            });
          }
        });
        return newlyAdded.length > 0 ? [...updated, ...newlyAdded] : updated;
      });
    });

    // Realtime class configuration & PINs listener (collection 'settings', doc 'classConfig')
    const unsubClassConfig = subscribeClassSettings((remoteConfig) => {
      setClassConfig(remoteConfig);
      if (remoteConfig.examDate || remoteConfig.graduationDate) {
        setCountdownEvents((prev) => {
          const updated = [...prev];
          if (remoteConfig.examDate) {
            const target = remoteConfig.examDate.includes('T')
              ? remoteConfig.examDate
              : `${remoteConfig.examDate}T07:30:00`;
            const idx = updated.findIndex((e) => e.category === 'Ujian' || e.id === 'cd-1');
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], targetDate: target, active: true };
            } else {
              updated.unshift({
                id: 'cd-1',
                title: 'Asesmen Sumatif Akhir Jenjang (Ujian Sekolah)',
                targetDate: target,
                description: 'Ujian penentu kelulusan SMP. Persiapkan mental dan belajar bersama!',
                category: 'Ujian',
                active: true,
              });
            }
          }
          if (remoteConfig.graduationDate) {
            const target = remoteConfig.graduationDate.includes('T')
              ? remoteConfig.graduationDate
              : `${remoteConfig.graduationDate}T08:00:00`;
            const idx = updated.findIndex((e) => e.category === 'Kelulusan' || e.id === 'cd-2');
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], targetDate: target, active: true };
            } else {
              updated.push({
                id: 'cd-2',
                title: 'Wisuda & Pengumuman Kelulusan Angkatan IX',
                targetDate: target,
                description: 'Momen perayaan pelepasan dan kelulusan 100% siswa kelas IX-H.',
                category: 'Kelulusan',
                active: true,
              });
            }
          }
          return updated;
        });
      }
    });

    // Realtime cash listener (collection 'cash', doc 'main')
    const unsubCash = subscribeCashData((cashData) => {
      if (typeof cashData.nominalKas === 'number') {
        setNominalKas(cashData.nominalKas);
      }
      if (cashData.transactions && Array.isArray(cashData.transactions)) {
        setTransactions(cashData.transactions);
      }
    });

    // Realtime lessons listener (collection 'lessons', doc 'schedule')
    const unsubLessons = subscribeLessons((remoteLessons) => {
      if (Array.isArray(remoteLessons) && remoteLessons.length > 0) {
        setLessons(remoteLessons);
      }
    });

    // Realtime picket duties listener (collection 'picketDuties', doc 'roster')
    const unsubPicket = subscribePicketDuties((remotePicket) => {
      if (Array.isArray(remotePicket) && remotePicket.length > 0) {
        setPicketDuties(remotePicket);
      }
    });

    return () => {
      unsubAttendance();
      unsubStudents();
      unsubClassConfig();
      unsubCash();
      unsubLessons();
      unsubPicket();
    };
  }, []);

  // Modals & Navigation
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab | 'OVERVIEW'>('OVERVIEW');
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);

  const handleUpdateDream = (id: number, newDream: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dreamSchool: newDream } : s))
    );
    setInspectStudent((prev) => (prev && prev.id === id ? { ...prev, dreamSchool: newDream } : prev));
    saveStudentData(id, { dreamSchool: newDream });
  };

  const handleUpdatePhoto = (id: number, newPhotoUrl: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, photoUrl: newPhotoUrl } : s))
    );
    setInspectStudent((prev) => (prev && prev.id === id ? { ...prev, photoUrl: newPhotoUrl } : prev));
    saveStudentData(id, { photoUrl: newPhotoUrl });
  };

  const handleUpdateBio = (id: number, newBio: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, bio: newBio } : s))
    );
    setInspectStudent((prev) => (prev && prev.id === id ? { ...prev, bio: newBio } : prev));
    saveStudentData(id, { bio: newBio });
  };

  const handleUpdateAttendance = useCallback((newAttendanceMap: Record<string, DailyAttendance>) => {
    setAttendance(newAttendanceMap);
    // Push changed daily attendance items to Firestore
    if (isFirebaseConfigured) {
      Object.values(newAttendanceMap).forEach((record) => {
        saveAttendanceRecord(record);
      });
    }
  }, []);

  const handleUpdateNominalKas = useCallback((newNominal: number) => {
    setNominalKas(newNominal);
    saveCashData({ nominalKas: newNominal });
  }, []);

  const handleUpdateTransactions = useCallback((newTransactions: CashTransaction[]) => {
    setTransactions(newTransactions);
    saveCashData({ transactions: newTransactions });
  }, []);

  const handleUpdateLessons = useCallback((newLessons: LessonItem[]) => {
    setLessons(newLessons);
    saveLessonsData(newLessons);
  }, []);

  const handleUpdatePicketDuties = useCallback((newPicket: PicketGroup[]) => {
    setPicketDuties(newPicket);
    savePicketDutiesData(newPicket);
  }, []);

  const handleUpdateMaterials = useCallback((newMaterials: StudyMaterial[]) => {
    setMaterials(newMaterials);
    try {
      localStorage.setItem('ixh_materials_data', JSON.stringify(newMaterials));
    } catch {
      // ignore
    }
  }, []);

  const handleOpenAdminWithTab = (tab: AdminTab | 'OVERVIEW') => {
    if (!isAdminAuthenticated) {
      setPinModal({
        isOpen: true,
        targetRole: 'ADMIN',
        title: 'Autentikasi Master Admin',
        description: 'Masukkan PIN Master Admin untuk mengakses dashboard admin',
        onSuccess: () => {
          setIsAdminAuthenticated(true);
          setCurrentRole('ADMIN');
          setAdminInitialTab(tab);
          setPinModal(null);
        },
      });
      return;
    }
    setCurrentRole('ADMIN');
    setAdminInitialTab(tab);
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'ADMIN' && !isAdminAuthenticated) {
      setPinModal({
        isOpen: true,
        targetRole: 'ADMIN',
        title: 'Autentikasi Master Admin',
        description: 'Masukkan PIN Master Admin untuk beralih ke peran Admin',
        onSuccess: () => {
          setIsAdminAuthenticated(true);
          setCurrentRole('ADMIN');
          setAdminInitialTab('OVERVIEW');
          setPinModal(null);
        },
      });
      return;
    }
    if (newRole === 'BENDAHARA' && !isKasUnlocked) {
      setPinModal({
        isOpen: true,
        targetRole: 'BENDAHARA',
        title: 'Autentikasi Bendahara Kelas',
        description: 'Masukkan PIN Bendahara untuk beralih ke peran Bendahara',
        onSuccess: () => {
          setIsKasUnlocked(true);
          setCurrentRole('BENDAHARA');
          setPinModal(null);
        },
      });
      return;
    }
    if (newRole === 'SISWA') {
      setIsKasUnlocked(false);
      setIsAdminAuthenticated(false);
    }
    setCurrentRole(newRole);
  };

  const handleNavigateTab = (tab: NavTab) => {
    if (tab === 'kas' && !isKasUnlocked && currentRole !== 'ADMIN') {
      setPinModal({
        isOpen: true,
        targetRole: 'BENDAHARA',
        title: 'Kunci Pengaman Uang Kas',
        description: 'Masukkan PIN Bendahara atau Admin untuk mengakses catatan kas kelas',
        onSuccess: () => {
          setIsKasUnlocked(true);
          setCurrentRole('BENDAHARA');
          setActiveTab('kas');
          setPinModal(null);
        },
      });
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#E7EBF5] text-[#1F3A5F] flex flex-col font-sans selection:bg-[#1C5FE0]/20 selection:text-[#1C5FE0]">
      {/* Splash Screen on initial open */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            setShowRoleSelect(true);
          }}
        />
      )}

      {/* Role Selection Screen shown after SplashScreen */}
      {showRoleSelect && (
        <RoleSelectScreen
          onSelectRole={(role) => {
            setCurrentRole(role);
            if (role === 'SISWA') {
              setIsAdminAuthenticated(false);
              setIsKasUnlocked(false);
            }
            setShowRoleSelect(false);
          }}
          onRequestPinAuth={(targetRole) => {
            if (targetRole === 'ADMIN') {
              setPinModal({
                isOpen: true,
                targetRole: 'ADMIN',
                title: 'Autentikasi Master Admin',
                description: 'Masukkan PIN Master Admin untuk beralih ke peran Admin',
                onSuccess: () => {
                  setIsAdminAuthenticated(true);
                  setCurrentRole('ADMIN');
                  setAdminInitialTab('OVERVIEW');
                  setPinModal(null);
                  setShowRoleSelect(false);
                },
              });
            } else if (targetRole === 'BENDAHARA') {
              setPinModal({
                isOpen: true,
                targetRole: 'BENDAHARA',
                title: 'Autentikasi Bendahara Kelas',
                description: 'Masukkan PIN Bendahara untuk beralih ke peran Bendahara',
                onSuccess: () => {
                  setIsKasUnlocked(true);
                  setCurrentRole('BENDAHARA');
                  setPinModal(null);
                  setShowRoleSelect(false);
                },
              });
            }
          }}
        />
      )}

      {/* 1. Header with App Name "IX-H Hub", Role Switcher, Admin Button & Notification button */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenAdmin={() => {
          if (currentRole === 'ADMIN') {
            setAdminInitialTab('OVERVIEW');
          } else {
            handleOpenAdminWithTab('OVERVIEW');
          }
        }}
        unreadCount={2}
        isFirebaseLive={isFirebaseConfigured}
      />

      {/* Main Content Area based on User Role */}
      {currentRole === 'ADMIN' ? (
        /* ==================== ROLE: ADMIN (FULL-SCREEN DASHBOARD) ==================== */
        <AdminDashboard
          isOpen={true}
          onClose={() => handleRoleChange('SISWA')}
          students={students}
          onUpdateStudents={setStudents}
          nominalKas={nominalKas}
          onUpdateNominalKas={handleUpdateNominalKas}
          transactions={transactions}
          onUpdateTransactions={handleUpdateTransactions}
          lessons={lessons}
          onUpdateLessons={handleUpdateLessons}
          picketDuties={picketDuties}
          onUpdatePicketDuties={handleUpdatePicketDuties}
          attendance={attendance}
          onUpdateAttendance={setAttendance}
          materials={materials}
          onUpdateMaterials={handleUpdateMaterials}
          initialTab={adminInitialTab}
          isAuthenticatedInitial={isAdminAuthenticated}
          classConfig={classConfig}
          onUpdateClassConfig={setClassConfig}
          countdownEvents={countdownEvents}
          onUpdateCountdownEvents={(newEvents) => {
            setCountdownEvents(newEvents);
            try {
              localStorage.setItem('ixh_countdown_events_v1', JSON.stringify(newEvents));
            } catch {
              // ignore
            }
          }}
          onRoleElevate={() => {
            setIsAdminAuthenticated(true);
            setCurrentRole('ADMIN');
          }}
          onSwitchRole={(role) => handleRoleChange(role)}
        />
      ) : currentRole === 'BENDAHARA' ? (
        /* ==================== ROLE: BENDAHARA (DEDICATED CASH DASHBOARD) ==================== */
        <main className="flex-1 w-full max-w-5xl mx-auto pb-6">
          <BendaharaDashboard
            students={students}
            nominalKas={nominalKas}
            transactions={transactions}
            onUpdateTransactions={handleUpdateTransactions}
            onSelectStudent={(s) => setInspectStudent(s)}
            kasPin={classConfig.kasPin}
            isKasUnlocked={isKasUnlocked}
            onRequestUnlockKas={(onSuccess) => {
              setPinModal({
                isOpen: true,
                targetRole: 'BENDAHARA',
                title: 'Kunci Pengaman Uang Kas',
                description: 'Masukkan PIN Bendahara atau Admin untuk mengelola kas',
                onSuccess: () => {
                  setIsKasUnlocked(true);
                  setPinModal(null);
                  onSuccess();
                },
              });
            }}
            onSwitchRole={(role) => handleRoleChange(role)}
          />
        </main>
      ) : (
        /* ==================== ROLE: SISWA (STUDENT VIEWS & BOTTOM NAV) ==================== */
        <>
          <main className="flex-1 w-full max-w-5xl mx-auto pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {activeTab === 'home' && (
                  <PullToRefresh
                    onRefresh={async () => {
                      await new Promise((resolve) => setTimeout(resolve, 600));
                    }}
                  >
                    <ProfileView
                      students={students}
                      currentRole={currentRole}
                      onSelectStudent={(s) => setInspectStudent(s)}
                      onNavigateTab={handleNavigateTab}
                      onOpenAdmin={() => handleOpenAdminWithTab('SISWA')}
                      onChangeRole={() => setShowRoleSelect(true)}
                      countdownEvents={countdownEvents}
                      isKasUnlocked={isKasUnlocked}
                      materials={materials}
                      classConfig={classConfig}
                      onUpdateClassConfig={setClassConfig}
                    />
                  </PullToRefresh>
                )}

                {activeTab === 'absensi' && (
                  <PullToRefresh
                    onRefresh={async () => {
                      await new Promise((resolve) => setTimeout(resolve, 600));
                    }}
                  >
                    <AttendanceView
                      students={students}
                      currentRole={currentRole}
                      attendance={attendance}
                      onUpdateAttendance={handleUpdateAttendance}
                      onSelectStudent={(s) => setInspectStudent(s)}
                      onOpenAdminAttendance={() => handleOpenAdminWithTab('ABSENSI')}
                    />
                  </PullToRefresh>
                )}

                {activeTab === 'jadwal' && (
                  <PullToRefresh
                    onRefresh={async () => {
                      await new Promise((resolve) => setTimeout(resolve, 600));
                    }}
                  >
                    <ScheduleView
                      students={students}
                      currentRole={currentRole}
                      lessons={lessons}
                      picketDuties={picketDuties}
                      onSelectStudent={(s) => setInspectStudent(s)}
                      onOpenAdminSchedule={() => handleOpenAdminWithTab('JADWAL')}
                      onOpenAdminPicket={() => handleOpenAdminWithTab('PIKET')}
                    />
                  </PullToRefresh>
                )}

                {activeTab === 'kas' && (
                  <PullToRefresh
                    onRefresh={async () => {
                      await new Promise((resolve) => setTimeout(resolve, 600));
                    }}
                  >
                    <CashView
                      students={students}
                      currentRole={currentRole}
                      nominalKas={nominalKas}
                      transactions={transactions}
                      onUpdateTransactions={handleUpdateTransactions}
                      onSelectStudent={(s) => setInspectStudent(s)}
                      onLockKas={() => {
                        setIsKasUnlocked(false);
                        setActiveTab('home');
                      }}
                    />
                  </PullToRefresh>
                )}

                {activeTab === 'tka' && (
                  <BelajarTkaMainView currentRole={currentRole} />
                )}

                {activeTab === 'materi' && (
                  <MaterialsView
                    materials={materials}
                    currentRole={currentRole}
                    onOpenAdminUpload={() => handleOpenAdminWithTab('MATERI')}
                  />
                )}

                {activeTab === 'game' && <GameHubView />}

                {activeTab === 'galeri' && (
                  <GalleryView
                    currentRole={currentRole}
                    classConfig={classConfig}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Navigation (Home, Presensi, Jadwal, Kas, Materi, Game, Galeri) */}
          <BottomNav activeTab={activeTab} onChangeTab={handleNavigateTab} />
        </>
      )}

      {/* Global Modals */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        countdownEvents={countdownEvents}
        picketDuties={picketDuties}
        lessons={lessons}
        students={students}
        nominalKas={nominalKas}
        transactions={transactions}
        onOpenAdmin={() => handleOpenAdminWithTab('SISWA')}
        onNavigateToTab={(tab) => {
          setShowNotifications(false);
          handleNavigateTab(tab);
        }}
      />

      <StudentModal
        student={inspectStudent}
        currentRole={currentRole}
        onClose={() => setInspectStudent(null)}
        onUpdateDream={handleUpdateDream}
        onUpdatePhoto={handleUpdatePhoto}
        onUpdateBio={handleUpdateBio}
      />

      {/* PIN Authentication Gatekeeper Modal */}
      {pinModal && (
        <PinAuthModal
          isOpen={pinModal.isOpen}
          targetRole={pinModal.targetRole}
          title={pinModal.title}
          description={pinModal.description}
          adminPin={classConfig.adminPin}
          kasPin={classConfig.kasPin}
          onSuccess={pinModal.onSuccess}
          onClose={() => setPinModal(null)}
        />
      )}

      {/* Global Floating Scratchpad Canvas (Papan Coret-Coretan Terbuka untuk Hitung Cepat / Catatan) */}
      {!showSplash && !showRoleSelect && <ScratchpadCanvas />}
    </div>
  );
}
