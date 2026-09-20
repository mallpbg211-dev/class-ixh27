import { Student, OrgStructure, GalleryPhoto, LessonItem, PicketGroup, CashTransaction, DailyAttendance, AttendanceStatus } from '../types';

export const CLASS_METADATA = {
  name: 'IX-H',
  fullName: 'Kelas IX-H',
  school: 'SMP Negeri 1',
  academicYear: '2026/2027',
  motto: 'Kompak Tanpa Batas, Berprestasi Berkelas, Menuju Kelulusan Emas',
  waliKelas: 'Ibu Siti Nur Syamsyiah, S.Pd',
  waliKelasNip: '19790412 200501 2 008',
  waliKelasSubject: 'Guru Pengampu IPA / Biologi',
  totalStudents: 32,
  maleCount: 18,
  femaleCount: 14,
  nominalKasHarian: 1000,
  sambutanWaliKelas: {
    label: 'Sambutan wali kelas',
    title: 'Menuju Kelulusan Gemilang Bersama Keluarga Besar IX-H',
    quote: 'Assalamu\'alaikum wr. wb. dan salam sejahtera untuk anak-anakku tersayang di kelas IX-H. Tahun ini adalah garis penentu perjuangan kita di jenjang SMP. Jangan pernah merasa berjuang sendirian; mari saling mendukung, menjaga kekompakan, giat belajar, dan raih tiket ke SMA/SMK impian dengan penuh kebanggaan dan akhlak mulia.',
    date: 'Semester Ganjil 2026/2027',
  },
  vision: 'Mewujudkan kelas IX-H yang berakhlak mulia, unggul dalam sains dan teknologi, berjiwa gotong royong, dan 100% lulus diterima di sekolah lanjutan impian.',
  missions: [
    'Membangun lingkungan belajar yang inklusif, bersih, dan saling menghormati.',
    'Menumbuhkan kedisiplinan belajar, ketertiban presensi, dan kepedulian sosial.',
    'Mengembangkan potensi akademik dan bakat non-akademik tiap siswa secara optimal.',
    'Menjaga kekompakan serta nama baik kelas IX-H di tingkat sekolah maupun luar sekolah.',
  ]
};

export const DEFAULT_WALI_KELAS = {
  name: 'Ibu Siti Nur Syamsyiah, S.Pd',
  nip: '19790412 200501 2 008',
  subject: 'Guru Pengampu IPA / Biologi',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  greetingTitle: 'Menuju Kelulusan Gemilang Bersama Keluarga Besar IX-H',
  greetingText: "Assalamu'alaikum wr. wb. dan salam sejahtera untuk anak-anakku tersayang di kelas IX-H. Tahun ini adalah garis penentu perjuangan kita di jenjang SMP. Jangan pernah merasa berjuang sendirian; mari saling mendukung, menjaga kekompakan, giat belajar, dan raih tiket ke SMA/SMK impian dengan penuh kebanggaan dan akhlak mulia.",
};

