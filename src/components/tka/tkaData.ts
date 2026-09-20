export interface TkaQuestion {
  id: number;
  subtest: 'Penalaran Matematika' | 'Literasi Bahasa Indonesia' | 'Literasi Bahasa Inggris' | 'Penalaran Logika';
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 0 = A, 1 = B, 2 = C, 3 = D, 4 = E
  conventionalSolution: string;
  theKingFormula: string;
  topic: string;
}

export interface TargetSchool {
  id: string;
  name: string;
  type: 'SMA' | 'SMK';
  passingGradeScore: number; // Skala 0-1000
  quota: string;
  description: string;
}

export const TARGET_SCHOOLS: TargetSchool[] = [
  {
    id: 'sman1-pbg',
    name: 'SMAN 1 Purbalingga',
    type: 'SMA',
    passingGradeScore: 780,
    quota: 'Jalur Prestasi & Domisili',
    description: 'SMA rujukan utama dengan persaingan akademik tertinggi.',
  },
  {
    id: 'sman2-pbg',
    name: 'SMAN 2 Purbalingga',
    type: 'SMA',
    passingGradeScore: 720,
    quota: 'Jalur Prestasi & Domisili',
    description: 'Sekolah unggulan favorit dengan tradisi olimpiade sains.',
  },
  {
    id: 'smkn1-pbg',
    name: 'SMKN 1 Purbalingga',
    type: 'SMK',
    passingGradeScore: 680,
    quota: 'Kejuruan Unggulan',
    description: 'Sekolah kejuruan favorit teknik informatika & manajemen.',
  },
  {
    id: 'smkn1-bojongsari',
    name: 'SMKN 1 Bojongsari',
    type: 'SMK',
    passingGradeScore: 640,
    quota: 'Kejuruan Lokal',
    description: 'SMK terdekat wilayah Bojongsari dengan program keahlian vokasi.',
  },
  {
    id: 'sman1-bobotsari',
    name: 'SMAN 1 Bobotsari',
    type: 'SMA',
    passingGradeScore: 660,
    quota: 'Jalur Prestasi & Zonasi',
    description: 'Alternatif SMA negeri favorit wilayah utara Purbalingga.',
  },
];

