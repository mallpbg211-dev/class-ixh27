import { TkaChapter, TkaQuestion, TkaSubject } from './tkaTypes';

export const TKA_CHAPTERS: TkaChapter[] = [
  // IPA
  {
    id: 'IPA_BAB_1',
    subject: 'IPA',
    number: 'Bab 1',
    title: 'Biologi Manusia',
    description: 'Sistem Koordinasi, Sistem Reproduksi, dan Homeostasis',
  },
  {
    id: 'IPA_BAB_2',
    subject: 'IPA',
    number: 'Bab 2',
    title: 'Tekanan Zat',
    description: 'Konsep Tekanan, Zat Padat, Zat Cair, Zat Gas, Tekanan Makhluk Hidup & Percobaan',
  },
  {
    id: 'IPA_BAB_3',
    subject: 'IPA',
    number: 'Bab 3',
    title: 'Kelistrikan',
    description: 'Gejala Listrik Statis, Listrik Dinamis, Rangkaian Sederhana & Pemecahan Masalah',
  },
  {
    id: 'IPA_BAB_4',
    subject: 'IPA',
    number: 'Bab 4',
    title: 'Kemagnetan & Energi Ramah Lingkungan',
    description: 'Sifat Magnet, Kemagnetan Bumi, Elektromagnetik & Induksi, Energi Listrik Hijau',
  },

  // Bahasa Indonesia
  {
    id: 'BINDO_BAB_1',
    subject: 'B_INDO',
    number: 'Bab 1',
    title: 'Teks Deskripsi',
    description: 'Isi Teks, Sudut Pandang, Kosakata Serapan, Kohesi & Koherensi Kalimat',
  },
  {
    id: 'BINDO_BAB_2',
    subject: 'B_INDO',
    number: 'Bab 2',
    title: 'Teks Prosedur',
    description: 'Mengubah Cerpen jadi Prosedur, Penyerapan Kosakata, Infografik, Poster & Wawancara',
  },
  {
    id: 'BINDO_BAB_3',
    subject: 'B_INDO',
    number: 'Bab 3',
    title: 'Teks Rekon',
    description: 'Informasi Teks Rekon, Fakta vs Asumsi vs Opini, Kosakata Medsos & Kamus',
  },

  // Bahasa Inggris (HANYA 3 Skill: Listening, Reading, Writing)
  {
    id: 'BING_UNIT_1',
    subject: 'B_INGGRIS',
    number: 'Unit 1',
    title: 'Procedure Text',
    description: 'Listening to steps, Reading comprehension recipes/manuals, Guided Writing imperative sentences',
  },
  {
    id: 'BING_UNIT_2',
    subject: 'B_INGGRIS',
    number: 'Unit 2',
    title: 'Advertisements',
    description: 'Listening to commercial promos, Reading promotional texts, Independent persuasive writing',
  },
  {
    id: 'BING_UNIT_3',
    subject: 'B_INGGRIS',
    number: 'Unit 3',
    title: 'Report Text',
    description: 'Listening to factual scientific reports, Reading comprehension, Simple Present Tense & Technical terms',
  },
  {
    id: 'BING_UNIT_4',
    subject: 'B_INGGRIS',
    number: 'Unit 4',
    title: 'Product Labels',
    description: 'Listening to product warnings, Reading nutrition facts/ingredients/expiry dates, Writing product labels',
  },

  // Matematika
  {
    id: 'MAT_BAB_1',
    subject: 'MATEMATIKA',
    number: 'Bab I',
    title: 'Bangun Ruang Sisi Datar',
    description: 'Luas Permukaan, Volume, Kerangka Prisma dan Limas',
  },
  {
    id: 'MAT_BAB_2',
    subject: 'MATEMATIKA',
    number: 'Bab II',
    title: 'Sampel dan Populasi',
    description: 'Pengertian, Karakteristik, dan Teknik Pengambilan Sampel Representatif',
  },
  {
    id: 'MAT_BAB_3',
    subject: 'MATEMATIKA',
    number: 'Bab III',
    title: 'Peluang',
    description: 'Ruang Sampel, Peluang Empirik, Peluang Teoritik, dan Frekuensi Harapan',
  },
  {
    id: 'MAT_BAB_4',
    subject: 'MATEMATIKA',
    number: 'Bab IV',
    title: 'Bilangan Berpangkat',
    description: 'Bilangan Bulat Berpangkat, Sifat Operasi, Pangkat Negatif/Nol/Pecahan, Notasi Ilmiah',
  },
  {
    id: 'MAT_BAB_5',
    subject: 'MATEMATIKA',
    number: 'Bab V',
    title: 'Bentuk Akar',
    description: 'Pengertian Bentuk Akar, Operasi Aljabar Akar, Merasionalkan Penyebut Pecahan',
  },
];