// 12 Pengurus Kelas (Org Chart Data)
export const ORG_STRUCTURE: OrgStructure = {
  waliKelas: {
    name: 'Ibu Siti Nur Syamsyiah, S.Pd',
    title: 'Wali Kelas IX-H',
    subject: 'Guru Pengampu IPA',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
  },
  ketua: {
    name: 'Hikmal Syukri Febriyanto',
    role: 'Ketua Kelas',
    nickname: 'Hikmal',
    gender: 'L',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  },
  wakilKetua: {
    name: 'Rafi Azka Zaidan',
    role: 'Wakil Ketua',
    nickname: 'Rafi',
    gender: 'L',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  sections: [
    {
      id: 'bendahara',
      name: 'Bendahara',
      icon: 'Coins',
      members: [
        {
          name: 'Sabrina Nur Salsabila',
          role: 'Bendahara 1',
          nickname: 'Sabrina',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
        },
        {
          name: 'Afiqa Khairunnisa',
          role: 'Bendahara 2',
          nickname: 'Afiqa',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'sekretaris',
      name: 'Sekretaris',
      icon: 'FileText',
      members: [
        {
          name: 'Safa Nurul Afifah',
          role: 'Sekretaris 1',
          nickname: 'Safa',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
        },
        {
          name: 'Firsta Septiasa Nur Fitri',
          role: 'Sekretaris 2',
          nickname: 'Firsta',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'kebersihan',
      name: 'Seksi Kebersihan',
      icon: 'Sparkles',
      members: [
        {
          name: 'Aira Nisathaullah',
          role: 'Kebersihan 1',
          nickname: 'Aira',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&auto=format&fit=crop&q=80',
        },
        {
          name: 'Vanesh Amelia',
          role: 'Kebersihan 2',
          nickname: 'Vanesh',
          gender: 'P',
          avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=240&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'keamanan',
      name: 'Seksi Keamanan',
      icon: 'Shield',
      members: [
        {
          name: 'Awal Nur Ardiansyah',
          role: 'Keamanan 1',
          nickname: 'Awal',
          gender: 'L',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
        },
        {
          name: 'Fauzan Setiawan',
          role: 'Keamanan 2',
          nickname: 'Fauzan',
          gender: 'L',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
        },
        {
          name: 'Azam Setia',
          role: 'Keamanan 3',
          nickname: 'Azam',
          gender: 'L',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
        },
      ],
    },
  ],
};

// 32 Siswa Lengkap Kelas IX-H (18 Putra & 14 Putri)
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: 'Hikmal Syukri Febriyanto',
    nickname: 'Hikmal',
    gender: 'L',
    role: 'Ketua Kelas',
    pin: '4821',
    dreamSchool: 'SMAN 1 (MIPA)',
    bio: 'Diplomat / Duta Besar RI & Penggiat Debat Bahasa',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Rafi Azka Zaidan',
    nickname: 'Rafi',
    gender: 'L',
    role: 'Wakil Ketua',
    pin: '7392',
    dreamSchool: 'SMAN 3 (MIPA)',
    bio: 'Software Architect & Insinyur Robotika',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Sabrina Nur Salsabila',
    nickname: 'Sabrina',
    gender: 'P',
    role: 'Bendahara 1',
    pin: '2916',
    dreamSchool: 'SMAN 1 (IPS / Ekonomi)',
    bio: 'Akuntan Publik & Konsultan Keuangan Korporat',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Afiqa Khairunnisa',
    nickname: 'Afiqa',
    gender: 'P',
    role: 'Bendahara 2',
    pin: '7164',
    dreamSchool: 'SMKN 1 (Perbankan & Akuntansi)',
    bio: 'Manajer Portofolio Investasi & Founder Brand Retail',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Safa Nurul Afifah',
    nickname: 'Safa',
    gender: 'P',
    role: 'Sekretaris 1',
    pin: '6204',
    dreamSchool: 'SMAN 1 (Bahasa & Komunikasi)',
    bio: 'Jurnalis Investigasi & Penulis Buku Bestseller',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Firsta Septiasa Nur Fitri',
    nickname: 'Firsta',
    gender: 'P',
    role: 'Sekretaris 2',
    pin: '3850',
    dreamSchool: 'SMAN 2 (Ilmu Hukum & Sosial)',
    bio: 'Notaris & Dosen Tata Kelola Kebijakan Publik',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Aira Nisathaullah',
    nickname: 'Aira',
    gender: 'P',
    role: 'Seksi Kebersihan',
    pin: '8472',
    dreamSchool: 'SMAN 1 (MIPA - Lingkungan)',
    bio: 'Arsitek Lanskap Hijau & Peneliti Konservasi Alam',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Vanesh Amelia',
    nickname: 'Vanesh',
    gender: 'P',
    role: 'Seksi Kebersihan',
    pin: '5823',
    dreamSchool: 'SMAN 4 (Desain & Seni Rupa)',
    bio: 'Creative Director & Fashion Product Designer',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    name: 'Awal Nur Ardiansyah',
    nickname: 'Awal',
    gender: 'L',
    role: 'Seksi Keamanan',
    pin: '1583',
    dreamSchool: 'SMKN 2 (Teknik Mesin & Otomasi)',
    bio: 'Perwira Militer / Ahli Keselamatan Maritim',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    name: 'Fauzan Setiawan',
    nickname: 'Fauzan',
    gender: 'L',
    role: 'Seksi Keamanan',
    pin: '9147',
    dreamSchool: 'SMKN 1 (Rekayasa Perangkat Lunak)',
    bio: 'Cyber Security Specialist & Network Forensic Analyst',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 11,
    name: 'Azam Setia',
    nickname: 'Azam',
    gender: 'L',
    role: 'Seksi Keamanan',
    pin: '6732',
    dreamSchool: 'SMAN 5 (Olahraga & Prestasi)',
    bio: 'Atlet Taekwondo Nasional & Spesialis Kebugaran Fisik',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 12,
    name: 'Alif Danendra Wicaksono',
    nickname: 'Alif',
    gender: 'L',
    role: 'Anggota',
    pin: '4391',
    dreamSchool: 'MAN Insan Cendekia',
    bio: 'Astronom & Peneliti Astrofisika Observatorium',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 13,
    name: 'Ananda Bagus Saputra',
    nickname: 'Bagus',
    gender: 'L',
    role: 'Anggota',
    pin: '5038',
    dreamSchool: 'SMKN 2 (Otomotif Modern)',
    bio: 'Chief Mechanical Engineer Mobil Listrik Nasional',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 14,
    name: 'Bima Sakti Yudhistira',
    nickname: 'Bima',
    gender: 'L',
    role: 'Anggota',
    pin: '8205',
    dreamSchool: 'SMAN 1 (MIPA)',
    bio: 'Dokter Spesialis Bedah Jantung & Peneliti Medis',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 15,
    name: 'Daffa Arya Kusuma',
    nickname: 'Daffa',
    gender: 'L',
    role: 'Anggota',
    pin: '1948',
    dreamSchool: 'SMAN 3 (MIPA)',
    bio: 'Pilot Pesawat Komersial Internasional',
    photoUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 16,
    name: 'Dimas Wahyu Ramadhan',
    nickname: 'Dimas',
    gender: 'L',
    role: 'Anggota',
    pin: '3490',
    dreamSchool: 'SMAN 1 (MIPA)',
    bio: 'Data Scientist & AI Algorithm Developer',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 17,
    name: 'Galih Rakha Pratama',
    nickname: 'Galih',
    gender: 'L',
    role: 'Anggota',
    pin: '7615',
    dreamSchool: 'SMKN 1 (Multimedia & Animasi)',
    bio: 'Sutradara Sinematografi & 3D Animator Studio',
    photoUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 18,
    name: 'Hafiz Ridho Illahi',
    nickname: 'Hafiz',
    gender: 'L',
    role: 'Anggota',
    pin: '9054',
    dreamSchool: 'MAN 1 (Kajian Islam & Bahasa)',
    bio: 'Dosen Filologi Timur Tengah & Diplomat Budaya',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 19,
    name: 'Kaisar Bintang Ramadhani',
    nickname: 'Bintang',
    gender: 'L',
    role: 'Anggota',
    pin: '8620',
    dreamSchool: 'SMAN 3 (IPS & Bisnis)',
    bio: 'Founder Edu-Tech Startup & Venture Capitalist',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 20,
    name: 'Muhammad Fauzi Akbar',
    nickname: 'Ozi',
    gender: 'L',
    role: 'Anggota',
    pin: '5943',
    dreamSchool: 'SMAN 1 (MIPA)',
    bio: 'Peneliti Bioteknologi Kelautan Tropis',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 21,
    name: 'Naufal Raditya Hadi',
    nickname: 'Naufal',
    gender: 'L',
    role: 'Anggota',
    pin: '6498',
    dreamSchool: 'SMKN 2 (Elektronika Industri)',
    bio: 'Teknisi Instrumentasi Sel Surya & Energi Bersih',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 22,
    name: 'Rizky Dwi Saputro',
    nickname: 'Kiki',
    gender: 'L',
    role: 'Anggota',
    pin: '2084',
    dreamSchool: 'SMAN 5 (Ilmu Keolahragaan)',
    bio: 'Fisioterapis Klub Olahraga Profesional',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 23,
    name: 'Satria Maulana Ihsan',
    nickname: 'Satria',
    gender: 'L',
    role: 'Anggota',
    pin: '4652',
    dreamSchool: 'SMKN 1 (Broadcasting TV)',
    bio: 'Produser Eksekutif Program Dokumenter Budaya',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 24,
    name: 'Yusuf Habib Al-Fatih',
    nickname: 'Habib',
    gender: 'L',
    role: 'Anggota',
    pin: '1265',
    dreamSchool: 'SMAN 1 (MIPA & Matematika)',
    bio: 'Matematikawan Murni & Dosen Kriptografi',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 25,
    name: 'Aisyah Nur Salsabila',
    nickname: 'Aisyah',
    gender: 'P',
    role: 'Anggota',
    pin: '2389',
    dreamSchool: 'SMAN 1 (MIPA Medis)',
    bio: 'Dokter Spesialis Anak & Konselor Nutrisi Tumbuh Kembang',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 26,
    name: 'Amalia Rizki Utami',
    nickname: 'Amel',
    gender: 'P',
    role: 'Anggota',
    pin: '4172',
    dreamSchool: 'SMAN 2 (Farmasi Terapan)',
    bio: 'Formulator Kosmetik Berkelanjutan & Herbalis',
    photoUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 27,
    name: 'Annisa Zahra Maharani',
    nickname: 'Zahra',
    gender: 'P',
    role: 'Anggota',
    pin: '3701',
    dreamSchool: 'SMK Keperawatan & Kebidanan',
    bio: 'Perawat Spesialis Unit Gawat Darurat',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 28,
    name: 'Cantika Dwi Lestari',
    nickname: 'Cantika',
    gender: 'P',
    role: 'Anggota',
    pin: '1826',
    dreamSchool: 'SMAN 2 (Hubungan Internasional)',
    bio: 'Penerjemah Konferensi Tingkat Tinggi PBB',
    photoUrl: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 29,
    name: 'Dewi Anggraini Putri',
    nickname: 'Dewi',
    gender: 'P',
    role: 'Anggota',
    pin: '7531',
    dreamSchool: 'SMAN 3 (Psikologi Klinis)',
    bio: 'Psikolog Remaja & Penulis Panduan Kesehatan Mental',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 30,
    name: 'Indah Permata Sari',
    nickname: 'Indah',
    gender: 'P',
    role: 'Anggota',
    pin: '9317',
    dreamSchool: 'SMAN 1 (Ilmu Hukum Konstitusi)',
    bio: 'Hakim Pengadilan Perdata & Pegiat Keadilan Sosial',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 31,
    name: 'Larasati Kusumaningrum',
    nickname: 'Laras',
    gender: 'P',
    role: 'Anggota',
    pin: '8739',
    dreamSchool: 'SMAN 2 (MIPA Biologi Konservasi)',
    bio: 'Peneliti Konservasi Terumbu Karang & Ahli Oseanografi',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 32,
    name: 'Zahrotul Jannah',
    nickname: 'Zahro',
    gender: 'P',
    role: 'Anggota',
    pin: '5409',
    dreamSchool: 'SMKN 3 (Tata Busana & Mode)',
    bio: 'Creative Haute Couture Designer & Kurator Pameran Seni',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
  },
];

// Carousel & Gallery Photos
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Juara 1 Lomba Kebersihan & Kerapian Kelas',
    category: 'Prestasi',
    date: '17 Agu 2026',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
    description: 'Piala bergilir disimpan di etalase kelas IX-H atas kerja keras tim kebersihan dan seluruh 32 siswa!',
  },
  {
    id: 'gal-2',
    title: 'Proyek P5: Taman Sayur Hidroponik Ramah Lingkungan',
    category: 'Kegiatan',
    date: '28 Agu 2026',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    description: 'Pameran kreasi botol bekas dan instalasi hidroponik sayur selada di koridor lantai dua kelas IX-H.',
  },
  {
    id: 'gal-3',
    title: 'Musyawarah & Pelantikan 12 Pengurus Kelas',
    category: 'Rapat',
    date: '20 Jul 2026',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80',
    description: 'Dipimpin langsung oleh Ibu Siti Nur Syamsyiah, menetapkan komitmen iuran kas harian Rp 2.000.',
  },
  {
    id: 'gal-4',
    title: 'Peringatan Hari Guru: Tumpeng Mini & Surat Kasih',
    category: 'Dokumentasi',
    date: '25 Nov 2026',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    description: 'Momen penuh kehangatan saat perwakilan kelas memberikan buket bunga & kartu apresiasi untuk Wali Kelas.',
  },
  {
    id: 'gal-5',
    title: 'Voting Desain Jaket Angkatan & Sablon Emas',
    category: 'Kegiatan',
    date: '02 Sep 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
    description: 'Warna Navy Charcoal terpilih secara bulat dengan tulisan semboyan IX-H di punggung.',
  },
];

// Jadwal Pelajaran (Senin s/d Sabtu)
export const LESSON_SCHEDULES: LessonItem[] = [
  // Senin
  { day: 'Senin', time: '07:00 - 07:45', subject: 'Upacara Bendera', teacher: 'Dewan Guru & Pembina', room: 'Lapangan Utama' },
  { day: 'Senin', time: '07:45 - 09:05', subject: 'Matematika', teacher: 'Drs. Bambang Sudarsono', room: 'Ruang IX-H' },
  { day: 'Senin', time: '09:20 - 10:40', subject: 'Bahasa Indonesia', teacher: 'Siti Aminah, M.Pd.', room: 'Ruang IX-H' },
  { day: 'Senin', time: '10:55 - 12:15', subject: 'Pendidikan Agama Islam', teacher: 'Ust. Ahmad Syafii, S.Ag.', room: 'Masjid Sekolah' },
  { day: 'Senin', time: '12:45 - 14:00', subject: 'PJOK (Olahraga)', teacher: 'Coach Hendra Wijaya', room: 'GOR Utama' },
  // Selasa
  { day: 'Selasa', time: '07:00 - 07:30', subject: 'Literasi Pagi & Doa', teacher: 'Ibu Siti Nur Syamsyiah, S.Pd', room: 'Ruang IX-H' },
  { day: 'Selasa', time: '07:30 - 09:30', subject: 'IPA (Fisika & Biologi)', teacher: 'Ibu Siti Nur Syamsyiah, S.Pd', room: 'Lab IPA Terpadu' },
  { day: 'Selasa', time: '09:45 - 11:45', subject: 'Bahasa Inggris', teacher: 'Miss Jessica Sarah, S.Pd.', room: 'Ruang IX-H' },
  { day: 'Selasa', time: '12:30 - 14:00', subject: 'Informatika & Komputer', teacher: 'Budi Hermawan, S.Kom.', room: 'Lab Komputer 2' },
  // Rabu
  { day: 'Rabu', time: '07:00 - 07:30', subject: 'Bina Karakter / Asmaul Husna', teacher: 'Tim Keagamaan', room: 'Ruang IX-H' },
  { day: 'Rabu', time: '07:30 - 09:30', subject: 'Ilmu Pengetahuan Sosial (IPS)', teacher: 'Drs. Eko Prasetyo', room: 'Ruang IX-H' },
  { day: 'Rabu', time: '09:45 - 11:45', subject: 'Pendidikan Pancasila (PPKn)', teacher: 'Nurhadi, S.Pd.', room: 'Ruang IX-H' },
  { day: 'Rabu', time: '12:30 - 14:00', subject: 'Seni Budaya & Prakarya', teacher: 'Dewi Kusuma, M.Sn.', room: 'Ruang Kesenian' },
  // Kamis
  { day: 'Kamis', time: '07:00 - 07:30', subject: 'Senam Pagi & Pembiasaan', teacher: 'Tim Kesiswaan', room: 'Lapangan' },
  { day: 'Kamis', time: '07:30 - 09:30', subject: 'IPA (Pendalaman Soal)', teacher: 'Ibu Siti Nur Syamsyiah, S.Pd', room: 'Lab IPA' },
  { day: 'Kamis', time: '09:45 - 11:45', subject: 'Matematika Terapan', teacher: 'Drs. Bambang Sudarsono', room: 'Ruang IX-H' },
  { day: 'Kamis', time: '12:30 - 14:00', subject: 'Prakarya Kewirausahaan', teacher: 'Ibu Endang Rahayu, S.Pd.', room: 'Ruang Prakarya' },
  // Jumat
  { day: 'Jumat', time: '07:00 - 07:45', subject: 'Jumat Bersih & Rohani', teacher: 'Wali Kelas & OSIS', room: 'Area Kelas IX-H' },
  { day: 'Jumat', time: '07:45 - 09:15', subject: 'Bahasa Daerah (Jawa)', teacher: 'Pak Gunawan, S.Pd.', room: 'Ruang IX-H' },
  { day: 'Jumat', time: '09:30 - 11:00', subject: 'Bimbingan Konseling (BK)', teacher: 'Dra. Retno Palupi', room: 'Ruang IX-H' },
  // Sabtu
  { day: 'Sabtu', time: '07:00 - 08:30', subject: 'Pramuka & Ekstrakurikuler', teacher: 'Pembina Pramuka', room: 'Lapangan / Aula' },
  { day: 'Sabtu', time: '08:45 - 10:15', subject: 'Pengembangan Minat Bakat', teacher: 'Koordinator Minat', room: 'Ruang IX-H' },
  { day: 'Sabtu', time: '10:30 - 11:30', subject: 'Evaluasi Mingguan & Kebersihan', teacher: 'Ibu Siti Nur Syamsyiah, S.Pd', room: 'Ruang IX-H' },
];

// Jadwal Piket Kebersihan Harian (Senin - Sabtu)
export const PICKET_DUTIES: PicketGroup[] = [
  {
    day: 'Senin',
    studentIds: [1, 2, 3, 4, 5, 6],
    tasks: ['Sapu lantai & pel', 'Hapus papan tulis', 'Rapikan meja guru', 'Buang sampah ke TPS'],
  },
  {
    day: 'Selasa',
    studentIds: [7, 8, 9, 10, 11, 12],
    tasks: ['Sapu lantai & pel', 'Hapus papan tulis', 'Rapikan meja guru', 'Siram tanaman depan'],
  },
  {
    day: 'Rabu',
    studentIds: [13, 14, 15, 16, 17, 18],
    tasks: ['Sapu lantai & pel', 'Hapus papan tulis', 'Rapikan sudut mading', 'Buang sampah ke TPS'],
  },
  {
    day: 'Kamis',
    studentIds: [19, 20, 21, 22, 23, 24],
    tasks: ['Sapu lantai & pel', 'Hapus papan tulis', 'Tata ulang buku perpustakaan mini', 'Kunci jendela'],
  },
  {
    day: 'Jumat',
    studentIds: [25, 26, 27, 28, 29, 30],
    tasks: ['Operasi semut Jumat Bersih', 'Cuci keset & lap kaca', 'Rapikan meja guru', 'Siram tanaman'],
  },
  {
    day: 'Sabtu',
    studentIds: [31, 32, 1, 7, 9, 10],
    tasks: ['Sapu lantai & pel akhir pekan', 'Rapikan kursi & meja', 'Matikan saklar kipas angin', 'Kunci pintu kelas'],
  },
];

// Transaksi Awal Kas Kelas
export const INITIAL_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'TX-101',
    date: '2026-09-01',
    type: 'PEMASUKAN',
    amount: 192000,
    category: 'Setoran Kas Mingguan',
    description: 'Setoran kas minggu pertama September (32 siswa lunas)',
    recordedBy: 'Sabrina (Bendahara 1)',
  },
  {
    id: 'TX-102',
    date: '2026-09-02',
    type: 'PENGELUARAN',
    amount: 35000,
    category: 'Alat Tulis & Papan',
    description: 'Isi ulang 3 botol tinta spidol whiteboard Snowman + 2 penghapus busa',
    recordedBy: 'Afiqa (Bendahara 2)',
  },
  {
    id: 'TX-103',
    date: '2026-09-04',
    type: 'PENGELUARAN',
    amount: 48000,
    category: 'Alat Kebersihan',
    description: 'Beli 2 sapu ijuk gagang kayu & 1 cairan pel aroma lavender',
    recordedBy: 'Aira (Seksi Kebersihan)',
  },
  {
    id: 'TX-104',
    date: '2026-09-08',
    type: 'PEMASUKAN',
    amount: 192000,
    category: 'Setoran Kas Mingguan',
    description: 'Setoran kas minggu kedua September (32 siswa lunas)',
    recordedBy: 'Sabrina (Bendahara 1)',
  },
  {
    id: 'TX-105',
    date: '2026-09-10',
    type: 'PENGELUARAN',
    amount: 50000,
    category: 'Kasus Sosial / Menjenguk',
    description: 'Parsel buah menjenguk teman sekelas yang dirawat demam berdarah',
    recordedBy: 'Wali Kelas & Bendahara',
  },
];

// 8 Dark School Mini Games
export interface GameItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'Logika' | 'Matematika' | 'Memori' | 'Refleks';
  badge: string;
  icon: string;
  description: string;
  highScore: number;
}