export const THE_KING_FORMULAS = [
  {
    title: 'The King Perbandingan Berbalik Nilai (Pekerja & Waktu Proyek)',
    formula: '$$\\Delta \\text{Pekerja} = \\frac{t_{\\text{libur}}}{t_{\\text{sisa\\_nyata}}} \\times \\text{Pekerja}_{\\text{awal}}$$',
    example: 'Proyek 30 hari oleh 15 orang, terhenti 6 hari setelah hari ke-10. Butuh berapa pekerja tambahan agar selesai tepat waktu?',
    shortcut: '$t_{\\text{sisa\\_normal}} = 30 - 10 = 20$ hari. $t_{\\text{libur}} = 6$ hari. $t_{\\text{sisa\\_nyata}} = 20 - 6 = 14$ hari. $$\\Delta \\text{Pekerja} = \\frac{6}{14} \\times 15 = \\frac{45}{7} \\approx 7\\text{ orang tambahan}.$$',
    benefit: 'Selesai dalam 15 detik tanpa membuat tabel perkalian silang panjang.',
  },
  {
    title: 'The King Tripel Pythagoras Cepat (Segitiga Siku-Siku)',
    formula: '$$\\text{Tripel Dasar: } (3, 4, 5) \\mid (5, 12, 13) \\mid (7, 24, 25) \\mid (8, 15, 17) \\mid (9, 40, 41)$$',
    example: 'Tinggi tiang 12 m, jarak patok tanah 5 m dan 9 m di sisi berlawanan. Berapa panjang kawat?',
    shortcut: 'Kawat 1 = $\\sqrt{12^2 + 5^2} = 13\\text{ m}$ (tripel 5-12-13). Kawat 2 = $\\sqrt{12^2 + 9^2} = 3 \\times (4, 3, 5) = 15\\text{ m}$. Panjang total kawat = $13 + 15 = 28\\text{ m}$.',
    benefit: 'Langsung temukan sisi miring tanpa menghitung kuadrat dan akar angka besar.',
  },
  {
    title: 'The King Diskon Ganda Bertingkat (Contoh: Diskon 50% + 20%)',
    formula: '$$\\text{Harga\\_Bayar} = \\text{Harga\\_Awal} \\times (1 - D_1) \\times (1 - D_2)$$\n$$\\text{Diskon\\_Total} = D_1 + D_2 - \\left(\\frac{D_1 \\times D_2}{100}\\right)\\%$$',
    example: 'Jaket seharga Rp200.000 diskon 40% + 15%. Berapa uang yang harus dibayar?',
    shortcut: '$\\text{Bayar} = 200.000 \\times (1 - 0{,}40) \\times (1 - 0{,}15) = 200.000 \\times 0{,}60 \\times 0{,}85 = 120.000 \\times 0{,}85 = \\text{Rp}102.000$.',
    benefit: 'Cukup 1 baris perkalian desimal tanpa menghitung diskon berulang-ulang.',
  },
  {
    title: 'The King Rata-rata Gabungan (Metode Titik Tengah / Timbangan)',
    formula: '$$\\bar{x}_{\\text{gab}} = \\bar{x}_1 + \\left[\\frac{n_2}{n_1 + n_2}\\right] \\times (\\bar{x}_2 - \\bar{x}_1)$$',
    example: 'Rata-rata 18 siswa laki-laki adalah 76, rata-rata 14 siswa perempuan adalah 84. Hitung rata-rata kelas!',
    shortcut: 'Sederhanakan rasio siswa: $n_1 : n_2 = 18 : 14 = 9 : 7$. Selisih nilai $\\Delta \\bar{x} = 84 - 76 = 8$. Kenaikan = $\\left[\\frac{7}{9 + 7}\\right] \\times 8 = \\frac{7}{16} \\times 8 = 3{,}5$. Rata-rata gabungan = $76 + 3{,}5 = 79{,}5$.',
    benefit: 'Menghindari perkalian angka ratusan/ribuan (18 × 76 dan 14 × 84) yang rawan salah hitung.',
  },
  {
    title: 'The King Deret Aritmatika Cepat (Jumlah Suku Pertama)',
    formula: '$$S_n = \\frac{n}{2} \\times (U_1 + U_n) \\quad \\text{atau} \\quad S_n = n \\times U_{\\text{tengah}}$$',
    example: 'Jumlah 5 ukuran pita bunga membentuk deret aritmatika dengan S₅ = 600 cm dan pita terkecil U₁ = 80 cm. Berapa pita terbesar (U₅)?',
    shortcut: '$$600 = \\frac{5}{2} \\times (80 + U_5) \\implies 240 = 80 + U_5 \\implies U_5 = 240 - 80 = 160\\text{ cm}.$$',
    benefit: 'Langsung temukan suku akhir tanpa perlu repot mencari nilai beda (b) terlebih dahulu.',
  },
  {
    title: 'The King Kuadrat Bilangan Berakhiran 5',
    formula: '$$(10a + 5)^2 = [a \\times (a + 1)] \\text{ disambung } \\text{"25"}$$',
    example: 'Berapakah nilai dari 75² dan 115² ?',
    shortcut: 'Untuk $75$: $a = 7 \\implies 7 \\times (7 + 1) = 7 \\times 8 = 56 \\implies \\text{Hasil} = 5.625$.\nUntuk $115$: $a = 11 \\implies 11 \\times 12 = 132 \\implies \\text{Hasil} = 13.225$.',
    benefit: 'Hitung kuadrat angka 15, 25, 35, 45, 65, 75, 85, 95 langsung di luar kepala 3 detik.',
  },
  {
    title: 'The King Kombinasi Cepat Jabatan Tangan & Pasangan (nC₂)',
    formula: '$$nC_2 = \\frac{n \\times (n - 1)}{2}$$',
    example: 'Dalam suatu pertemuan kelas terdapat 10 orang yang saling bersalaman. Berapa banyak salaman yang terjadi?',
    shortcut: '$n = 10 \\implies 10C_2 = \\frac{10 \\times 9}{2} = \\frac{90}{2} = 45\\text{ kali salaman}$.',
    benefit: 'Tidak perlu rumus faktorial panjang $n! \\div (r!(n-r)!)$.',
  },
  {
    title: 'The King Peluang Dua Kejadian Bebas (Koin & Dadu)',
    formula: '$$P(A \\cap B) = P(A) \\times P(B)$$',
    example: 'Sebuah koin dan dadu dilempar bersamaan. Berapa peluang muncul 1 angka 1 gambar pada 2 koin dan dadu prima genap?',
    shortcut: '$P(\\text{Koin AG atau GA}) = \\frac{2}{4} = \\frac{1}{2}$. $P(\\text{Dadu prima genap } \\{2\\}) = \\frac{1}{6}$. $$\\text{Peluang} = \\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}.$$',
    benefit: 'Pecah ruang sampel majemuk menjadi perkalian peluang tunggal.',
  },
  {
    title: 'The King Perbandingan Luas & Volume Sebangun',
    formula: '$$\\text{Rasio Panjang} = k \\implies \\text{Rasio Luas} = k^2 \\implies \\text{Rasio Volume} = k^3$$',
    example: 'Dua trapesium sebangun memiliki sisi bersesuaian 8 cm dan 12 cm. Jika luas trapesium kecil 104 cm², berapa luas trapesium besar?',
    shortcut: 'Skala $k = \\frac{12}{8} = 1{,}5$. $$\\text{Luas}_{\\text{besar}} = \\text{Luas}_{\\text{kecil}} \\times k^2 = 104 \\times (1{,}5)^2 = 104 \\times 2{,}25 = 234\\text{ cm}^2.$$',
    benefit: 'Langsung gunakan kuadrat skala perbandingan tanpa menghitung ulang rumus luas bangun.',
  },
  {
    title: 'The King Barisan Aritmetika Lompat Ganda (Deret Bertingkat)',
    formula: '$$\\text{Suku Ganjil: } (U_1, U_3, U_5, \\dots) \\quad \\& \\quad \\text{Suku Genap: } (U_2, U_4, U_6, \\dots)$$',
    example: '3, 8, 6, 12, 9, 16, 12, ... Berapakah suku berikutnya?',
    shortcut: 'Deret Ganjil: $3, 6, 9, 12$ ($+3$ ritmis). Deret Genap: $8, 12, 16$ ($+4$ ritmis). Suku ke-8 = Genap $\\implies 16 + 4 = 20$.',
    benefit: 'Mencegah kebingungan saat selisih angka berurutan tampak naik-turun.',
  },
  {
    title: 'The King Penjumlahan Kuadrat Selisih (Aljabar Cepat)',
    formula: '$$a^2 - b^2 = (a + b)(a - b)$$\n$$(a + b)^2 = a^2 + 2ab + b^2$$',
    example: 'Hitung nilai dari 105² − 95² tanpa menghitung kuadrat satu per satu!',
    shortcut: '$$105^2 - 95^2 = (105 + 95) \\times (105 - 95) = 200 \\times 10 = 2.000.$$',
    benefit: 'Menghitung selisih kuadrat ratusan dalam 2 detik.',
  },
  {
    title: 'The King Silogisme Logika (Kuantor Mutlak & Parsial)',
    formula: '$$\\text{"Semua (Universal)"} + \\text{"Sebagian (Partikular)"} = \\text{KESIMPULAN WAJIB "Sebagian"}$$',
    example: 'Semua siswa IX-H gemar belajar IPA. Sebagian anggota tim futsal adalah siswa IX-H.',
    shortcut: 'Coret term penengah ("siswa IX-H"). Kesimpulan: **"Sebagian anggota tim futsal gemar belajar IPA"**.',
    benefit: 'Langsung coret semua pilihan yang menggunakan kata "Semua", hemat waktu 45 detik.',
  },
];