export const INITIAL_TKA_QUESTIONS: TkaQuestion[] = [
  // ==========================================
  // IPA - Bab 1: Biologi Manusia
  // ==========================================
  {
    id: 'IPA_Q1',
    subject: 'IPA',
    chapterId: 'IPA_BAB_1',
    chapterName: 'Bab 1: Biologi Manusia',
    subtopic: 'Sistem Koordinasi & Homeostasis',
    question: 'Saat suhu lingkungan sangat dingin, tubuh manusia secara otomatis merespons dengan menggigil dan pembuluh darah perifer menyempit (vasokonstriksi). Mekanisme ini merupakan contoh nyata dari...',
    options: [
      'Umpan balik positif untuk membuang kelebihan kalori',
      'Homeostasis dengan umpan balik negatif untuk mempertahankan suhu inti tubuh',
      'Penurunan laju metabolisme basal organ dalam',
      'Gangguan impuls pada medula spinalis'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: "Dingin -> Menggigil -> Suhu naik kembali normal" = Mekanisme UMPAN BALIK NEGATIF (Homeostasis penyeimbang). Cukup ingat kata kunci: Melawan perubahan menuju titik setel (set point).',
    conventionalSolution: 'Homeostasis menjaga keseimbangan internal. Ketika suhu turun di bawah batas normal, hipotalamus merangsang kontraksi otot rangka (menggigil) untuk memproduksi panas serta vasokonstriksi untuk mengurangi pelepasan kalor, sehingga suhu kembali stabil.',
    source: 'BANK'
  },
  {
    id: 'IPA_Q2',
    subject: 'IPA',
    chapterId: 'IPA_BAB_1',
    chapterName: 'Bab 1: Biologi Manusia',
    subtopic: 'Sistem Reproduksi Manusia',
    question: 'Tempat terjadinya proses fertilisasi (pembuahan sel telur oleh sel sperma) yang menghasilkan zigot pada sistem reproduksi wanita normal berada di...',
    options: [
      'Uterus (Rahim)',
      'Ovarium (Indung Telur)',
      'Tuba Fallopii (Oviduk)',
      'Vagina'
    ],
    correctAnswer: 2,
    theKingFormula: 'THE KING: Tuba Fallopii = "Tempat Pertemuan Cinta" (Fertilisasi). Rahim (Uterus) = "Tempat Tumbuh Bayi" (Implantasi). Langsung pilih Oviduk/Tuba Fallopii!',
    conventionalSolution: 'Fertilisasi atau peleburan inti ovum dan spermatozoa secara fisiologis berlangsung di sepertiga bagian luar oviduk (ampula tuba fallopii). Hasil fertilisasi berupa zigot kemudian bergerak menuju uterus untuk menempel (implantasi).',
    source: 'BANK'
  },

  // ==========================================
  // IPA - Bab 2: Tekanan Zat
  // ==========================================
  {
    id: 'IPA_Q3',
    subject: 'IPA',
    chapterId: 'IPA_BAB_2',
    chapterName: 'Bab 2: Tekanan Zat',
    subtopic: 'Hukum Pascal & Dongkrak Hidrolik',
    question: 'Sebuah dongkrak hidrolik memiliki penampang kecil dengan luas A₁ = 10 cm² dan penampang besar A₂ = 200 cm². Jika penampang kecil ditekan dengan gaya 50 N, maka gaya angkat pada penampang besar adalah...',
    options: [
      '500 N',
      '1.000 N',
      '2.000 N',
      '2.500 N'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Kelipatan luas penampang = A₂/A₁ = 200/10 = 20 kali. Maka gaya besar = 20 × F₁ = 20 × 50 N = 1.000 N (Hitung 3 detik!).',
    conventionalSolution: 'Sesuai Hukum Pascal: F₁ / A₁ = F₂ / A₂ -> F₂ = (A₂ / A₁) × F₁ = (200 / 10) × 50 = 20 × 50 = 1.000 N.',
    source: 'BANK'
  },
  {
    id: 'IPA_Q4',
    subject: 'IPA',
    chapterId: 'IPA_BAB_2',
    chapterName: 'Bab 2: Tekanan Zat',
    subtopic: 'Tekanan Hidrostatis',
    question: 'Seorang penyelam berada pada kedalaman 8 meter di bawah permukaan danau air tawar (massa jenis air = 1.000 kg/m³, percepatan gravitasi g = 10 m/s²). Berapakah tekanan hidrostatis yang dialami penyelam tersebut?',
    options: [
      '8.000 Pa',
      '40.000 Pa',
      '80.000 Pa',
      '800.000 Pa'
    ],
    correctAnswer: 2,
    theKingFormula: 'THE KING: P_h = ρ × g × h = 1.000 × 10 × 8 = 80.000 Pa (atau 80 kPa). Tinggal kalikan ketiga angka utamanya!',
    conventionalSolution: 'Rumus tekanan hidrostatis zat cair adalah P = ρ · g · h. Diketahui ρ = 1.000 kg/m³, g = 10 m/s², h = 8 m. P = 1.000 × 10 × 8 = 80.000 N/m² = 80.000 Pa.',
    source: 'BANK'
  },

  // ==========================================
  // IPA - Bab 3: Kelistrikan
  // ==========================================
  {
    id: 'IPA_Q5',
    subject: 'IPA',
    chapterId: 'IPA_BAB_3',
    chapterName: 'Bab 3: Kelistrikan',
    subtopic: 'Hukum Ohm & Hambatan Pengganti',
    question: 'Tiga buah resistor bernilai 6 Ω, 3 Ω, dan 2 Ω dirangkai secara paralel, kemudian dihubungkan dengan sumber tegangan 12 Volt. Kuat arus total yang mengalir dari sumber tegangan adalah...',
    options: [
      '6 A',
      '12 A',
      '2 A',
      '1 A'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Arus cabang paralel I = V/R. I₁ = 12/6 = 2A; I₂ = 12/3 = 4A; I₃ = 12/2 = 6A. Jumlahkan langsung: 2 + 4 + 6 = 12 A!',
    conventionalSolution: '1/R_p = 1/6 + 1/3 + 1/2 = 1/6 + 2/6 + 3/6 = 6/6 -> R_p = 1 Ω. Maka I = V / R_p = 12 / 1 = 12 Ampere.',
    source: 'BANK'
  },

  // ==========================================
  // IPA - Bab 4: Kemagnetan & Energi Ramah Lingkungan
  // ==========================================
  {
    id: 'IPA_Q6',
    subject: 'IPA',
    chapterId: 'IPA_BAB_4',
    chapterName: 'Bab 4: Kemagnetan & Energi Ramah Lingkungan',
    subtopic: 'Induksi Elektromagnetik & Generator',
    question: 'Prinsip kerja transformator (trafo) dan dinamo sepeda didasarkan pada peristiwa induksi elektromagnetik yang pertama kali dirumuskan oleh...',
    options: [
      'Michael Faraday',
      'Isaac Newton',
      'Thomas Alva Edison',
      'James Watt'
    ],
    correctAnswer: 0,
    theKingFormula: 'THE KING: "Perubahan fluks magnet menimbulkan GGL induksi" = HUKUM FARADAY. Ingat: Faraday = Bapak Induksi Listrik.',
    conventionalSolution: 'Michael Faraday menemukan bahwa perubahan garis gaya magnet yang memotong suatu kumparan akan menghasilkan gaya gerak listrik (GGL) induksi.',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Indonesia - Bab 1: Teks Deskripsi
  // ==========================================
  {
    id: 'BINDO_Q1',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_1',
    chapterName: 'Bab 1: Teks Deskripsi',
    subtopic: 'Ciri Kebahasaan & Panca Indra',
    passage: 'Gemercik air Sungai Klawing mengalir jernih membelah bebatuan andesit yang hitam legam. Udara pagi terasa menusuk tulang, membawa aroma tanah basah sehabis hujan lebat semalam.',
    question: 'Pancaindra yang paling dominan digunakan dalam penggalan teks deskripsi di atas adalah...',
    options: [
      'Penglihatan dan perasa',
      'Pendengaran, penglihatan, dan peraba',
      'Penciuman dan pengecap',
      'Penglihatan dan gerak tubuh'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: "Gemercik" (Dengar) + "Jernih / hitam legam" (Lihat) + "Menusuk tulang / dingin" (Raba). Gabungan lengkap: Dengar, Lihat, Raba!',
    conventionalSolution: 'Kalimat mengandung kata "gemercik" (indera pendengaran), "mengalir jernih, hitam legam" (indera penglihatan), dan "menusuk tulang" (indera peraba/suhu).',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Indonesia - Bab 2: Teks Prosedur
  // ==========================================
  {
    id: 'BINDO_Q2',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_2',
    chapterName: 'Bab 2: Teks Prosedur',
    subtopic: 'Kalimat Imperatif & Konjungsi Temporal',
    question: 'Manakah di antara kalimat berikut yang menggunakan kata kerja imperatif (perintah) yang tepat dalam teks prosedur pembuatan paspor online?',
    options: [
      'Pemohon dapat menunggu antrean setelah nomor dipanggil oleh petugas.',
      'Unggahlah berkas KTP dan Kartu Keluarga dalam format PDF dengan ukuran maksimal 2 MB.',
      'Paspor elektronik memiliki keunggulan chip yang tertanam di sampul depan.',
      'Masyarakat sangat antusias mengurus dokumen keimigrasian di kantor pos.'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Ciri khas imperatif adalah akhiran partikel "-lah", "-kan", atau kata kerja di awal kalimat tanpa imbuhan pasif. Kata "Unggahlah" adalah kalimat perintah tegas!',
    conventionalSolution: 'Kalimat "Unggahlah..." merupakan kalimat imperatif karena memberi instruksi tindakan langsung kepada pembaca teks prosedur.',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Indonesia - Bab 3: Teks Rekon
  // ==========================================
  {
    id: 'BINDO_Q3',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_3',
    chapterName: 'Bab 3: Teks Rekon',
    subtopic: 'Fakta vs Asumsi vs Opini',
    question: 'Perhatikan kalimat-kalimat berikut:\n(1) Pertandingan final bola voli antarkelas digelar pada Senin, 15 September 2025.\n(2) Menurut saya, tim kelas IX-H bermain jauh lebih memukau dibanding lawan.\n(3) Skor akhir pertandingan adalah 3-2 untuk kemenangan kelas IX-H.\n(4) Kemenangan itu tampaknya disebabkan oleh sorak suporter yang begitu riuh.\n\nKalimat yang menyatakan FAKTA objektif adalah...',
    options: [
      '(1) dan (3)',
      '(2) dan (4)',
      '(1) dan (2)',
      '(3) dan (4)'
    ],
    correctAnswer: 0,
    theKingFormula: 'THE KING: FAKTA = ada tanggal pasti, angka pasti, skor nyata (1 & 3). OPINI/ASUMSI = ada kata "menurut saya", "tampaknya" (2 & 4). Langsung eliminasi 2 dan 4!',
    conventionalSolution: 'Kalimat (1) dan (3) adalah fakta karena memuat data terverifikasi (hari, tanggal, dan skor akhir). Sedangkan (2) adalah opini dan (4) adalah asumsi perkiraan.',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Inggris - Unit 1: Procedure Text
  // ==========================================
  {
    id: 'BING_Q1',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_1',
    chapterName: 'Unit 1: Procedure Text',
    subtopic: 'Listening to Step Instructions',
    skill: 'LISTENING',
    listeningScript: 'First, boil two cups of water in a kettle. Next, pour the hot water into a mug containing one tablespoon of green tea leaves. Let it steep for precisely three minutes before straining.',
    question: 'How long should you steep the green tea according to the audio recording?',
    options: [
      'Two minutes',
      'Three minutes',
      'Five minutes',
      'Thirty seconds'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Listen for the time marker: "Let it steep for precisely three minutes". Kata kunci: "three minutes" = Jawaban B!',
    conventionalSolution: 'The speaker in the audio states: "Let it steep for precisely three minutes before straining." Therefore, the correct duration is three minutes.',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Inggris - Unit 2: Advertisements
  // ==========================================
  {
    id: 'BING_Q2',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_2',
    chapterName: 'Unit 2: Advertisements',
    subtopic: 'Reading Comprehension & Persuasive Purpose',
    passage: '🌟 SPECIAL BACK-TO-SCHOOL SALE! 🌟\nGet up to 50% discount on all ergonomic school bags and stationary kits. Offer valid exclusively from July 1st to July 7th at SmartStationery Outlet or order online via our official app. Free delivery for purchases above Rp 150,000!',
    question: 'What is the primary communicative purpose of the text?',
    options: [
      'To inform readers about how to produce ergonomic bags',
      'To persuade customers to purchase stationary items during the promotion',
      'To announce the opening of a new delivery courier service',
      'To complain about school bag prices'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Format Iklan/Sale/Discount bertujuan "to persuade / to attract customers to buy". Kata kunci utama: PERSUADE / PROMOTE.',
    conventionalSolution: 'The text is an advertisement promoting discounts and free delivery to attract and persuade buyers to purchase their products during the sale event.',
    source: 'BANK'
  },

  // ==========================================
  // Bahasa Inggris - Unit 4: Product Labels
  // ==========================================
  {
    id: 'BING_Q3',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_4',
    chapterName: 'Unit 4: Product Labels',
    subtopic: 'Listening to Product Warnings',
    skill: 'LISTENING',
    listeningScript: 'Warning: Store this cough syrup in a cool, dry place away from direct sunlight. Do not exceed the recommended dose of ten milliliters three times a day. Keep out of reach of children.',
    question: 'According to the warning on the medicine label, what is the maximum dosage per day?',
    options: [
      '10 milliliters in total',
      '20 milliliters in total',
      '30 milliliters in total',
      '15 milliliters in total'
    ],
    correctAnswer: 2,
    theKingFormula: 'THE KING: "10 ml three times a day" -> 10 × 3 = 30 ml per day. Hitung perkalian sederhana saat mendengar!',
    conventionalSolution: 'The spoken instruction indicates 10 ml taken three times daily, making the total maximum daily dosage 30 ml.',
    source: 'BANK'
  },

  // ==========================================
  // Matematika - Bab I: Bangun Ruang Sisi Datar
  // ==========================================
  {
    id: 'MAT_Q1',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_1',
    chapterName: 'Bab I: Bangun Ruang Sisi Datar',
    subtopic: 'Prisma Segitiga Siku-Siku',
    question: 'Sebuah prisma tegak memiliki alas berbentuk segitiga siku-siku dengan panjang sisi siku-sikunya 6 cm dan 8 cm. Jika tinggi prisma tersebut adalah 15 cm, maka volume prisma tersebut adalah...',
    options: [
      '360 cm³',
      '720 cm³',
      '240 cm³',
      '480 cm³'
    ],
    correctAnswer: 0,
    theKingFormula: 'THE KING: Luas alas segitiga siku-siku = (6 × 8) / 2 = 24. Volume = Luas alas × Tinggi = 24 × 15. Trik kali 15: (24 × 10) + 120 = 240 + 120 = 360 cm³!',
    conventionalSolution: 'Luas alas = 1/2 × a × t_alas = 1/2 × 6 × 8 = 24 cm². Volume prisma = Luas alas × tinggi prisma = 24 × 15 = 360 cm³.',
    source: 'BANK'
  },

  // ==========================================
  // Matematika - Bab II: Sampel dan Populasi
  // ==========================================
  {
    id: 'MAT_Q2',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_2',
    chapterName: 'Bab II: Sampel dan Populasi',
    subtopic: 'Karakteristik Sampel Representatif',
    question: 'Seorang peneliti ingin mengetahui rata-rata uang saku siswa SMP se-Kabupaten Purbalingga. Untuk itu, peneliti mendata 20 siswa dari masing-masing 10 SMP negeri dan swasta yang tersebar secara acak di wilayah tersebut. Dalam penelitian ini, populasi penelitian adalah...',
    options: [
      '20 siswa dari masing-masing 10 SMP yang didata',
      'Seluruh siswa SMP yang ada di Kabupaten Purbalingga',
      'Seluruh guru dan kepala sekolah SMP di Kabupaten Purbalingga',
      '10 SMP yang terpilih dalam penelitian'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Populasi = SELURUH subjek sasaran utama. Sampel = sebagian kecil yang diambil sebagai wakil. Sasaran: Siswa SMP se-Kabupaten Purbalingga.',
    conventionalSolution: 'Populasi adalah keseluruhan objek atau subjek penelitian yang memiliki karakteristik tertentu (dalam kasus ini: seluruh siswa SMP di Kabupaten Purbalingga), sedangkan 200 siswa yang diambil adalah sampel.',
    source: 'BANK'
  },

  // ==========================================
  // Matematika - Bab III: Peluang
  // ==========================================
  {
    id: 'MAT_Q3',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_3',
    chapterName: 'Bab III: Peluang',
    subtopic: 'Peluang Teoritik Dua Dadu',
    question: 'Dua buah dadu bermata enam dilempar bersamaan sebanyak satu kali. Peluang munculnya mata dadu yang berjumlah 8 atau 11 adalah...',
    options: [
      '5/36',
      '7/36',
      '2/36',
      '1/4'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING (Trik Piramida Jumlah Dua Dadu):\nJumlah 8 ada 5 pasangan: (2,6), (3,5), (4,4), (5,3), (6,2).\nJumlah 11 ada 2 pasangan: (5,6), (6,5).\nTotal = 5 + 2 = 7 dari 36 kemungkinan -> 7/36!',
    conventionalSolution: 'Titik sampel jumlah 8 = {(2,6), (3,5), (4,4), (5,3), (6,2)} (5 pasang). Titik sampel jumlah 11 = {(5,6), (6,5)} (2 pasang). Kedua kejadian saling lepas. P(8 atau 11) = (5 + 2) / 36 = 7/36.',
    source: 'BANK'
  },

  // ==========================================
  // Matematika - Bab IV: Bilangan Berpangkat
  // ==========================================
  {
    id: 'MAT_Q4',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_4',
    chapterName: 'Bab IV: Bilangan Berpangkat',
    subtopic: 'Sifat Pangkat & Notasi Ilmiah',
    question: 'Bentuk sederhana dari operasi aljabar bilangan berpangkat (2⁴ × 3⁶) / (2² × 3⁴) adalah...',
    options: [
      '18',
      '36',
      '72',
      '108'
    ],
    correctAnswer: 1,
    theKingFormula: 'THE KING: Kurangkan pangkat basis yang sama! 2^(4-2) = 2² = 4. 3^(6-4) = 3² = 9. Kalikan: 4 × 9 = 36 (Hitung kepala 4 detik)!',
    conventionalSolution: '(2⁴ / 2²) × (3⁶ / 3⁴) = 2^(4 - 2) × 3^(6 - 4) = 2² × 3² = 4 × 9 = 36.',
    source: 'BANK'
  },

  // ==========================================
  // Matematika - Bab V: Bentuk Akar
  // ==========================================
  {
    id: 'MAT_Q5',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_5',
    chapterName: 'Bab V: Bentuk Akar',
    subtopic: 'Merasionalkan Penyebut',
    question: 'Bentuk rasional dari pecahan 12 / √3 adalah...',
    options: [
      '4√3',
      '6√3',
      '3√3',
      '12√3'
    ],
    correctAnswer: 0,
    theKingFormula: 'THE KING: Rumus kilat a/√b = (a/b)√b. Di sini 12/√3 = (12/3)√3 = 4√3! Tanpa coret-coret.',
    conventionalSolution: '12 / √3 × (√3 / √3) = (12√3) / 3 = 4√3.',
    source: 'BANK'
  }
];

// Helper to get questions for a subject without cloning fake duplicates
export function getQuestionsForSubject(
  subject: TkaSubject,
  targetCount: number = 30,
  allBankQuestions: TkaQuestion[] = INITIAL_TKA_QUESTIONS,
  packageId?: string
): TkaQuestion[] {
  let subjectBank = allBankQuestions.filter((q) => q.subject === subject);
  if (subjectBank.length === 0) return [];

  // Jika ada packageId, filter hanya soal yang memiliki packageId tersebut
  if (packageId) {
    const matched = subjectBank.filter((q) => q.packageId === packageId);
    if (matched.length <= targetCount) {
      return matched;
    }
    return matched.slice(0, targetCount);
  }

  // Untuk kasus TANPA packageId (mode latihan bebas per bab),
  // acak urutannya (Fisher-Yates shuffle) tiap kali dipanggil, bukan slice(0, n) deterministik
  const shuffled = [...subjectBank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, targetCount);
}