export const MINI_GAMES: GameItem[] = [
  {
    id: 'calc',
    name: 'Mental Calculation',
    subtitle: 'Flash Anzan & Hitung Cepat',
    category: 'Matematika',
    badge: 'Populer',
    icon: 'Calculator',
    description: 'Uji akurasi & kecepatan berhitung. Hitung angka yang muncul bergantian di layar!',
    highScore: 85,
  },
  {
    id: 'extreme',
    name: 'Extreme Addition',
    subtitle: 'Tabel Matriks Penjumlahan',
    category: 'Matematika',
    badge: 'Tantangan',
    icon: 'Flame',
    description: 'Jumlahkan semua angka dalam tabel matriks sebelum waktu hitung mundur habis!',
    highScore: 120,
  },
  {
    id: 'grid',
    name: 'Grid Memory',
    subtitle: 'Matriks Visual Spasial',
    category: 'Memori',
    badge: 'Spasial',
    icon: 'Grid',
    description: 'Ingat posisi kotak dalam grid dan cocokkan jawaban dengan mode Normal, Shift, atau Rotasi 90°!',
    highScore: 70,
  },
  {
    id: 'dash',
    name: 'Math Dash',
    subtitle: 'Balapan Lintasan vs AI Bot',
    category: 'Refleks',
    badge: 'Balapan',
    icon: 'Zap',
    description: 'Jawab soal matematika kilat, pacu avatarmu ke garis finish melawan 3 BOT AI!',
    highScore: 95,
  },
  {
    id: 'word',
    name: 'FixWord (Error Hunter)',
    subtitle: 'Pemburu Kata Salah & Typo',
    category: 'Logika',
    badge: 'Detektif',
    icon: 'FileText',
    description: 'Temukan kata yang salah atau typo baku sebelum ceritanya menghilang dari layar!',
    highScore: 80,
  },
  {
    id: 'reflex',
    name: 'Ghost Reflex',
    subtitle: 'Uji Kecepatan Sentuhan (ms)',
    category: 'Refleks',
    badge: 'Milidetik',
    icon: 'Timer',
    description: 'Tunggu sinyal hijau, sentuh layar secepat kilat untuk mencatat waktu refleks milidetik.',
    highScore: 185,
  },
  {
    id: 'oracle',
    name: 'Oracle Sequence',
    subtitle: 'Ikuti Pola Cahaya Mistis',
    category: 'Memori',
    badge: 'Rune',
    icon: 'Sparkles',
    description: 'Ikuti urutan warna rune mistis yang kian bertambah panjang setiap babak.',
    highScore: 8,
  },
];