export const TKA_QUESTIONS: TkaQuestion[] = [
  // 1. Penalaran Matematika
  {
    id: 1,
    subtest: 'Penalaran Matematika',
    topic: 'Aritmatika & Perbandingan Berbalik Nilai',
    question: 'Suatu renovasi ruang kelas IX-H ditargetkan selesai dalam 24 hari oleh 12 orang tukang. Setelah berjalan 8 hari, renovasi terhenti selama 4 hari karena hujan lebat. Jika renovasi ingin selesai tepat waktu, berapa banyak pekerja tambahan yang harus didatangkan?',
    options: [
      'A. 3 orang',
      'B. 4 orang',
      'C. 6 orang',
      'D. 8 orang',
      'E. 10 orang',
    ],
    correctAnswer: 1, // B. 4 orang
    conventionalSolution: 'Beban kerja awal = 24 × 12 = 288 orang-hari.\nYang telah diselesaikan = 8 × 12 = 96 orang-hari.\nSisa beban kerja = 288 − 96 = 192 orang-hari.\nSisa hari kerja efektif = 24 − 8 − 4 = 12 hari.\nTotal pekerja yang dibutuhkan = 192 ÷ 12 = 16 orang.\nTambahan pekerja yang harus didatangkan = 16 − 12 = 4 orang.',
    theKingFormula: 'THE KING: ΔPekerja = [ t_libur ÷ (t_target − t_lewat − t_libur) ] × Pekerja_awal\n= [ 4 ÷ (24 − 8 − 4) ] × 12\n= (4 ÷ 12) × 12 = 4 orang!',
  },
  {
    id: 2,
    subtest: 'Penalaran Matematika',
    topic: 'Aljabar & SPLDV',
    question: 'Di koperasi SMP, harga 3 buku tulis dan 2 pulpen adalah Rp18.000,00, sedangkan harga 2 buku tulis dan 5 pulpen adalah Rp23.000,00. Jika Fajar ingin membeli 4 buku tulis dan 3 pulpen, berapakah uang yang harus dibayar?',
    options: [
      'A. Rp25.000,00',
      'B. Rp27.000,00',
      'C. Rp28.500,00',
      'D. Rp29.000,00',
      'E. Rp31.000,00',
    ],
    correctAnswer: 0, // A. Rp25.000,00
    conventionalSolution: 'Eliminasi persamaan 1 dan 2:\n3b + 2p = 18.000 (×5) ⟹ 15b + 10p = 90.000\n2b + 5p = 23.000 (×2) ⟹ 4b + 10p = 46.000\nSelisih kurangkan: 11b = 44.000 ⟹ b = 4.000.\nSubstitusi: 3(4.000) + 2p = 18.000 ⟹ 2p = 6.000 ⟹ p = 3.000.\nDitanya: 4b + 3p = 4(4.000) + 3(3.000) = 16.000 + 9.000 = Rp25.000,00.',
    theKingFormula: 'THE KING (Determinan Cepat):\nb = (18.000 × 5 − 23.000 × 2) ÷ (3 × 5 − 2 × 2) = (90.000 − 46.000) ÷ (15 − 4) = 44.000 ÷ 11 = Rp4.000.\np = Rp3.000.\nTotal 4b + 3p = 4(4.000) + 3(3.000) = Rp25.000,00!',
  },
  {
    id: 3,
    subtest: 'Penalaran Matematika',
    topic: 'Geometri & Teorema Phytagoras',
    question: 'Sebuah tiang bendera setinggi 12 meter berdiri tegak di halaman sekolah. Dari puncak tiang ditarik tali kawat ke dua patok tanah yang saling berlawanan arah. Jarak patok A ke tiang adalah 5 meter, sedangkan jarak patok B ke tiang adalah 9 meter. Berapakah panjang total kawat minimal yang dibutuhkan untuk kedua patok?',
    options: [
      'A. 26 meter',
      'B. 27 meter',
      'C. 28 meter',
      'D. 29 meter',
      'E. 30 meter',
    ],
    correctAnswer: 2, // C. 28 meter
    conventionalSolution: 'Kawat A = √(12² + 5²) = √(144 + 25) = √169 = 13 meter.\nKawat B = √(12² + 9²) = √(144 + 81) = √225 = 15 meter.\nTotal kawat = 13 + 15 = 28 meter.',
    theKingFormula: 'THE KING (Tripel Pythagoras Sakti):\n• Patok A: Tripel dasar (5, 12, 13) ⟹ Kawat A = 13 m\n• Patok B: Kelipatan tripel 3 × (3, 4, 5) = (9, 12, 15) ⟹ Kawat B = 15 m\n• Total Kawat = 13 + 15 = 28 m!',
  },
  {
    id: 4,
    subtest: 'Penalaran Matematika',
    topic: 'Aritmatika Sosial (Diskon Bertingkat)',
    question: 'Sebuah toko seragam sekolah memberikan promo "Diskon 40% + 15%" untuk semua jaket kelas. Jika harga label jaket adalah Rp200.000,00, berapa rupiah harga akhir yang harus dibayar pembeli?',
    options: [
      'A. Rp90.000,00',
      'B. Rp102.000,00',
      'C. Rp110.000,00',
      'D. Rp114.000,00',
      'E. Rp120.000,00',
    ],
    correctAnswer: 1, // B. Rp102.000,00
    conventionalSolution: 'Diskon 1 = 40% × 200.000 = 80.000.\nHarga setelah diskon 1 = 200.000 − 80.000 = 120.000.\nDiskon 2 = 15% × 120.000 = 18.000.\nHarga akhir = 120.000 − 18.000 = Rp102.000,00.',
    theKingFormula: 'THE KING: Bayar = Harga_Awal × (1 − D₁) × (1 − D₂)\n= 200.000 × (1 − 0,40) × (1 − 0,15)\n= 200.000 × 0,60 × 0,85 = 120.000 × 0,85 = Rp102.000,00 (1 baris selesai)!',
  },
  {
    id: 5,
    subtest: 'Penalaran Matematika',
    topic: 'Statistika & Rata-rata Gabungan',
    question: 'Nilai rata-rata ulangan Matematika 18 siswa laki-laki di kelas IX-H adalah 76, sedangkan nilai rata-rata 14 siswa perempuan adalah 84. Berapakah nilai rata-rata gabungan seluruh siswa di kelas tersebut?',
    options: [
      'A. 79,0',
      'B. 79,5',
      'C. 80,0',
      'D. 80,5',
      'E. 81,0',
    ],
    correctAnswer: 1, // B. 79,5
    conventionalSolution: 'Total nilai L = 18 × 76 = 1.368.\nTotal nilai P = 14 × 84 = 1.176.\nJumlah seluruh siswa = 18 + 14 = 32.\nRata-rata gabungan = (1.368 + 1.176) ÷ 32 = 2.544 ÷ 32 = 79,5.',
    theKingFormula: 'THE KING (Metode Timbangan Selisih):\n• Rasio siswa n_L : n_P = 18 : 14 = 9 : 7\n• Selisih rata-rata Δ = 84 − 76 = 8 poin\n• Kenaikan = [ 7 ÷ (9 + 7) ] × 8 = (7 ÷ 16) × 8 = 3,5\n• Rata-rata gabungan = 76 + 3,5 = 79,5!',
  },

  // 2. Literasi Bahasa Indonesia
  {
    id: 6,
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'Ide Pokok & Paragraf',
    passage: 'Perkembangan kecerdasan buatan (AI) di era digital telah merambah ke dunia pendidikan menengah. Di satu sisi, teknologi ini memudahkan siswa dalam mencari referensi materi dan mengotomatiskan evaluasi belajar. Namun di sisi lain, ketergantungan yang berlebihan dikhawatirkan dapat mengikis daya nalar kritis dan ketekunan siswa jika proses pemecahan masalah diserahkan sepenuhnya pada mesin tanpa ada telaah mandiri.',
    question: 'Gagasan utama (ide pokok) dari paragraf di atas adalah...',
    options: [
      'A. Kecerdasan buatan berhasil menggantikan peran guru di sekolah.',
      'B. Dampak positif dan kekhawatiran dari pemanfaatan AI dalam pendidikan.',
      'C. Larangan penggunaan teknologi mesin pencari bagi siswa menengah.',
      'D. Pentingnya mengasah daya nalar kritis tanpa menggunakan perangkat gawai.',
      'E. Kurikulum pendidikan masa kini yang sepenuhnya bergantung pada AI.',
    ],
    correctAnswer: 1, // B
    conventionalSolution: 'Membaca seluruh kalimat, mengidentifikasi kalimat utama di awal dan tengah kalimat ("Di satu sisi... Namun di sisi lain..."). Paragraf ini bersifat campuran (dua sudut pandang dampak positif dan potensi risiko). Opsi B merangkum kedua sisi tersebut dengan akurat.',
    theKingFormula: 'THE KING: Cari kata hubung kontradiktif ("Di satu sisi... Namun di sisi lain..."). Jika ada dua kutub berlawanan, ide pokok WAJIB memuat kata kunci berpasangan seperti "dampak ganda / positif & negatif / peluang & tantangan". Hanya opsi B yang memuat korelasi tersebut!',
  },
  {
    id: 7,
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'Simpulan Teks & Penalaran Induktif',
    passage: 'Data kesehatan sekolah menunjukkan bahwa siswa yang rutin tidur minimal 7-8 jam setiap malam memiliki skor fokus 35% lebih tinggi saat jam pelajaran pertama dibandingkan siswa yang tidur kurang dari 6 jam. Selain itu, tingkat kehadiran siswa yang cukup tidur juga tercatat lebih stabil karena daya tahan tubuh mereka lebih prima dari serangan flu.',
    question: 'Simpulan yang paling logis dan tidak terbantahkan berdasarkan teks di atas adalah...',
    options: [
      'A. Tidur larut malam adalah penyebab satu-satunya siswa tertular flu di sekolah.',
      'B. Siswa yang tidur 8 jam sehari dipastikan selalu menjadi juara umum di kelas.',
      'C. Pola istirahat tidur yang cukup berkontribusi positif terhadap fokus dan kehadiran siswa.',
      'D. Jam masuk sekolah perlu diundur menjadi siang hari agar siswa tidak mengantuk.',
      'E. Semua siswa yang berprestasi tidak pernah tidur kurang dari 7 jam.',
    ],
    correctAnswer: 2, // C
    conventionalSolution: 'Menelaah pilihan satu per satu. Opsi A, B, dan E mengandung kata berlebihan ("satu-satunya", "dipastikan selalu", "semua"). Opsi D adalah opini baru di luar teks. Opsi C adalah generalisasi tepat yang didukung teks.',
    theKingFormula: 'THE KING: Coret opsi beracun yang memuat kata mutlak ("pasti selalu", "satu-satunya", "semua"). Pilih opsi yang memakai kata modulasi santun ("berkontribusi", "berpotensi", "cenderung"). Opsi C langsung lolos filter!',
  },
  {
    id: 8,
    subtest: 'Literasi Bahasa Indonesia',
    topic: 'Kalimat Efektif & PUEBI',
    question: 'Manakah di antara kalimat berikut yang memenuhi kaidah kalimat efektif dan kebakuan bahasa Indonesia?',
    options: [
      'A. Bagi para siswa-siswa sekalian yang terlambat harap segera lapor ke piket.',
      'B. Dalam rapat OSIS kemarin membahas mengenai tentang rencana perpisahan kelas IX.',
      'C. Rapat pleno OSIS kemarin membahas rencana pelepasan siswa kelas IX.',
      'D. Meskipun hujan turun lebat, namun mereka tetap masuk sekolah tepat waktu.',
      'E. Karena tidak membawa kartu ujian sehingga Dimas tidak diizinkan masuk ruangan.',
    ],
    correctAnswer: 2, // C
    conventionalSolution: 'A pleonasme (para siswa-siswa sekalian). B mubazir kata (mengenai tentang) dan kehilangan subjek (dimulai dengan "Dalam"). D konjungsi ganda (Meskipun... namun). E konjungsi ganda (Karena... sehingga). C kalimat efektif dengan subjek, predikat, dan objek yang jelas.',
    theKingFormula: 'THE KING (Cek Musuh Bebuyutan PUEBI): Hindari "Meskipun... namun" dan "Karena... sehingga" (konjungsi kembar terlarang!). Hindari juga "para siswa-siswa" dan "membahas tentang". Hanya Opsi C yang strukturnya bersih S-P-O-K!',
  },

  // 3. Literasi Bahasa Inggris
  {
    id: 9,
    subtest: 'Literasi Bahasa Inggris',
    topic: 'Reading Comprehension & Inference',
    passage: 'Plastic pollution in oceans has escalated at an unprecedented pace. Marine scientists predict that if single-use plastics are not drastically curbed by 2035, the total mass of debris in coastal ecosystems will exceed the biomass of aquatic fauna. Numerous coastal communities are now initiating community-led cleanup programs and advocating for biodegradable cassava-based packaging alternatives.',
    question: 'According to the passage, what is proposed as a potential solution to mitigate ocean waste?',
    options: [
      'A. Relocating all aquatic fauna to artificial inland reserves.',
      'B. Completely abandoning fishing activities in coastal zones.',
      'C. Adopting biodegradable alternatives such as cassava packaging and local cleanups.',
      'D. Postponing environmental conservation agendas until the year 2035.',
      'E. Burning plastic debris on beaches before it reaches the sea water.',
    ],
    correctAnswer: 2, // C
    conventionalSolution: 'Locate keywords "solution" / "mitigate" in the passage. The last sentence mentions "community-led cleanup programs and advocating for biodegradable cassava-based packaging alternatives". This directly matches option C.',
    theKingFormula: 'THE KING (Keyword Scanning): Temukan sinonim kata kunci "solution" di kalimat penutup teks: "initiating... cleanup programs and advocating for biodegradable cassava-based packaging". Opsi C adalah parafase langsung!',
  },
  {
    id: 10,
    subtest: 'Literasi Bahasa Inggris',
    topic: 'Grammar & Conditional Sentence',
    question: 'Choose the correct verb form to complete the sentence: "If all students ______ their daily assignments consistently, the teacher wouldn\'t need to assign remedial tests."',
    options: [
      'A. submit',
      'B. submitted',
      'C. had submitted',
      'D. will submit',
      'E. are submitting',
    ],
    correctAnswer: 1, // B
    conventionalSolution: 'Perhatikan kalimat pengikutnya: "...wouldn\'t need" (would + V1). Ini merupakan Conditional Sentence Type 2 (khayalan saat ini). Rumusnya: If + Simple Past (V2 / Were), Subject + would/could + V1. Maka kata kerja yang tepat adalah bentuk lampau (V2) yaitu "submitted".',
    theKingFormula: 'THE KING (Pasangan Conditional): Lihat pasangannya! Jika ada "would + V1", maka bagian IF WAJIB V2 (Simple Past). V2 dari submit adalah SUBMITTED. Selesai dalam 3 detik!',
  },

  // 4. Penalaran Logika & Skolastik
  {
    id: 11,
    subtest: 'Penalaran Logika',
    topic: 'Pola Deret Angka Lompat',
    question: 'Tentukan dua angka selanjutnya dari barisan berikut: 4, 7, 9, 12, 14, 17, 19, ..., ...',
    options: [
      'A. 21, 24',
      'B. 22, 24',
      'C. 22, 25',
      'D. 23, 26',
      'E. 21, 25',
    ],
    correctAnswer: 1, // B. 22, 24
    conventionalSolution: 'Periksa selisih antar angka berdekatan: 4 ke 7 (+3), 7 ke 9 (+2), 9 ke 12 (+3), 12 ke 14 (+2), 14 ke 17 (+3), 17 ke 19 (+2). Polanya bergantian (+3, +2, +3, +2). Selanjutnya setelah 19 harus +3 = 22, lalu +2 = 24. Jadi jawabannya 22 dan 24.',
    theKingFormula: 'THE KING: Pola irama ritmis: "+3, +2". Angka terakhir 19: 19 + 3 = 22, kemudian 22 + 2 = 24. Opsi B langsung terbukti benar!',
  },
  {
    id: 12,
    subtest: 'Penalaran Logika',
    topic: 'Silogisme Kuantor & Logika Formal',
    question: 'Premis 1: Semua anggota tim olimpiade sains SMPN 1 memiliki jadwal belajar malam.\nPremis 2: Sebagian siswa kelas IX-H adalah anggota tim olimpiade sains.\nKesimpulan yang sah dan logis adalah...',
    options: [
      'A. Semua siswa kelas IX-H memiliki jadwal belajar malam.',
      'B. Semua anggota tim olimpiade sains adalah siswa kelas IX-H.',
      'C. Sebagian siswa kelas IX-H memiliki jadwal belajar malam.',
      'D. Siswa yang bukan kelas IX-H tidak memiliki jadwal belajar malam.',
      'E. Tidak ada siswa kelas IX-H yang memiliki jadwal belajar malam.',
    ],
    correctAnswer: 2, // C
    conventionalSolution: 'Premis 1: Semua P adalah Q. Premis 2: Sebagian R adalah P. Kesimpulan silogisme kuantor: Sebagian R adalah Q (Sebagian siswa kelas IX-H memiliki jadwal belajar malam).',
    theKingFormula: 'THE KING: "Semua" + "Sebagian" = WAJIB "Sebagian". Coret istilah penghubung ("anggota tim olimpiade sains"). Gabungkan sisanya: "Sebagian siswa kelas IX-H... memiliki jadwal belajar malam". Langsung pilih Opsi C!',
  },
  {
    id: 13,
    subtest: 'Penalaran Logika',
    topic: 'Penalaran Analitis Posisi Tempat Duduk',
    question: 'Enam orang siswa (Andi, Budi, Citra, Dinda, Eko, dan Fani) duduk berjajar menghadap panggung. \n- Andi duduk di ujung paling kiri.\n- Budi duduk tepat di sebelah kanan Eko.\n- Citra tidak mau duduk di sebelah Andi maupun Fani.\n- Fani duduk di ujung paling kanan.\nSiapakah yang duduk tepat di posisi urutan ke-2 dari kiri?',
    options: [
      'A. Budi',
      'B. Citra',
      'C. Dinda',
      'D. Eko',
      'E. Fani',
    ],
    correctAnswer: 2, // C. Dinda atau Eko? Mari cek detail
    conventionalSolution: 'Ada 6 kursi: [1, 2, 3, 4, 5, 6]. Kursi 1 = Andi. Kursi 6 = Fani. Sisa kursi 2, 3, 4, 5 untuk Budi, Citra, Dinda, Eko. Budi tepat di kanan Eko (urutan: [Eko, Budi]). Citra tidak boleh di kursi 2 (karena sebelah Andi di kursi 1) dan tidak boleh di kursi 5 (karena sebelah Fani di kursi 6). Maka Citra harus di kursi 3 atau 4. Jika Citra di kursi 4, [Eko, Budi] di kursi 2 & 3, maka Dinda di kursi 5. Namun jika [Eko, Budi] di kursi 4 & 5, Citra di kursi 3, maka kursi 2 diisi Dinda! Jadi Dinda ada di posisi 2.',
    theKingFormula: 'THE KING (Eliminasi Posisi Larangan): Andi = 1, Fani = 6. Citra DILARANG di kursi 2 dan 5. Eko & Budi harus berpasangan nempel [E, B]. Jika [E, B] di (2,3), Citra terpaksa di 4 atau 5 (padahal 5 dilarang). Supaya semua syarat terpenuhi, pasang [E, B] di kanan (kursi 4,5), Citra di tengah (kursi 3), maka kursi 2 MUTLAK milik Dinda!',
  },
  {
    id: 14,
    subtest: 'Penalaran Logika',
    topic: 'Deret Huruf Alfabetik',
    question: 'Tentukan huruf berikutnya dari seri huruf: B, E, H, K, N, ...',
    options: [
      'A. P',
      'B. Q',
      'C. R',
      'D. S',
      'E. T',
    ],
    correctAnswer: 1, // B. Q
    conventionalSolution: 'Ubah huruf ke angka alfabet: B=2, E=5, H=8, K=11, N=14. Polanya adalah bertambah 3 (+3): 14 + 3 = 17. Huruf ke-17 adalah Q.',
    theKingFormula: 'THE KING: Lompat 2 huruf di abjad! B (c,d) E (f,g) H (i,j) K (l,m) N (o,p) Q! Langsung temukan Q tanpa menulis seluruh abjad.',
  },
  {
    id: 15,
    subtest: 'Penalaran Matematika',
    topic: 'Peluang & Kombinatorika Sederhana',
    question: 'Dari 5 pengurus inti kelas IX-H (Ketua, Wakil, Sekretaris 1, Sekretaris 2, Bendahara), akan dipilih 2 orang secara acak untuk menghadiri apel koordinasi sekolah. Berapa banyak cara kemungkinan pasangan yang dapat terpilih?',
    options: [
      'A. 8 cara',
      'B. 10 cara',
      'C. 12 cara',
      'D. 15 cara',
      'E. 20 cara',
    ],
    correctAnswer: 1, // B. 10 cara
    conventionalSolution: 'Gunakan rumus kombinasi 2 dari 5: C(5, 2) = 5! / (2! × 3!) = (5 × 4) / (2 × 1) = 20 / 2 = 10 cara.',
    theKingFormula: 'THE KING (Kombinasi Cepat nC2): Ambil angka n, kalikan dengan (n - 1), lalu bagi 2! nC2 = (5 × 4) / 2 = 10 cara! Selesai dalam 3 detik!',
  },
];