// Aliases for compatibility
export const MOCK_TRANSACTIONS: CashTransaction[] = INITIAL_TRANSACTIONS;

export const WEEKLY_SCHEDULE: Record<string, LessonItem[]> = {
  Senin: LESSON_SCHEDULES.filter((l) => l.day === 'Senin'),
  Selasa: LESSON_SCHEDULES.filter((l) => l.day === 'Selasa'),
  Rabu: LESSON_SCHEDULES.filter((l) => l.day === 'Rabu'),
  Kamis: LESSON_SCHEDULES.filter((l) => l.day === 'Kamis'),
  Jumat: LESSON_SCHEDULES.filter((l) => l.day === 'Jumat'),
  Sabtu: LESSON_SCHEDULES.filter((l) => l.day === 'Sabtu'),
};

// Initial Attendance Records for Today (and recent days)
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultToday = getTodayDateString();

// Seed initial records for 32 students
const initialRecords: Record<number, AttendanceStatus> = {};
const initialNotes: Record<number, string> = {};

// By default: 30 HADIR, 1 SAKIT, 1 IZIN
for (let i = 1; i <= 32; i++) {
  initialRecords[i] = 'HADIR';
}
initialRecords[14] = 'SAKIT';
initialNotes[14] = 'Surat dokter: demam berdarah ringan';
initialRecords[27] = 'IZIN';
initialNotes[27] = 'Dispensasi lomba olimpiade catur';

export const INITIAL_ATTENDANCE: Record<string, DailyAttendance> = {
  [defaultToday]: {
    date: defaultToday,
    records: initialRecords,
    notes: initialNotes,
    recordedBy: 'Sabrina Nur Salsabila (Sekretaris 1)',
    updatedAt: '07:30',
  },
};

// Hitung Mundur (Countdown) Kelas
export const INITIAL_COUNTDOWNS = [
  {
    id: 'cd-1',
    title: 'Asesmen Sumatif Akhir Jenjang (Ujian Sekolah)',
    targetDate: '2027-05-10T07:30:00',
    description: 'Ujian penentu kelulusan SMP. Persiapkan mental dan belajar bersama!',
    category: 'Ujian' as const,
    active: true,
  },
  {
    id: 'cd-2',
    title: 'Wisuda & Pengumuman Kelulusan Angkatan IX',
    targetDate: '2027-06-18T08:00:00',
    description: 'Momen perayaan pelepasan dan kelulusan 100% siswa kelas IX-H.',
    category: 'Kelulusan' as const,
    active: true,
  },
];

// Buku Paket & Tugas Pembelajaran
export const INITIAL_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Buku Siswa IPA Kelas 9 - Kurikulum Merdeka',
    subject: 'Ilmu Pengetahuan Alam',
    type: 'BUKU_PAKET' as const,
    grade: 'Kelas 9',
    fileUrl: 'https://buku.kemdikbud.go.id/katalog/buku-siswa-ilmu-pengetahuan-alam-kelas-ix',
    fileSize: '14.2 MB',
    description: 'Buku teks utama pembelajaran IPA semester 1 & 2 dari Kemendikbudristek.',
    uploadedAt: '2026-09-01',
    author: 'Ibu Siti Nur Syamsyiah, S.Pd',
  },
  {
    id: 'mat-2',
    title: 'Buku Siswa Matematika Kelas 9',
    subject: 'Matematika',
    type: 'BUKU_PAKET' as const,
    grade: 'Kelas 9',
    fileUrl: 'https://buku.kemdikbud.go.id/katalog/matematika-untuk-smpmts-kelas-ix',
    fileSize: '18.5 MB',
    description: 'Buku pedoman resmi Matematika bab Eksponen, Fungsi Kuadrat, dan Transformasi.',
    uploadedAt: '2026-09-02',
    author: 'Pak Hendra Kusuma, S.Pd',
  },
  {
    id: 'mat-3',
    title: 'Modul Latihan Soal AKM & Literasi Bahasa Indonesia',
    subject: 'Bahasa Indonesia',
    type: 'MODUL' as const,
    grade: 'Kelas 9',
    fileUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=sample.pdf',
    fileSize: '3.8 MB',
    description: 'Kumpulan teks ulasan, pidato persuasif, dan contoh soal asesmen literasi membaca.',
    uploadedAt: '2026-09-10',
    author: 'Ibu Dian Paramita, M.Pd',
  },
  {
    id: 'mat-4',
    title: 'Tugas Projek IPA: Ekosistem & Bioteknologi Sederhana',
    subject: 'IPA (Biologi)',
    type: 'TUGAS' as const,
    grade: 'Kelas 9',
    fileUrl: 'https://example.com/tugas-projek-ipa.pdf',
    fileSize: '1.2 MB',
    description: 'Petunjuk pembuatan laporan fermentasi tape dan tempe berkelompok.',
    uploadedAt: '2026-09-15',
    author: 'Ibu Siti Nur Syamsyiah, S.Pd',
  },
];

// Berita Acara Rapat & Musyawarah Kelas
export const INITIAL_MINUTES = [
  {
    id: 'ba-1',
    title: 'Musyawarah Pemilihan Struktur & Tata Tertib Kelas IX-H',
    date: '2026-08-10',
    time: '13:00 - 14:30 WIB',
    location: 'Ruang Kelas IX-H SMP Negeri 1',
    agenda: 'Penetapan pengurus harian, iuran kas Rp 1.000/hari, dan pembagian jadwal piket.',
    content: 'Telah dilaksanakan musyawarah kelas IX-H dipimpin oleh Wali Kelas. Secara mufakat terpilih Hikmal Syukri sebagai Ketua Kelas dan Rafi Azka sebagai Wakil. Iuran kas harian disepakati sebesar Rp 1.000 per hari aktif belajar untuk kas sosial dan kebersihan.',
    leader: 'Hikmal Syukri Febriyanto',
    notetaker: 'Sabrina Nur Salsabila',
    attendeesCount: 32,
    decisions: [
      'Menetapkan 12 pengurus inti kelas IX-H.',
      'Tarif kas harian resmi Rp 1.000 / hari aktif sekolah.',
      'Jadwal piket harian dibagi 6 regu kerja Senin s.d. Sabtu.',
    ],
    createdAt: '2026-08-10T15:00:00',
  },
  {
    id: 'ba-2',
    title: 'Rapat Persiapan Classmeeting & Dekorasi Mading Kelas',
    date: '2026-09-05',
    time: '14:00 - 15:15 WIB',
    location: 'Ruang Kelas IX-H',
    agenda: 'Persiapan mading tematik kemerdekaan dan keikutsertaan lomba futsal/voli antar kelas.',
    content: 'Rapat koordinasi perwakilan seksi olahraga, seni, dan kebersihan. Disepakati alokasi dana kas sebesar Rp 120.000 untuk pembelian kertas origami, spidol posca, dan konsumsi kontingen lomba kelas.',
    leader: 'Rafi Azka Zaidan',
    notetaker: 'Fauzan Rizqi Ardiansyah',
    attendeesCount: 28,
    decisions: [
      'Pendaftaran tim futsal dan tim catur kelas IX-H.',
      'Pencairan dana kas Rp 120.000 untuk atribut kelas.',
    ],
    createdAt: '2026-09-05T16:00:00',
  },
];

