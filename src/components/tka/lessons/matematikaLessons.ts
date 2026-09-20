import { TkaMateriLesson } from '../tkaMateriLessonsData';

export const MATEMATIKA_LESSONS: TkaMateriLesson[] = [
  // 1. MAT_LESSON_1
  {
    id: 'MAT_LESSON_1',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_1',
    chapterNumber: 'Bab I',
    chapterTitle: 'Bangun Ruang Sisi Datar (Prisma & Limas)',
    overview: 'Bayangkan kamu sedang membungkus kado berbentuk tenda pramuka atau piramida Mesir. Di bab ini, kita membedah rahasia menghitung kebutuhan kertas kado (luas permukaan), isi ruangan (volume), serta panjang kawat kerangka agar tidak boros bahan saat membuat miniatur bangun ruang.',
    keyPoints: [
      {
        title: 'Konsep Dasar & Struktur Prisma',
        description: 'Prisma adalah bangun ruang yang punya "alas" dan "atap" (tutup) kembar identik (sejajar dan kongruen). Dinding-dinding tegaknya selalu berbentuk persegi panjang atau jajar genjang. Nama prisma selalu mengikuti bentuk alasnya (prisma segitiga, prisma segi empat, dsb).',
        formulaOrConcept: 'Volume Prisma:\n$$V = L_{\\text{alas}} \\times t$$\nLuas Permukaan Prisma:\n$$L_{\\text{permukaan}} = (2 \\times L_{\\text{alas}}) + (K_{\\text{alas}} \\times t)$$'
      },
      {
        title: 'Konsep Dasar & Struktur Limas',
        description: 'Limas adalah bangun ruang yang hanya memiliki satu alas, sedangkan semua dinding tegaknya berbentuk segitiga yang bertemu meruncing di satu titik puncak. Karena meruncing, volumenya selalu sepertiga dari prisma pasangannya.',
        formulaOrConcept: 'Volume Limas:\n$$V = \\dfrac{1}{3} \\times L_{\\text{alas}} \\times t$$\nLuas Permukaan Limas:\n$$L_{\\text{permukaan}} = L_{\\text{alas}} + \\sum L_{\\text{segitiga tegak}}$$'
      },
      {
        title: 'Panjang Kawat Kerangka Prisma & Limas',
        description: 'Banyak siswa salah menghitung karena lupa menjumlahkan rusuk tegak dan rusuk alas. Kerangka prisma memiliki 2 set keliling alas plus seluruh tiang tegak. Sedangkan limas memiliki 1 set keliling alas ditambah semua rusuk miring menuju puncak.',
        formulaOrConcept: 'Kerangka Prisma segi-$n$:\n$$K_{\\text{prisma}} = (2 \\times K_{\\text{alas}}) + (n \\times t)$$\nKerangka Limas segi-$n$:\n$$K_{\\text{limas}} = K_{\\text{alas}} + (n \\times r_{\\text{tegak}})$$'
      },
      {
        title: 'Tinggi Segitiga Tegak vs Tinggi Limas (Jebakan Pythagoras)',
        description: 'Kesalahan paling fatal di ujian adalah menyamakan tinggi limas ($t$) dengan tinggi segitiga dinding tegak ($T_s$). Tinggi limas diukur tegak lurus dari puncak ke tengah alas, sedangkan tinggi segitiga tegak diukur miring di permukaan dinding. Hubungkan keduanya selalu dengan teorema Pythagoras.',
        formulaOrConcept: 'Hubungan Pythagoras pada Limas Persegi berusuk alas $s$:\n$$(T_s)^2 = t^2 + \\left(\\dfrac{s}{2}\\right)^2$$'
      },
      {
        title: 'Diagonal Bidang dan Diagonal Ruang Kubus/Balok',
        description: 'Kubus dan balok adalah bentuk istimewa dari prisma segi empat tegak. Menghitung jarak antarsudut terjauh di dalam ruangan menggunakan teorema Pythagoras 3 dimensi secara langsung.',
        formulaOrConcept: 'Pada Kubus rusuk $s$:\n$$d_{\\text{bidang}} = s\\sqrt{2}, \\quad d_{\\text{ruang}} = s\\sqrt{3}$$\nPada Balok ($p, l, t$):\n$$d_{\\text{ruang}} = \\sqrt{p^2 + l^2 + t^2}$$'
      },
      {
        title: 'Perubahan Volume Akibat Perubahan Skala Rusuk',
        description: 'Jika seluruh rusuk prisma atau limas diperbesar $k$ kali lipat, luas permukaannya membesar $k^2$ kali lipat, sedangkan volumenya melesat bertambah $k^3$ kali lipat. Pemahaman ini sering keluar di soal cerita penalaran TKA tingkat tinggi.',
        formulaOrConcept: 'Rasio Perbesaran Skala $k$:\n$$L_{\\text{baru}} = k^2 \\times L_{\\text{lama}}, \\quad V_{\\text{baru}} = k^3 \\times V_{\\text{lama}}$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Sebuah prisma alasnya berbentuk segitiga siku-siku dengan panjang sisi 6 cm, 8 cm, dan 10 cm. Jika tinggi prisma 15 cm, hitunglah volume dan luas permukaan prisma tersebut!',
        stepByStep: [
          '1. Identifikasi sisi alas siku-siku: sisi miring adalah yang terpanjang (10 cm), sehingga alas dan tinggi segitiga siku-siku adalah 6 cm dan 8 cm.',
          '2. Hitung luas alas: $L_{\\text{alas}} = \\dfrac{1}{2} \\times 6 \\times 8 = 24\\text{ cm}^2$.',
          '3. Hitung keliling alas: $K_{\\text{alas}} = 6 + 8 + 10 = 24\\text{ cm}$.',
          '4. Volume prisma: $V = L_{\\text{alas}} \\times t = 24 \\times 15 = 360\\text{ cm}^3$.',
          '5. Luas permukaan: $L = (2 \\times 24) + (24 \\times 15) = 48 + 360 = 408\\text{ cm}^2$.'
        ],
        theKingTip: 'THE KING: Pada segitiga siku-siku, sisi terpanjang (10) selalu sisi miring. Cukup kalikan dua sisi lainnya lalu bagi 2: $(6 \\times 8)/2 = 24$. Volume = $24 \\times 15 = 360$. Selesai dalam 10 detik!',
        answer: 'Volume = 360 cm³, Luas Permukaan = 408 cm²'
      },
      {
        question: 'Sebuah limas persegi memiliki panjang rusuk alas 10 cm dan tinggi limas 12 cm. Tentukan luas seluruh permukaan limas!',
        stepByStep: [
          '1. Luas alas persegi: $L_{\\text{alas}} = 10 \\times 10 = 100\\text{ cm}^2$.',
          '2. Cari tinggi segitiga dinding tegak ($T_s$) dengan Pythagoras: setengah rusuk alas = $10 / 2 = 5\\text{ cm}$.',
          '3. $T_s = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ cm}$.',
          '4. Luas 1 segitiga tegak: $\\dfrac{1}{2} \\times 10 \\times 13 = 65\\text{ cm}^2$.',
          '5. Luas 4 segitiga tegak: $4 \\times 65 = 260\\text{ cm}^2$.',
          '6. Luas permukaan total = $100 + 260 = 360\\text{ cm}^2$.'
        ],
        theKingTip: 'THE KING: Ingat tripel Pythagoras sakti $(5, 12, 13)$. Begitu tahu $t = 12$ dan setengah alas $= 5$, tinggi segitiga langsung $13$! Luas selimut = $2 \\times s \\times T_s = 2 \\times 10 \\times 13 = 260$. Total = $100 + 260 = 360\\text{ cm}^2$.',
        answer: '360 cm²'
      },
      {
        question: 'Tersedia kawat sepanjang 6 meter. Akan dibuat 4 kerangka balok berukuran 18 cm × 12 cm × 10 cm. Berapa sentimeter sisa kawat yang tidak terpakai?',
        stepByStep: [
          '1. Panjang kawat untuk 1 balok: $K = 4 \\times (p + l + t) = 4 \\times (18 + 12 + 10) = 4 \\times 40 = 160\\text{ cm}$.',
          '2. Panjang kawat untuk 4 balok: $4 \\times 160\\text{ cm} = 640\\text{ cm}$. Tapi kawat yang tersedia adalah 6 meter = $600\\text{ cm}$!',
          '3. Karena 600 cm < 640 cm, maka kawat hanya cukup untuk membuat 3 balok utuh.',
          '4. Kawat untuk 3 balok = $3 \\times 160 = 480\\text{ cm}$.',
          '5. Sisa kawat = $600 - 480 = 120\\text{ cm}$.'
        ],
        theKingTip: 'THE KING: Hati-hati jebakan jumlah barang! 1 balok butuh $4 \\times (18+12+10) = 160\\text{ cm}$. Kawat $600\\text{ cm} \\div 160 = 3$ balok sisa $120\\text{ cm}$.',
        answer: '120 cm (hanya cukup untuk 3 buah balok)'
      },
      {
        question: 'Sebuah prisma belah ketupat memiliki panjang diagonal alas masing-masing 12 cm dan 16 cm. Jika tinggi prisma 20 cm, hitung luas permukaan prisma!',
        stepByStep: [
          '1. Luas alas belah ketupat: $L_{\\text{alas}} = \\dfrac{d_1 \\times d_2}{2} = \\dfrac{12 \\times 16}{2} = 96\\text{ cm}^2$.',
          '2. Cari sisi belah ketupat ($s$) menggunakan tripel Pythagoras dari setengah diagonal ($6\\text{ cm}$ dan $8\\text{ cm}$): $s = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.',
          '3. Keliling alas: $K_{\\text{alas}} = 4 \\times 10 = 40\\text{ cm}$.',
          '4. Luas permukaan = $(2 \\times L_{\\text{alas}}) + (K_{\\text{alas}} \\times t) = (2 \\times 96) + (40 \\times 20) = 192 + 800 = 992\\text{ cm}^2$.'
        ],
        theKingTip: 'THE KING: Tripel Pythagoras $(6, 8, 10)$ langsung temukan sisi belah ketupat $= 10$. Luas selimut $= 4 \\times 10 \\times 20 = 800$. Luas 2 alas $= 12 \\times 16 = 192$. Jumlahkan $= 992\\text{ cm}^2$.',
        answer: '992 cm²'
      },
      {
        question: 'Sebuah bak penampungan air berbentuk kubus memiliki panjang rusuk bagian dalam 90 cm. Jika bak tersebut sudah terisi air sepertiganya, berapa liter air yang perlu ditambahkan agar penuh?',
        stepByStep: [
          '1. Volume kubus total: $V = s^3 = 90^3 = 729.000\\text{ cm}^3$.',
          '2. Ubah ke liter ($1\\text{ liter} = 1\\text{ dm}^3 = 1.000\\text{ cm}^3$): $V = 729\\text{ liter}$.',
          '3. Sudah terisi $\\dfrac{1}{3}$, berarti air yang perlu ditambahkan adalah $\\dfrac{2}{3}$ bagian.',
          '4. Air tambahan = $\\dfrac{2}{3} \\times 729\\text{ liter} = 2 \\times 243 = 486\\text{ liter}$.'
        ],
        theKingTip: 'THE KING: Langsung pakai satuan desimeter sejak awal! $s = 9\\text{ dm}$. Volume total = $9^3 = 729\\text{ liter}$. Butuh tambahan $\\dfrac{2}{3} \\times 729 = 486\\text{ liter}$. Cepat dan bebas nol banyak!',
        answer: '486 liter'
      },
      {
        question: 'Sebuah limas memiliki alas berbentuk persegi panjang dengan ukuran 16 cm × 12 cm. Jika panjang rusuk tegak limas 26 cm, hitunglah volume limas tersebut!',
        stepByStep: [
          '1. Luas alas: $L_{\\text{alas}} = 16 \\times 12 = 192\\text{ cm}^2$.',
          '2. Hitung diagonal alas: $d = \\sqrt{16^2 + 12^2} = \\sqrt{256 + 144} = 20\\text{ cm}$. Setengah diagonal $= 10\\text{ cm}$.',
          '3. Cari tinggi limas ($t$) dengan segitiga siku-siku antara rusuk tegak (26 cm), setengah diagonal (10 cm), dan $t$: $t = \\sqrt{26^2 - 10^2} = \\sqrt{676 - 100} = \\sqrt{576} = 24\\text{ cm}$.',
          '4. Volume limas = $\\dfrac{1}{3} \\times L_{\\text{alas}} \\times t = \\dfrac{1}{3} \\times 192 \\times 24 = 192 \\times 8 = 1.536\\text{ cm}^3$.'
        ],
        theKingTip: 'THE KING: Tripel Pythagoras $(5, 12, 13)$ jika dikali 2 menjadi $(10, 24, 26)$. Begitu setengah diagonal $= 10$ dan rusuk tegak $= 26$, tinggi limas langsung $24\\text{ cm}$!',
        answer: '1.536 cm³'
      },
      {
        question: 'Sebuah balok memiliki perbandingan panjang : lebar : tinggi = 4 : 3 : 2. Jika luas permukaannya 468 cm², tentukan volume balok tersebut!',
        stepByStep: [
          '1. Misalkan $p = 4x, l = 3x, t = 2x$.',
          '2. $L = 2 \\times (pl + pt + lt) = 2 \\times (12x^2 + 8x^2 + 6x^2) = 2 \\times 26x^2 = 52x^2$.',
          '3. $52x^2 = 468 \\implies x^2 = 468 / 52 = 9 \\implies x = 3$.',
          '4. Panjang $p = 4(3) = 12\\text{ cm}$, lebar $l = 3(3) = 9\\text{ cm}$, tinggi $t = 2(3) = 6\\text{ cm}$.',
          '5. Volume = $p \\times l \\times t = 12 \\times 9 \\times 6 = 648\\text{ cm}^3$.'
        ],
        theKingTip: 'THE KING: Jumlah hasil kali perbandingan: $4 \\times 3 + 4 \\times 2 + 3 \\times 2 = 12 + 8 + 6 = 26$. Nilai $x^2 = \\dfrac{L}{2 \\times 26} = \\dfrac{468}{52} = 9 \\implies x = 3$. Volume $= (4 \\times 3 \\times 2) \\times x^3 = 24 \\times 27 = 648\\text{ cm}^3$.',
        answer: '648 cm³'
      },
      {
        question: 'Sebuah tenda kemah berbentuk prisma segitiga sama kaki memiliki panjang alas segitiga 120 cm, tinggi segitiga 80 cm, dan panjang tenda ke belakang 200 cm. Hitung volume udara di dalam tenda!',
        stepByStep: [
          '1. Luas penampang depan tenda (segitiga): $L_{\\text{alas}} = \\dfrac{1}{2} \\times 120 \\times 80 = 4.800\\text{ cm}^2$.',
          '2. Panjang tenda adalah tinggi prisma: $t_{\\text{prisma}} = 200\\text{ cm}$.',
          '3. Volume prisma = $L_{\\text{alas}} \\times t_{\\text{prisma}} = 4.800 \\times 200 = 960.000\\text{ cm}^3$.',
          '4. Ubah ke meter kubik jika diminta ($1\\text{ m}^3 = 1.000.000\\text{ cm}^3$): $V = 0,96\\text{ m}^3$.'
        ],
        theKingTip: 'THE KING: Segitiga depan adalah alas prisma. Langsung kalikan: $\\dfrac{1}{2} \\times 1,2\\text{ m} \\times 0,8\\text{ m} \\times 2\\text{ m} = 0,96\\text{ m}^3$.',
        answer: '960.000 cm³ (atau 0,96 m³)'
      },
      {
        question: 'Sebuah kubus panjang rusuknya diperbesar menjadi 3 kali panjang semula. Berapa kali lipat pertambahan volume kubus tersebut dibandingkan volume awalnya?',
        stepByStep: [
          '1. Misalkan panjang rusuk awal $= s$, maka $V_{\\text{awal}} = s^3$.',
          '2. Rusuk baru $= 3s$, maka $V_{\\text{baru}} = (3s)^3 = 27s^3$.',
          '3. Volume baru adalah 27 kali volume awal.',
          '4. Pertambahan volume = $V_{\\text{baru}} - V_{\\text{awal}} = 27s^3 - s^3 = 26s^3$ (bertambah 26 kali lipat).'
        ],
        theKingTip: 'THE KING: Hati-hati kata "menjadi berapa kali" vs "pertambahan berapa kali"! Volume menjadi $3^3 = 27$ kali, tapi pertambahannya adalah $27 - 1 = 26$ kali lipat volume awal.',
        answer: 'Menjadi 27 kali lipat semula (pertambahannya 26 kali lipat)'
      },
      {
        question: 'Tentukan panjang diagonal ruang sebuah balok yang memiliki ukuran panjang 12 cm, lebar 4 cm, dan tinggi 3 cm!',
        stepByStep: [
          '1. Rumus diagonal ruang balok: $d = \\sqrt{p^2 + l^2 + t^2}$.',
          '2. $d = \\sqrt{12^2 + 4^2 + 3^2} = \\sqrt{144 + 16 + 9}$.',
          '3. $d = \\sqrt{169} = 13\\text{ cm}$.'
        ],
        theKingTip: 'THE KING: Perhatikan $l = 4$ dan $t = 3$, diagonal bidangnya adalah 5 (tripel 3, 4, 5). Kemudian pasangkan 5 dengan $p = 12$, membentuk tripel sakti $(5, 12, 13)$. Langsung dapat $13\\text{ cm}$ tanpa coret-coret panjang!',
        answer: '13 cm'
      }
    ],
    summary: 'Kunci bangun ruang sisi datar: bedakan prisma (punya 2 sisi alas-atap sejajar dan kongruen) dengan limas (meruncing ke 1 puncak dengan faktor 1/3 pada volume). Ingat selalu tripel Pythagoras untuk mencari tinggi selimut limas.'
  },

  // 2. MAT_BAB_2 (NEW)
  {
    id: 'MAT_LESSON_2',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_2',
    chapterNumber: 'Bab II',
    chapterTitle: 'Sampel dan Populasi',
    overview: 'Pernahkah kamu melihat koki mencicipi satu sendok kuah sayur untuk tahu apakah seluruh panci sudah pas asinnya? Satu sendok itulah sampel, sedangkan sepanci sup adalah populasi. Di bab statistika ini, kamu belajar cara memilih sampel yang adil (representatif) agar kesimpulan survei tidak bias atau keliru.',
    keyPoints: [
      {
        title: 'Pengertian Populasi vs Sampel',
        description: 'Populasi adalah keseluruhan objek atau individu yang menjadi sasaran penelitian lengkap. Sampel adalah sebagian kecil anggota populasi yang benar-benar diteliti untuk mewakili seluruh karakteristik populasinya.',
        formulaOrConcept: 'Hubungan Himpunan:\n$$\\text{Sampel} \\subset \\text{Populasi}$$\nContoh: Populasi = Seluruh siswa SMPN 1 (900 anak); Sampel = 60 siswa terpilih secara acak dari tiap kelas.'
      },
      {
        title: 'Syarat Sampel yang Baik (Representatif)',
        description: 'Sampel yang baik wajib bersifat representatif (benar-benar mencerminkan sifat populasi). Jika kamu ingin meneliti makanan kantin favorit seluruh siswa, tapi hanya bertanya pada anak kelas 7A, sampelmu bias dan tidak representatif.',
        formulaOrConcept: 'Kriteria Representatif: Acak (Random), Ukuran Cukup (Proporsional), dan Bebas dari Kepentingan Pribadi Peneliti.'
      },
      {
        title: 'Teknik Random Sampling (Pengambilan Acak Sederhana)',
        description: 'Setiap anggota populasi memiliki peluang yang sama besar untuk terpilih menjadi sampel, misalnya dengan sistem undian kocokan arisan atau nomor acak komputer.',
        formulaOrConcept: 'Peluang tiap individu terpilih:\n$$P = \\dfrac{1}{N}$$\ndengan $N$ adalah jumlah seluruh anggota populasi.'
      },
      {
        title: 'Stratified Random Sampling (Sampel Bertingkat/Proporsional)',
        description: 'Digunakan saat populasi memiliki kelompok/tingkatan yang tidak homogen, misalnya jenjang kelas 7, 8, dan 9 dengan jumlah murid yang berbeda-beda.',
        formulaOrConcept: 'Sampel kelompok $i$:\n$$n_i = \\dfrac{N_i}{N_{\\text{total}}} \\times n_{\\text{sampel}}$$'
      },
      {
        title: 'Systematic Sampling (Sampel Sistematis)',
        description: 'Pengambilan sampel berdasarkan pola urutan tertentu dari daftar anggota populasi yang telah diberi nomor urut (misalnya mengambil kelipatan 5 atau kelipatan 10).',
        formulaOrConcept: 'Interval sampling:\n$$k = \\dfrac{N}{n}$$\nSampel diambil pada nomor urut: $a, a+k, a+2k, a+3k, \\dots$'
      },
      {
        title: 'Generalisasi dan Bias Sampel',
        description: 'Generalisasi adalah penarikan kesimpulan umum untuk seluruh populasi berdasarkan data sampel. Bias terjadi jika sampel diambil dari kelompok yang condong memihak hasil tertentu.',
        formulaOrConcept: 'Bias = Kesalahan sistematis akibat metode pengambilan sampel yang tidak netral.'
      }
    ],
    exampleProblems: [
      {
        question: 'Kepala sekolah ingin mengetahui tingkat kepuasan siswa terhadap fasilitas laboratorium IPA di SMP Merdeka yang memiliki 720 siswa. Untuk itu, beliau membagikan angket kepada 50 siswa yang dipilih secara acak dari kelas 7, 8, dan 9. Tentukan populasi dan sampel dari kegiatan tersebut!',
        stepByStep: [
          '1. Pahami definisi populasi: seluruh kelompok besar yang menjadi target sasaran penelitian.',
          '2. Populasi dalam kasus ini adalah seluruh 720 siswa di SMP Merdeka.',
          '3. Pahami definisi sampel: bagian kecil yang secara nyata diambil datanya.',
          '4. Sampel dalam kasus ini adalah 50 siswa yang mengisi angket tersebut.'
        ],
        theKingTip: 'THE KING: Populasi = Wadah Total (seluruh 720 siswa). Sampel = Sendok Cuplikan (50 siswa yang disurvei).',
        answer: 'Populasi: Seluruh siswa SMP Merdeka (720 siswa). Sampel: 50 siswa yang dipilih acak.'
      },
      {
        question: 'Sebuah pabrik lampu memproduksi 10.000 bohlam setiap hari. Untuk menguji ketahanan lampu, petugas mengambil 100 bohlam dari berbagai lini mesin secara acak untuk dinyalakan terus-menerus hingga padam. Mengapa petugas tidak menguji seluruh populasi 10.000 bohlam?',
        stepByStep: [
          '1. Analisis sifat pengujian: pengujian ketahanan lampu bersifat destruktif (merusak objek yang diuji sampai padam/rusak).',
          '2. Jika seluruh 10.000 bohlam diuji hingga rusak, pabrik tidak akan memiliki produk yang bisa dijual ke konsumen.',
          '3. Selain itu, menguji seluruh populasi membutuhkan waktu yang sangat lama dan biaya yang luar biasa mahal.',
          '4. Oleh karena itu, pengujian destruktif mutlak membutuhkan sampel representatif.'
        ],
        theKingTip: 'THE KING: Ingat kata kunci "Uji Destruktif (Merusak)". Pada pengujian yang merusak objek (uji rasa makanan, uji ledak kembang api, uji nyala bohlam), wajib menggunakan sampel!',
        answer: 'Karena pengujian bersifat merusak (destruktif), memakan biaya tinggi, dan jika semua diuji tidak ada produk yang tersisa untuk dijual.'
      },
      {
        question: 'Suatu sekolah memiliki 300 siswa kelas 7, 250 siswa kelas 8, dan 250 siswa kelas 9 (total 800 siswa). Jika peneliti ingin mengambil sampel sebanyak 80 siswa dengan metode proporsional bertingkat, berapa banyak siswa kelas 7 yang harus diambil?',
        stepByStep: [
          '1. Hitung total populasi: $N_{\\text{total}} = 300 + 250 + 250 = 800\\text{ siswa}$.',
          '2. Jumlah sampel total yang diinginkan: $n = 80\\text{ siswa}$.',
          '3. Hitung proporsi kelas 7: $n_7 = \\dfrac{N_7}{N_{\\text{total}}} \\times n = \\dfrac{300}{800} \\times 80$.',
          '4. $n_7 = \\dfrac{3}{8} \\times 80 = 30\\text{ siswa}$.'
        ],
        theKingTip: 'THE KING: Rasio sampel terhadap populasi adalah $80 / 800 = 1 / 10$ (10%). Jadi setiap tingkatan cukup ambil $10\\%$-nya saja! Kelas 7 = $10\\% \\times 300 = 30$ siswa.',
        answer: '30 siswa kelas 7'
      },
      {
        question: 'Sebuah lembaga survei ingin mengetahui calon ketua OSIS terfavorit. Petugas berdiri di depan gerbang sekolah pada hari Senin pukul 06.40 hingga 06.50 dan menanyai 40 siswa pertama yang datang. Apakah teknik pengambilan sampel ini representatif? Jelaskan!',
        stepByStep: [
          '1. Perhatikan waktu pengambilan: 06.40–06.50 adalah waktu kedatangan siswa yang sangat disiplin / pagi-pagi sekali.',
          '2. Siswa yang datang sangat pagi mungkin memiliki kebiasaan, pergaulan, atau preferensi yang berbeda dengan siswa yang datang menjelang bel masuk (07.00).',
          '3. Siswa lain yang datang lewat pintu samping atau datang pukul 06.55 tidak punya peluang untuk terpilih.',
          '4. Kesimpulan: Sampel ini tidak representatif (mengandung bias waktu dan kedisiplinan).'
        ],
        theKingTip: 'THE KING: Jika ada kelompok siswa yang peluang terpilihnya nol (karena datang agak siang atau lewat pintu lain), sampel itu otomatis BIAS / tidak representatif.',
        answer: 'Tidak representatif, karena terjadi bias kenyamanan (convenience bias) yang hanya mewakili kelompok siswa yang datang sangat pagi.'
      },
      {
        question: 'Dari 500 siswa di suatu sekolah yang diberi nomor urut 1 sampai 500, akan diambil sampel sistematis sebanyak 25 siswa. Jika nomor pertama yang terpilih adalah nomor 8, sebutkan tiga nomor urut sampel berikutnya!',
        stepByStep: [
          '1. Hitung interval sampling: $k = \\dfrac{N}{n} = \\dfrac{500}{25} = 20$.',
          '2. Artinya, sampel diambil setiap lompatan 20 nomor.',
          '3. Nomor pertama $= 8$.',
          '4. Nomor kedua $= 8 + 20 = 28$.',
          '5. Nomor ketiga $= 28 + 20 = 48$.',
          '6. Nomor keempat $= 48 + 20 = 68$.'
        ],
        theKingTip: 'THE KING: Lompatan interval $k = 500 / 25 = 20$. Tinggal tambahkan 20 terus-menerus: 8, 28, 48, 68.',
        answer: 'Nomor 28, 48, dan 68'
      },
      {
        question: 'Seorang peneliti ingin mengetahui rata-rata uang saku siswa SMP di sebuah kota besar. Ia hanya mengambil sampel dari 3 sekolah swasta elit bertaraf internasional. Jelaskan mengapa kesimpulan peneliti tersebut dipastikan keliru untuk menggambarkan populasi kota tersebut!',
        stepByStep: [
          '1. Populasi sasaran adalah "seluruh siswa SMP di kota tersebut" yang mencakup sekolah negeri, swasta umum, dan swasta elit dari latar belakang ekonomi beragam.',
          '2. Sekolah swasta elit memiliki siswa dari kalangan ekonomi atas dengan uang saku jauh di atas rata-rata kota.',
          '3. Sampel tidak mencakup siswa sekolah negeri pinggiran dan keluarga menengah ke bawah.',
          '4. Akibatnya, nilai rata-rata yang diperoleh akan jauh lebih tinggi dari kondisi nyata di kota tersebut (overestimate).'
        ],
        theKingTip: 'THE KING: Generalisasi hanya sah jika sampel memiliki keragaman strata sosial yang sama dengan populasi. Sampel homogen pada populasi heterogen pasti menghasilkan data cacat.',
        answer: 'Karena sampel bias sosial-ekonomi (hanya sekolah elit), sehingga menghasilkan nilai rata-rata yang terlalu tinggi dan tidak mencerminkan populasi kota sesungguhnya.'
      },
      {
        question: 'Sebuah survei kesehatan gigi dilakukan terhadap 1.200 siswa SD. Sampel yang diambil adalah 150 siswa. Tentukan persentase ukuran sampel terhadap populasinya!',
        stepByStep: [
          '1. Ukuran sampel $n = 150$.',
          '2. Ukuran populasi $N = 1.200$.',
          '3. Persentase sampel = $\\dfrac{n}{N} \\times 100\\% = \\dfrac{150}{1.200} \\times 100\\%$.',
          '4. $\\dfrac{150}{1.200} = \\dfrac{1}{8} = 12,5\\%$.'
        ],
        theKingTip: 'THE KING: Sederhanakan pecahan $150/1.200$: bagi 150 atas-bawah menghasilkan $1/8$. Hafalan pecahan sakti $1/8 = 12,5\\%$.',
        answer: '12,5%'
      },
      {
        question: 'Di sebuah desa terdapat 400 peternak sapi, 300 peternak kambing, dan 100 peternak ayam. Akan diambil 40 peternak sebagai sampel proporsional. Berapa selisih jumlah sampel peternak sapi dan peternak ayam?',
        stepByStep: [
          '1. Total populasi peternak = $400 + 300 + 100 = 800\\text{ peternak}$.',
          '2. Sampel total $= 40$, rasio sampling $= \\dfrac{40}{800} = \\dfrac{1}{20} = 5\\%$.',
          '3. Sampel peternak sapi: $400 \\times \\dfrac{1}{20} = 20\\text{ orang}$.',
          '4. Sampel peternak ayam: $100 \\times \\dfrac{1}{20} = 5\\text{ orang}$.',
          '5. Selisih = $20 - 5 = 15\\text{ orang}$.'
        ],
        theKingTip: 'THE KING: Selisih populasi sapi dan ayam $= 400 - 100 = 300$. Langsung kalikan rasio sampling: $300 \\times (1/20) = 15\\text{ orang}$. Lebih cepat 2 langkah!',
        answer: '15 orang'
      },
      {
        question: 'Manakah dari situasi berikut yang wajib menggunakan teknik sensus (meneliti seluruh populasi tanpa sampel)? (A) Menguji rasa buah semangka di perkebunan, (B) Menghitung jumlah perolehan suara dalam pemilihan Presiden RI, (C) Mengetahui daya tahan baterai ponsel buatan pabrik.',
        stepByStep: [
          '1. Kasus A (uji rasa semangka): bersifat destruktif, jika semua dimakan semangka habis (butuh sampel).',
          '2. Kasus C (uji ketahanan baterai): bersifat destruktif sampai baterai aus (butuh sampel).',
          '3. Kasus B (pemilihan umum): setiap suara warga negara memiliki hak hukum yang mutlak dihitung dan tidak boleh diestimasi hanya dari cuplikan.',
          '4. Jadi situasi yang wajib sensus adalah kasus B.'
        ],
        theKingTip: 'THE KING: Sensus wajib jika taruhannya adalah keputusan legal/hukum yang menuntut akurasi 100% (seperti Pemilu atau Sensus Penduduk resmi negara).',
        answer: 'Pilihan (B) Pemilihan Presiden RI (wajib sensus karena menyangkut hak konstitusional setiap pemilih).'
      },
      {
        question: 'Sebuah kantong berisi 500 kelereng bernomor. Budi ingin mengambil 10 kelereng dengan cara acak sederhana (simple random sampling). Jelaskan bagaimana prosedur yang benar menggunakan undian!',
        stepByStep: [
          '1. Buat 500 lembar gulungan kertas kecil berisi nomor 1 sampai 500 dengan bentuk, ukuran, dan warna yang persis sama.',
          '2. Masukkan semua gulungan kertas ke dalam sebuah kotak tertutup.',
          '3. Aduk atau kocok kotak secara merata agar posisi kertas teracak sempurna.',
          '4. Ambil 1 gulungan tanpa melihat, catat nomornya, lalu ulangi pengambilan hingga terkumpul 10 nomor berbeda (tanpa pengembalian).',
          '5. Kelereng dengan 10 nomor tersebut menjadi anggota sampel penelitian.'
        ],
        theKingTip: 'THE KING: Syarat mutlak random sampling: semua gulungan kertas harus identik dan dikocok merata agar peluang tiap nomor terpilih sama persis ($1/500$).',
        answer: 'Tulis nomor 1–500 pada kertas berukuran identik, masukkan ke kotak, aduk merata, dan ambil 10 gulungan secara acak.'
      }
    ],
    summary: 'Populasi adalah himpunan semesta objek yang ingin diteliti, sedangkan sampel adalah sebagian kecil anggotanya. Syarat sampel yang sah adalah representatif (mencerminkan sifat populasi tanpa bias).'
  },

  // 3. MAT_LESSON_3
  {
    id: 'MAT_LESSON_3',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_3',
    chapterNumber: 'Bab III',
    chapterTitle: 'Peluang & Frekuensi Harapan',
    overview: 'Mengapa bandar kasino selalu untung dan ramalan cuaca bisa memperkirakan persentase hujan? Peluang mengukur seberapa besar kemungkinan suatu kejadian bisa terjadi di masa depan dalam skala angka 0 (mustahil) hingga 1 (pasti).',
    keyPoints: [
      {
        title: 'Ruang Sampel $S$ dan Titik Sampel',
        description: 'Ruang sampel adalah kumpulan semua kemungkinan hasil yang bisa terjadi dari suatu percobaan acak. Titik sampel adalah anggota tunggal dari ruang sampel. Banyaknya anggota ruang sampel dinotasikan dengan $n(S)$.',
        formulaOrConcept: 'Pada pelemparan koin dan dadu:\n$$1\\text{ Koin} \\implies n(S) = 2^k, \\quad 1\\text{ Dadu} \\implies n(S) = 6^d$$\nContoh: 2 dadu $\\implies n(S) = 6^2 = 36$.'
      },
      {
        title: 'Peluang Teoritik Suatu Kejadian $A$',
        description: 'Perbandingan antara banyaknya kejadian yang diinginkan $n(A)$ terhadap banyaknya seluruh kemungkinan anggota ruang sampel $n(S)$ dalam kondisi yang adil (fair).',
        formulaOrConcept: 'Rumus Peluang Teoritik:\n$$P(A) = \\dfrac{n(A)}{n(S)}$$\nNilai kepastian:\n$$0 \\le P(A) \\le 1$$'
      },
      {
        title: 'Peluang Komplemen $A\'$ (Bukan Kejadian $A$)',
        description: 'Peluang tidak terjadinya peristiwa $A$. Konsep ini sangat sakti untuk memecahkan soal rumit yang memuat kata "minimal satu" atau "paling sedikit".',
        formulaOrConcept: 'Peluang Komplemen:\n$$P(A\') = 1 - P(A)$$'
      },
      {
        title: 'Frekuensi Harapan $F_h(A)$',
        description: 'Banyaknya kejadian $A$ yang diperkirakan atau diharapkan muncul jika suatu percobaan acak diulang sebanyak $N$ kali berturut-turut.',
        formulaOrConcept: 'Rumus Frekuensi Harapan:\n$$F_h(A) = P(A) \\times N$$\ndengan $N$ adalah banyaknya percobaan.'
      },
      {
        title: 'Peluang Empirik (Frekuensi Relatif)',
        description: 'Peluang yang dihitung dari kenyataan data hasil eksperimen nyata di lapangan (bukan teori murni di atas kertas). Nilai empirik akan semakin mendekati peluang teoritik jika percobaannya diulang jutaan kali.',
        formulaOrConcept: 'Peluang Empirik:\n$$P_{\\text{empirik}}(A) = \\dfrac{\\text{Banyaknya kejadian } A \\text{ yang benar-benar muncul}}{\\text{Total percobaan yang sudah dilakukan}}$$'
      },
      {
        title: 'Peluang Gabungan Dua Kejadian Saling Lepas',
        description: 'Dua kejadian disebut saling lepas jika keduanya tidak mungkin terjadi secara bersamaan dalam satu kali percobaan (irisan kosong, $A \\cap B = \\emptyset$).',
        formulaOrConcept: 'Peluang Saling Lepas:\n$$P(A \\cup B) = P(A) + P(B)$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Dua buah dadu dilempar bersamaan sebanyak 180 kali. Tentukan frekuensi harapan munculnya mata dadu berjumlah 8!',
        stepByStep: [
          '1. Ruang sampel pelemparan dua dadu: $n(S) = 6 \\times 6 = 36$.',
          '2. Cari pasangan mata dadu yang berjumlah 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$.',
          '3. Hitung jumlah titik sampel: $n(A) = 5$.',
          '4. Peluang kejadian: $P(A) = \\dfrac{n(A)}{n(S)} = \\dfrac{5}{36}$.',
          '5. Frekuensi harapan untuk $N = 180$: $F_h(A) = P(A) \\times N = \\dfrac{5}{36} \\times 180 = 5 \\times 5 = 25\\text{ kali}$.'
        ],
        theKingTip: 'THE KING Pola Jumlah Dua Dadu: Jumlah 7 ada 6 titik (puncak). Jumlah 8 selisih 1 dari 7, maka ada $6 - 1 = 5$ titik. Langsung: $\\dfrac{5}{36} \\times 180 = 25$ kali. Selesai tanpa bikin tabel!',
        answer: '25 kali'
      },
      {
        question: 'Sebuah kantong berisi 5 kelereng merah, 4 kelereng biru, dan 3 kelereng hijau. Jika diambil satu kelereng secara acak, berapakah peluang terambil kelereng bukan berwarna merah?',
        stepByStep: [
          '1. Hitung total kelereng: $n(S) = 5 + 4 + 3 = 12$.',
          '2. Cara 1 (Langsung): Kelereng bukan merah adalah biru dan hijau $\\implies n(\\text{bukan merah}) = 4 + 3 = 7$. Peluang = $\\dfrac{7}{12}$.',
          '3. Cara 2 (Komplemen): $P(\\text{merah}) = \\dfrac{5}{12}$. Peluang bukan merah = $1 - \\dfrac{5}{12} = \\dfrac{7}{12}$.'
        ],
        theKingTip: 'THE KING: Ambil komplemen: $1 - \\dfrac{5}{12} = \\dfrac{7}{12}$. Sangat cepat!',
        answer: '7/12'
      },
      {
        question: 'Tiga keping uang logam dilempar bersama-sama satu kali. Tentukan peluang munculnya paling sedikit dua gambar (G)!',
        stepByStep: [
          '1. Ruang sampel 3 koin: $n(S) = 2^3 = 8$.',
          '2. Titik sampel 3 koin: {AAA, AAG, AGA, AGG, GAA, GAG, GGA, GGG}.',
          '3. Cari yang memuat "paling sedikit dua gambar" (bisa 2 gambar atau 3 gambar): {AGG, GAG, GGA, GGG}.',
          '4. Jumlah titik sampel: $n(A) = 4$.',
          '5. Peluang: $P(A) = \\dfrac{4}{8} = \\dfrac{1}{2}$.'
        ],
        theKingTip: 'THE KING: Segitiga Pascal untuk 3 koin adalah $1 - 3 - 3 - 1$ (0G, 1G, 2G, 3G). Yang punya $\\ge 2G$ adalah kelompok 2G (3 titik) dan 3G (1 titik) $\\implies 3 + 1 = 4$. Peluang $= 4/8 = 1/2$.',
        answer: '1/2'
      },
      {
        question: 'Dari satu set kartu bridge lengkap (52 kartu tanpa joker), diambil satu kartu secara acak. Berapakah peluang terambil kartu bernomor As atau kartu bergambar Hati (Heart)?',
        stepByStep: [
          '1. Total kartu bridge: $n(S) = 52$.',
          '2. Jumlah kartu As: $n(A) = 4$.',
          '3. Jumlah kartu Hati: $n(B) = 13$.',
          '4. Perhatikan irisan keduanya: ada 1 kartu As yang bergambar Hati (As Hati), jadi $n(A \\cap B) = 1$.',
          '5. Peluang gabungan tidak saling lepas: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = \\dfrac{4}{52} + \\dfrac{13}{52} - \\dfrac{1}{52} = \\dfrac{16}{52} = \\dfrac{4}{13}$.'
        ],
        theKingTip: 'THE KING: Jangan hitung As Hati dua kali! Ambil 13 kartu Hati, ditambah sisa 3 As lainnya (Sekop, Keriting, Wajik) $= 13 + 3 = 16$. Peluang $= 16 / 52 = 4 / 13$.',
        answer: '4/13'
      },
      {
        question: 'Sebuah dadu dilempar sekali. Tentukan peluang munculnya mata dadu faktor dari 6 atau bilangan prima!',
        stepByStep: [
          '1. Ruang sampel 1 dadu: $S = \\{1, 2, 3, 4, 5, 6\\} \\implies n(S) = 6$.',
          '2. Faktor dari 6: $A = \\{1, 2, 3, 6\\}$.',
          '3. Bilangan prima pada dadu: $B = \\{2, 3, 5\\}$.',
          '4. Gabungan kejadian $A \\cup B = \\{1, 2, 3, 5, 6\\}$.',
          '5. Jumlah anggota gabungan: $n(A \\cup B) = 5$.',
          '6. Peluang = $\\dfrac{5}{6}$.'
        ],
        theKingTip: 'THE KING: Cek yang BUKAN faktor 6 dan BUKAN prima, yaitu cuma angka 4! Peluang komplemen: $1 - P(4) = 1 - \\dfrac{1}{6} = \\dfrac{5}{6}$.',
        answer: '5/6'
      },
      {
        question: 'Peluang seorang siswa lulus tes masuk SMA favorit adalah 0,85. Jika ada 400 siswa dari sekolah tersebut yang mendaftar, berapa orang yang diperkirakan tidak lulus tes?',
        stepByStep: [
          '1. Peluang lulus: $P(\\text{lulus}) = 0,85$.',
          '2. Peluang tidak lulus (komplemen): $P(\\text{gagal}) = 1 - 0,85 = 0,15$.',
          '3. Total peserta $N = 400$.',
          '4. Frekuensi harapan tidak lulus: $F_h = P(\\text{gagal}) \\times N = 0,15 \\times 400 = 60\\text{ orang}$.'
        ],
        theKingTip: 'THE KING: Langsung kalikan persen gagal: $15\\% \\times 400 = 15 \\times 4 = 60$ siswa.',
        answer: '60 orang'
      },
      {
        question: 'Dua dadu dilempar bersamaan. Berapakah peluang munculnya dua mata dadu yang berjumlah kurang dari 5?',
        stepByStep: [
          '1. Total ruang sampel $n(S) = 36$.',
          '2. Jumlah yang kurang dari 5 adalah jumlah 2, jumlah 3, dan jumlah 4.',
          '3. Jumlah 2: (1,1) $\\implies 1$ titik.',
          '4. Jumlah 3: (1,2), (2,1) $\\implies 2$ titik.',
          '5. Jumlah 4: (1,3), (2,2), (3,1) $\\implies 3$ titik.',
          '6. Total titik sampel $= 1 + 2 + 3 = 6$.',
          '7. Peluang = $\\dfrac{6}{36} = \\dfrac{1}{6}$.'
        ],
        theKingTip: 'THE KING: Pola titik jumlah 2 sampai 7 naik bertahap: $1, 2, 3, 4, 5, 6$. Untuk jumlah $< 5$, ambil jumlah 2, 3, 4: langsung $1 + 2 + 3 = 6$. Peluang $= 6/36 = 1/6$.',
        answer: '1/6'
      },
      {
        question: 'Dalam sebuah kotak terdapat 8 bola lampu, dan 2 di antaranya rusak. Jika diambil 2 bola lampu sekaligus secara acak, berapakah peluang terambil kedua lampu dalam kondisi baik?',
        stepByStep: [
          '1. Total bola lampu $= 8$, lampu baik $= 6$, lampu rusak $= 2$.',
          '2. Banyak cara memilih 2 dari 8 lampu: $C(8,2) = \\dfrac{8 \\times 7}{2 \\times 1} = 28$.',
          '3. Banyak cara memilih 2 dari 6 lampu baik: $C(6,2) = \\dfrac{6 \\times 5}{2 \\times 1} = 15$.',
          '4. Peluang kedua lampu baik = $\\dfrac{15}{28}$.'
        ],
        theKingTip: 'THE KING: Peluang lampu 1 baik $= 6/8$, lampu 2 baik $= 5/7$. Kalikan langsung: $\\dfrac{6}{8} \\times \\dfrac{5}{7} = \\dfrac{3}{4} \\times \\dfrac{5}{7} = \\dfrac{15}{28}$. Cepat tanpa rumus kombinasi!',
        answer: '15/28'
      },
      {
        question: 'Pada percobaan melempar sebuah koin sebanyak 200 kali, muncul sisi angka sebanyak 92 kali. Tentukan peluang empirik dan selisihnya dengan peluang teoritik!',
        stepByStep: [
          '1. Peluang empirik kemunculan angka: $P_{\\text{empirik}} = \\dfrac{92}{200} = 0,46$.',
          '2. Peluang teoritik koin adil: $P_{\\text{teoritik}} = \\dfrac{1}{2} = 0,50$.',
          '3. Selisih mutlak $= |0,50 - 0,46| = 0,04$ (atau $4\\%$).'
        ],
        theKingTip: 'THE KING: Empirik $= 92/200 = 46\\%$. Teoritik $= 50\\%$. Selisih langsung $50\\% - 46\\% = 4\\% = 0,04$.',
        answer: 'Peluang empirik = 0,46; Selisih dengan teoritik = 0,04'
      },
      {
        question: 'Dua orang sahabat, Andi dan Budi, mengikuti ujian yang sama. Peluang Andi lulus adalah 0,8 sedangkan peluang Budi lulus adalah 0,7. Jika kelulusan mereka saling bebas, berapakah peluang hanya salah satu dari mereka yang lulus?',
        stepByStep: [
          '1. Data: $P(A) = 0,8 \\implies P(A\') = 0,2$ dan $P(B) = 0,7 \\implies P(B\') = 0,3$.',
          '2. Kasus 1: Andi lulus dan Budi gagal $= P(A) \\times P(B\') = 0,8 \\times 0,3 = 0,24$.',
          '3. Kasus 2: Andi gagal dan Budi lulus $= P(A\') \\times P(B) = 0,2 \\times 0,7 = 0,14$.',
          '4. Peluang hanya satu yang lulus: $0,24 + 0,14 = 0,38$.'
        ],
        theKingTip: 'THE KING: Rumus kilat: $(A \\times \\text{gagal } B) + (B \\times \\text{gagal } A) = (0,8 \\times 0,3) + (0,7 \\times 0,2) = 0,24 + 0,14 = 0,38$.',
        answer: '0,38'
      }
    ],
    summary: 'Peluang selalu bernilai antara 0 (mustahil) sampai 1 (pasti). Trik paling sering dipakai di ujian adalah komplemen: P(A\') = 1 - P(A), terutama untuk soal bertema "paling sedikit satu".'
  },

  // 4. MAT_LESSON_4
  {
    id: 'MAT_LESSON_4',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_4',
    chapterNumber: 'Bab IV',
    chapterTitle: 'Bilangan Berpangkat & Notasi Ilmiah',
    overview: 'Berapa jarak dari Bumi ke Matahari atau berapa massa sebuah partikel atom elektron? Menuliskan 150.000.000.000 meter tentu merepotkan. Di bab ini, eksponen dan notasi ilmiah hadir sebagai bahasa ringkas para ilmuwan untuk merapikan angka-angka raksasa maupun partikel mikroskopis.',
    keyPoints: [
      {
        title: 'Sifat Perkalian & Pembagian Eksponen Sebasis',
        description: 'Jika bilangan pokok (basis) sudah sama, operasi perkalian cukup dengan menjumlahkan pangkatnya, sedangkan operasi pembagian cukup dengan mengurangkan pangkatnya.',
        formulaOrConcept: 'Sifat Dasar Sebasis:\n$$a^m \\times a^n = a^{m+n}$$\n$$a^m \\div a^n = \\dfrac{a^m}{a^n} = a^{m-n}$$'
      },
      {
        title: 'Pemangkatan Pangkat dan Perkalian Basis',
        description: 'Pangkat yang dipangkatkan lagi menghasilkan perkalian eksponen. Jika ada perkalian bilangan di dalam kurung yang dipangkatkan, semua komponen di dalam kurung berhak menerima pangkat tersebut.',
        formulaOrConcept: 'Sifat Pemangkatan:\n$$(a^m)^n = a^{m \\times n}$$\n$$(a \\times b)^n = a^n \\times b^n, \\quad \\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$$'
      },
      {
        title: 'Pangkat Nol dan Pangkat Negatif',
        description: 'Setiap bilangan bukan nol yang dipangkatkan 0 selalu menghasilkan angka 1. Pangkat negatif bukanlah bilangan bernilai negatif, melainkan bentuk kebalikan pecahan (resiprokal).',
        formulaOrConcept: 'Pangkat Nol & Negatif:\n$$a^0 = 1 \\quad (a \\ne 0)$$\n$$a^{-n} = \\dfrac{1}{a^n}, \\quad \\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^n$$'
      },
      {
        title: 'Pangkat Pecahan (Hubungan dengan Bentuk Akar)',
        description: 'Pangkat berbentuk pecahan merepresentasikan bentuk akar. Pembilang pecahan menjadi pangkat bilangan di dalam, sedangkan penyebut pecahan menjadi indeks akarnya.',
        formulaOrConcept: 'Eksponen Pecahan:\n$$a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$$'
      },
      {
        title: 'Notasi Ilmiah (Bentuk Baku)',
        description: 'Standar penulisan angka ilmiah internasional dengan satu digit satuan di depan koma (antara 1 sampai 9,99...) dikalikan orde sepuluh berpangkat.',
        formulaOrConcept: 'Bentuk Baku:\n$$a \\times 10^n$$\nSyarat: $1 \\le a < 10$ dan $n$ adalah bilangan bulat.'
      },
      {
        title: 'Operasi Campuran Eksponen Aljabar',
        description: 'Kumpulkan koefisien angka dengan koefisien angka, dan kelompokkan variabel sejenis sebelum menerapkan hukum penjumlahan/pengurangan pangkat.',
        formulaOrConcept: 'Contoh Aljabar:\n$$\\dfrac{12x^5y^3}{4x^2y^7} = \\left(\\dfrac{12}{4}\\right) x^{5-2} y^{3-7} = 3x^3y^{-4} = \\dfrac{3x^3}{y^4}$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Sederhanakan bentuk aljabar eksponen: $\\dfrac{(2^3 \\times 2^5)^2}{2^8}$ !',
        stepByStep: [
          '1. Kerjakan bagian dalam kurung: perkalian basis sama pangkat dijumlahkan: $2^3 \\times 2^5 = 2^{3+5} = 2^8$.',
          '2. Pangkatkan dengan 2: $(2^8)^2 = 2^{8 \\times 2} = 2^{16}$.',
          '3. Lakukan pembagian: $\\dfrac{2^{16}}{2^8} = 2^{16 - 8} = 2^8$.',
          '4. Nilai $2^8 = 256$.'
        ],
        theKingTip: 'THE KING: Hitung langsung pangkat totalnya: dalam kurung $= 8$, dipangkatkan $2$ jadi $16$. Dikurang pembagi $8$: $16 - 8 = 8$. Hasilnya langsung $2^8 = 256$!',
        answer: '2⁸ = 256'
      },
      {
        question: 'Tentukan hasil dari operasi bilangan berpangkat: $3^{-2} + 2^{-3} - 6^0$ !',
        stepByStep: [
          '1. Ubah pangkat negatif ke pecahan: $3^{-2} = \\dfrac{1}{3^2} = \\dfrac{1}{9}$.',
          '2. Ubah $2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$.',
          '3. Pangkat nol: $6^0 = 1$.',
          '4. Samakan penyebut KPK dari 9 dan 8 adalah 72: $\\dfrac{8}{72} + \\dfrac{9}{72} - \\dfrac{72}{72} = \\dfrac{17 - 72}{72} = -\\dfrac{55}{72}$.'
        ],
        theKingTip: 'THE KING: Ingat $a^0 = 1$ selalu bernilai 1. Ubah negatif ke pecahan: $\\dfrac{1}{9} + \\dfrac{1}{8} - 1 = \\dfrac{17}{72} - \\dfrac{72}{72} = -\\dfrac{55}{72}$.',
        answer: '-55/72'
      },
      {
        question: 'Nyatakan jarak rata-rata bumi ke matahari sebesar 149.600.000 km dan ukuran bakteri sebesar 0,00000045 meter dalam bentuk baku (notasi ilmiah)!',
        stepByStep: [
          '1. Untuk 149.600.000: buat angka depan menjadi 1,496 (antara 1 dan 10).',
          '2. Koma digeser ke kiri sebanyak 8 langkah $\\implies 1,496 \\times 10^8\\text{ km}$.',
          '3. Untuk 0,00000045: buat angka depan menjadi 4,5.',
          '4. Koma digeser ke kanan sebanyak 7 langkah $\\implies 4,5 \\times 10^{-7}\\text{ meter}$.'
        ],
        theKingTip: 'THE KING: Geser koma ke KIRI pangkat POSITIF (+8). Geser koma ke KANAN pangkat NEGATIF (-7).',
        answer: '1,496 × 10⁸ km dan 4,5 × 10⁻⁷ meter'
      },
      {
        question: 'Sederhanakan bentuk pecahan aljabar eksponen: $\\left( \\dfrac{3a^2b^{-3}}{9a^{-1}b^2} \\right)^{-2}$ tanpa memuat pangkat negatif!',
        stepByStep: [
          '1. Sederhanakan bagian dalam kurung terlebih dahulu: $\\dfrac{3}{9} = \\dfrac{1}{3}$.',
          '2. Pangkat variabel $a$: $a^{2 - (-1)} = a^{2 + 1} = a^3$.',
          '3. Pangkat variabel $b$: $b^{-3 - 2} = b^{-5}$.',
          '4. Dalam kurung menjadi: $\\dfrac{a^3}{3b^5}$.',
          '5. Terapkan pangkat luar $-2$ (balik pecahan lalu kuadratkan): $\\left( \\dfrac{3b^5}{a^3} \\right)^2 = \\dfrac{9b^{10}}{a^6}$.'
        ],
        theKingTip: 'THE KING: Balik pecahan terlebih dahulu untuk menghilangkan tanda minus pada pangkat luar! Baru kuadratkan angka dan kalikan pangkat variabelnya.',
        answer: '9b¹⁰ / a⁶'
      },
      {
        question: 'Tentukan nilai dari operasi pangkat pecahan: $64^{\\frac{2}{3}} + 81^{\\frac{3}{4}} - 32^{\\frac{3}{5}}$ !',
        stepByStep: [
          '1. Ubah basis angka ke bentuk pangkat prima terkecil:',
          '2. $64 = 4^3 \\implies (4^3)^{\\frac{2}{3}} = 4^2 = 16$.',
          '3. $81 = 3^4 \\implies (3^4)^{\\frac{3}{4}} = 3^3 = 27$.',
          '4. $32 = 2^5 \\implies (2^5)^{\\frac{3}{5}} = 2^3 = 8$.',
          '5. Hitung total: $16 + 27 - 8 = 43 - 8 = 35$.'
        ],
        theKingTip: 'THE KING: Selalu cocokkan basis prima dengan penyebut pangkat pecahan! Penyebut 3 cari $x^3=64 \\implies 4$. Penyebut 4 cari $x^4=81 \\implies 3$. Penyebut 5 cari $x^5=32 \\implies 2$. Langsung $4^2 + 3^3 - 2^3 = 16 + 27 - 8 = 35$!',
        answer: '35'
      },
      {
        question: 'Tentukan nilai $x$ yang memenuhi persamaan eksponen: $3^{2x - 1} = \\dfrac{1}{27}$ !',
        stepByStep: [
          '1. Samakan basis kedua ruas menjadi bilangan berpangkat dengan basis 3.',
          '2. Ruas kanan: $27 = 3^3$, maka $\\dfrac{1}{27} = 3^{-3}$.',
          '3. Persamaan menjadi: $3^{2x - 1} = 3^{-3}$.',
          '4. Karena basis sudah sama-sama 3, samakan eksponennya: $2x - 1 = -3$.',
          '5. $2x = -3 + 1 = -2 \\implies x = -1$.'
        ],
        theKingTip: 'THE KING: $1/27 = 3^{-3}$. Langsung samakan eksponen: $2x - 1 = -3 \\implies 2x = -2 \\implies x = -1$.',
        answer: 'x = -1'
      },
      {
        question: 'Berapakah hasil perkalian bilangan notasi ilmiah: $(3,2 \\times 10^5) \\times (5,0 \\times 10^{-2})$ dinyatakan dalam bentuk baku?',
        stepByStep: [
          '1. Kalikan koefisien angka: $3,2 \\times 5,0 = 16,0$.',
          '2. Kalikan orde sepuluh dengan menjumlahkan pangkatnya: $10^5 \\times 10^{-2} = 10^{5 + (-2)} = 10^3$.',
          '3. Hasil sementara: $16,0 \\times 10^3$.',
          '4. Ubah ke bentuk baku standar ($1 \\le a < 10$): $16,0 = 1,6 \\times 10^1$.',
          '5. Maka menjadi $1,6 \\times 10^1 \\times 10^3 = 1,6 \\times 10^4$.'
        ],
        theKingTip: 'THE KING: $3,2 \\times 5 = 16$. Karena 16 lebih besar dari 10, geser koma jadi 1,6 dan tambahkan 1 ke pangkat: $10^{3+1} = 10^4 \\implies 1,6 \\times 10^4$.',
        answer: '1,6 × 10⁴'
      },
      {
        question: 'Jika $2^x = a$ dan $2^y = b$, nyatakan bentuk $2^{2x + 3y - 1}$ dalam variabel $a$ dan $b$!',
        stepByStep: [
          '1. Gunakan sifat pemecahan eksponen: $2^{2x + 3y - 1} = 2^{2x} \\times 2^{3y} \\times 2^{-1}$.',
          '2. $2^{2x} = (2^x)^2 = a^2$.',
          '3. $2^{3y} = (2^y)^3 = b^3$.',
          '4. $2^{-1} = \\dfrac{1}{2}$.',
          '5. Gabungkan seluruhnya: $a^2 \\times b^3 \\times \\dfrac{1}{2} = \\dfrac{a^2b^3}{2}$.'
        ],
        theKingTip: 'THE KING: Pecah eksponen: tanda tambah jadi kali, tanda kurang jadi bagi. $2^{2x} = a^2$, $2^{3y} = b^3$, $2^{-1} = 1/2$. Hasilnya langsung $\\dfrac{a^2b^3}{2}$.',
        answer: 'a²b³ / 2'
      },
      {
        question: 'Urutan bilangan berpangkat berikut dari yang nilainya terkecil hingga terbesar: $2^{60}$, $3^{48}$, $5^{24}$ adalah ...',
        stepByStep: [
          '1. Samakan pangkat luar dengan mencari FPB dari 60, 48, dan 24.',
          '2. FPB dari 60, 48, dan 24 adalah 12.',
          '3. Ubah semua bilangan ke pangkat luar 12:',
          '4. $2^{60} = (2^5)^{12} = 32^{12}$.',
          '5. $3^{48} = (3^4)^{12} = 81^{12}$.',
          '6. $5^{24} = (5^2)^{12} = 25^{12}$.',
          '7. Bandingkan bilangan pokoknya: $25 < 32 < 81$.',
          '8. Maka urutan dari terkecil: $5^{24} < 2^{60} < 3^{48}$.'
        ],
        theKingTip: 'THE KING Trik Banding Pangkat Besar: Cari FPB pangkatnya (12). Bandingkan basis dalamnya: $5^2 = 25$, $2^5 = 32$, $3^4 = 81$. Urutan langsung: $5^{24}, 2^{60}, 3^{48}$.',
        answer: '5²⁴, 2⁶⁰, 3⁴⁸'
      },
      {
        question: 'Sebuah pembelahan bakteri membelah diri menjadi 2 setiap 20 menit. Jika mula-mula ada 15 bakteri, berapakah jumlah bakteri setelah 2 jam?',
        stepByStep: [
          '1. Waktu total $= 2\\text{ jam} = 120\\text{ menit}$.',
          '2. Jumlah periode pembelahan: $n = \\dfrac{120}{20} = 6\\text{ kali}$.',
          '3. Rumus pertumbuhan eksponen: $J = J_0 \\times 2^n$.',
          '4. $J = 15 \\times 2^6 = 15 \\times 64$.',
          '5. $15 \\times 64 = 960\\text{ bakteri}$.'
        ],
        theKingTip: 'THE KING: 2 jam $= 6$ siklus pembelahan. Ingat $2^6 = 64$. Kalikan $15 \\times 64 = 960$ bakteri.',
        answer: '960 bakteri'
      }
    ],
    summary: 'Pada eksponen sebasis: kali jumlahkan pangkat, bagi kurangkan pangkat, pangkat dipangkatkan kalikan pangkat. Jangan lupa bentuk baku ilmiah memiliki aturan ketat 1 ≤ a < 10.'
  },

  // 5. MAT_BAB_5 (NEW)
  {
    id: 'MAT_LESSON_5',
    subject: 'MATEMATIKA',
    chapterId: 'MAT_BAB_5',
    chapterNumber: 'Bab V',
    chapterTitle: 'Bentuk Akar',
    overview: 'Mengapa $\\sqrt{25}$ bukan bentuk akar tapi $\\sqrt{24}$ disebut bentuk akar? Di bab ini kamu diajak berkenalan dengan bilangan irasional yang terbungkus tanda akar, cara menyederhanakan akar besar, serta trik merasionalkan penyebut pecahan agar rapi dan tidak memiliki akar di bagian bawahnya.',
    keyPoints: [
      {
        title: 'Pengertian Bentuk Akar (Bilangan Irasional)',
        description: 'Bentuk akar adalah akar dari suatu bilangan rasional yang hasilnya merupakan bilangan irasional (desimal tak berujung dan tak berpola). Contoh $\\sqrt{4} = 2$ bukan bentuk akar karena hasilnya bilangan rasional bulat, sedangkan $\\sqrt{3}$ dan $\\sqrt{8}$ adalah bentuk akar.',
        formulaOrConcept: 'Definisi:\n$$\\sqrt{a^2} = a \\quad (a \\ge 0)$$\nJika $a$ bukan kuadrat sempurna, maka $\\sqrt{a}$ adalah bentuk akar.'
      },
      {
        title: 'Menyederhanakan Bentuk Akar',
        description: 'Ubah bilangan di dalam akar menjadi perkalian dua bilangan, di mana salah satu bilangannya harus merupakan bilangan kuadrat terbesar (4, 9, 16, 25, 36, 49, 64, 81, 100, dst).',
        formulaOrConcept: 'Sifat Pemfaktoran Akar:\n$$\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}$$\nContoh: $\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$.'
      },
      {
        title: 'Operasi Penjumlahan dan Pengurangan Akar Sejenis',
        description: 'Bentuk akar hanya bisa dijumlahkan atau dikurangkan jika memiliki jenis (indeks dan radikan di dalam akar) yang persis sama, layaknya menjumlahkan variabel aljabar sejenis.',
        formulaOrConcept: 'Penjumlahan Akar Sejenis:\n$$a\\sqrt{c} + b\\sqrt{c} = (a + b)\\sqrt{c}$$\n$$a\\sqrt{c} - b\\sqrt{c} = (a - b)\\sqrt{c}$$'
      },
      {
        title: 'Operasi Perkalian dan Pembagian Bentuk Akar',
        description: 'Pada perkalian dan pembagian, angka luar dikalikan angka luar, dan angka di dalam akar dikalikan dengan angka di dalam akar.',
        formulaOrConcept: 'Perkalian Akar:\n$$a\\sqrt{b} \\times c\\sqrt{d} = (a \\times c)\\sqrt{b \\times d}$$\n$$\\dfrac{a\\sqrt{b}}{c\\sqrt{d}} = \\left(\\dfrac{a}{c}\\right)\\sqrt{\\dfrac{b}{d}}$$'
      },
      {
        title: 'Merasionalkan Penyebut Bentuk $\\dfrac{a}{\\sqrt{b}}$',
        description: 'Pecahan dalam matematika dianggap belum santun jika penyebutnya masih memuat tanda akar. Kalikan pembilang dan penyebut dengan bentuk akar sekawannya.',
        formulaOrConcept: 'Rasionalisasi Akar Tunggal:\n$$\\dfrac{a}{\\sqrt{b}} = \\dfrac{a}{\\sqrt{b}} \\times \\dfrac{\\sqrt{b}}{\\sqrt{b}} = \\dfrac{a\\sqrt{b}}{b} = \\dfrac{a}{b}\\sqrt{b}$$'
      },
      {
        title: 'Merasionalkan Penyebut Bentuk Binomial $\\dfrac{c}{a \\pm \\sqrt{b}}$',
        description: 'Gunakan prinsip perkalian sekawan selisih kuadrat $(x+y)(x-y) = x^2 - y^2$ untuk melenyapkan tanda akar pada penyebut binomial.',
        formulaOrConcept: 'Rasionalisasi Sekawan Binomial:\n$$\\dfrac{c}{a + \\sqrt{b}} \\times \\dfrac{a - \\sqrt{b}}{a - \\sqrt{b}} = \\dfrac{c(a - \\sqrt{b})}{a^2 - b}$$\n$$\\dfrac{c}{\\sqrt{a} - \\sqrt{b}} \\times \\dfrac{\\sqrt{a} + \\sqrt{b}}{\\sqrt{a} + \\sqrt{b}} = \\dfrac{c(\\sqrt{a} + \\sqrt{b})}{a - b}$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Sederhanakan bentuk operasi aljabar akar berikut: $2\\sqrt{48} - 3\\sqrt{12} + \\sqrt{75}$ !',
        stepByStep: [
          '1. Pecah setiap akar menjadi perkalian bilangan kuadrat terbesar:',
          '2. $\\sqrt{48} = \\sqrt{16 \\times 3} = 4\\sqrt{3} \\implies 2\\sqrt{48} = 2 \\times 4\\sqrt{3} = 8\\sqrt{3}$.',
          '3. $\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3} \\implies 3\\sqrt{12} = 3 \\times 2\\sqrt{3} = 6\\sqrt{3}$.',
          '4. $\\sqrt{75} = \\sqrt{25 \\times 3} = 5\\sqrt{3}$.',
          '5. Gabungkan koefisien karena semua sudah sejenis $\\sqrt{3}$:',
          '6. $8\\sqrt{3} - 6\\sqrt{3} + 5\\sqrt{3} = (8 - 6 + 5)\\sqrt{3} = 7\\sqrt{3}$.'
        ],
        theKingTip: 'THE KING: Cari angka kunci di dalam akar terkecil: 12 dibagi 4 sisa 3. Berarti semua suku pasti berujung $\\sqrt{3}$! $2(4) - 3(2) + 5 = 8 - 6 + 5 = 7\\sqrt{3}$.',
        answer: '7√3'
      },
      {
        question: 'Rasionalkan bentuk penyebut dari pecahan: $\\dfrac{12}{\\sqrt{6}}$ !',
        stepByStep: [
          '1. Kalikan pembilang dan penyebut dengan $\\sqrt{6}$:',
          '2. $\\dfrac{12}{\\sqrt{6}} \\times \\dfrac{\\sqrt{6}}{\\sqrt{6}} = \\dfrac{12\\sqrt{6}}{6}$.',
          '3. Bagi koefisien $12$ dengan $6$: $\\dfrac{12}{6} = 2$.',
          '4. Hasil akhir: $2\\sqrt{6}$.'
        ],
        theKingTip: 'THE KING: Rumus kilat: $\\dfrac{a}{\\sqrt{b}} = \\dfrac{a}{b}\\sqrt{b}$. Langsung bagi angka atas dengan angka dalam akar: $12 / 6 = 2$, tempelkan akarnya $\\implies 2\\sqrt{6}$!',
        answer: '2√6'
      },
      {
        question: 'Rasionalkan penyebut pecahan: $\\dfrac{6}{3 - \\sqrt{3}}$ !',
        stepByStep: [
          '1. Kalikan dengan akar sekawan penyebut yaitu $(3 + \\sqrt{3})$:',
          '2. $\\dfrac{6}{3 - \\sqrt{3}} \\times \\dfrac{3 + \\sqrt{3}}{3 + \\sqrt{3}} = \\dfrac{6(3 + \\sqrt{3})}{3^2 - (\\sqrt{3})^2}$.',
          '3. Penyebut $= 9 - 3 = 6$.',
          '4. Sederhanakan pembilang dan penyebut: $\\dfrac{6(3 + \\sqrt{3})}{6} = 3 + \\sqrt{3}$.'
        ],
        theKingTip: 'THE KING: Penyebut $3^2 - 3 = 6$. Angka atas 6 langsung membagi habis penyebut 6! Hasilnya langsung sisanya: $3 + \\sqrt{3}$.',
        answer: '3 + √3'
      },
      {
        question: 'Tentukan hasil perkalian bentuk akar: $(2\\sqrt{3} + 3\\sqrt{2})(2\\sqrt{3} - 3\\sqrt{2})$ !',
        stepByStep: [
          '1. Perhatikan bentuk perkalian merupakan pola selisih kuadrat $(x + y)(x - y) = x^2 - y^2$.',
          '2. Nilai $x = 2\\sqrt{3} \\implies x^2 = (2\\sqrt{3})^2 = 4 \\times 3 = 12$.',
          '3. Nilai $y = 3\\sqrt{2} \\implies y^2 = (3\\sqrt{2})^2 = 9 \\times 2 = 18$.',
          '4. Hasil akhir $= x^2 - y^2 = 12 - 18 = -6$.'
        ],
        theKingTip: 'THE KING: Pola $(A+B)(A-B)$ langsung kuadrat depan kurangi kuadrat belakang: $(2\\sqrt{3})^2 - (3\\sqrt{2})^2 = 12 - 18 = -6$.',
        answer: '-6'
      },
      {
        question: 'Rasionalkan penyebut pecahan: $\\dfrac{10}{\\sqrt{7} + \\sqrt{2}}$ !',
        stepByStep: [
          '1. Kalikan dengan sekawan $(\\sqrt{7} - \\sqrt{2})$:',
          '2. $\\dfrac{10}{\\sqrt{7} + \\sqrt{2}} \\times \\dfrac{\\sqrt{7} - \\sqrt{2}}{\\sqrt{7} - \\sqrt{2}} = \\dfrac{10(\\sqrt{7} - \\sqrt{2})}{(\\sqrt{7})^2 - (\\sqrt{2})^2}$.',
          '3. Hitung penyebut: $7 - 2 = 5$.',
          '4. Bagi angka 10 dengan 5: $\\dfrac{10}{5} = 2$.',
          '5. Hasil = $2(\\sqrt{7} - \\sqrt{2}) = 2\\sqrt{7} - 2\\sqrt{2}$.'
        ],
        theKingTip: 'THE KING: Selisih angka dalam akar penyebut $= 7 - 2 = 5$. Bagi angka atas dengan 5: $10 / 5 = 2$. Langsung kalikan sekawan: $2(\\sqrt{7} - \\sqrt{2})$.',
        answer: '2(√7 - √2) atau 2√7 - 2√2'
      },
      {
        question: 'Sebuah persegi panjang memiliki panjang $(5 + \\sqrt{2})\\text{ cm}$ dan lebar $(5 - \\sqrt{2})\\text{ cm}$. Tentukan luas dan panjang diagonal persegi panjang tersebut!',
        stepByStep: [
          '1. Luas $= p \\times l = (5 + \\sqrt{2})(5 - \\sqrt{2}) = 5^2 - (\\sqrt{2})^2 = 25 - 2 = 23\\text{ cm}^2$.',
          '2. Panjang diagonal dengan Pythagoras: $d = \\sqrt{p^2 + l^2}$.',
          '3. $p^2 = (5 + \\sqrt{2})^2 = 25 + 10\\sqrt{2} + 2 = 27 + 10\\sqrt{2}$.',
          '4. $l^2 = (5 - \\sqrt{2})^2 = 25 - 10\\sqrt{2} + 2 = 27 - 10\\sqrt{2}$.',
          '5. $p^2 + l^2 = (27 + 10\\sqrt{2}) + (27 - 10\\sqrt{2}) = 54$.',
          '6. Diagonal $d = \\sqrt{54} = \\sqrt{9 \\times 6} = 3\\sqrt{6}\\text{ cm}$.'
        ],
        theKingTip: 'THE KING: Luas selisih kuadrat $= 25 - 2 = 23\\text{ cm}^2$. Pada diagonal, suku akar saling menghabisi: $2 \\times (5^2 + 2) = 2 \\times 27 = 54$. Akar dari $54 = 3\\sqrt{6}\\text{ cm}$.',
        answer: 'Luas = 23 cm², Diagonal = 3√6 cm'
      },
      {
        question: 'Sederhanakan perkalian aljabar bentuk akar: $\\sqrt{3}(2\\sqrt{6} - \\sqrt{24})$ !',
        stepByStep: [
          '1. Sederhanakan $\\sqrt{24}$ terlebih dahulu: $\\sqrt{24} = \\sqrt{4 \\times 6} = 2\\sqrt{6}$.',
          '2. Perhatikan bentuk dalam kurung: $2\\sqrt{6} - 2\\sqrt{6} = 0$.',
          '3. Maka $\\sqrt{3} \\times 0 = 0$.'
        ],
        theKingTip: 'THE KING: Jangan buru-buru mengalikan ke dalam! Lihat bagian dalam kurung: $2\\sqrt{6} - \\sqrt{24} = 2\\sqrt{6} - 2\\sqrt{6} = 0$. Bilangan apa pun dikali 0 hasilnya nol!',
        answer: '0'
      },
      {
        question: 'Sederhanakan bentuk pecahan akar: $\\dfrac{\\sqrt{18} + \\sqrt{50}}{\\sqrt{32}}$ !',
        stepByStep: [
          '1. Sederhanakan semua suku ke bentuk $\\sqrt{2}$:',
          '2. $\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$.',
          '3. $\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$.',
          '4. $\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$.',
          '5. Substitusi: $\\dfrac{3\\sqrt{2} + 5\\sqrt{2}}{4\\sqrt{2}} = \\dfrac{8\\sqrt{2}}{4\\sqrt{2}} = \\dfrac{8}{4} = 2$.'
        ],
        theKingTip: 'THE KING: Semua suku berkelipatan $\\sqrt{2}$. Ambil koefisien akarnya saja: $\\dfrac{3 + 5}{4} = \\dfrac{8}{4} = 2$. Coret $\\sqrt{2}$-nya langsung!',
        answer: '2'
      },
      {
        question: 'Tentukan nilai $x$ dari persamaan: $\\sqrt{3^{x + 2}} = 27$ !',
        stepByStep: [
          '1. Ubah bentuk akar ke pangkat pecahan: $3^{\\frac{x+2}{2}}$.',
          '2. Ubah 27 ke basis 3: $27 = 3^3$.',
          '3. Samakan eksponennya: $\\dfrac{x + 2}{2} = 3$.',
          '4. Kalikan silang: $x + 2 = 6 \\implies x = 4$.'
        ],
        theKingTip: 'THE KING: Hilangkan tanda akar dengan mengkuadratkan kedua ruas: $3^{x+2} = 27^2 = (3^3)^2 = 3^6$. Maka $x + 2 = 6 \\implies x = 4$.',
        answer: 'x = 4'
      },
      {
        question: 'Hitung nilai dari bentuk akar berulang tak terhingga: $x = \\sqrt{20 + \\sqrt{20 + \\sqrt{20 + \\dots}}}$ !',
        stepByStep: [
          '1. Kuadratkan kedua ruas: $x^2 = 20 + \\sqrt{20 + \\sqrt{20 + \\dots}}$.',
          '2. Bagian akar berulang di kanan adalah $x$ itu sendiri: $x^2 = 20 + x$.',
          '3. Bentuk persamaan kuadrat: $x^2 - x - 20 = 0$.',
          '4. Faktorkan: $(x - 5)(x + 4) = 0$.',
          '5. Karena nilai akar harus positif, maka diambil $x = 5$.'
        ],
        theKingTip: 'THE KING Trik Akar Berulang Sakti: Cari dua bilangan berurutan yang jika dikalikan menghasilkan 20 ($4 \\times 5 = 20$). Karena tandanya POSITIF (+), ambil angka yang BESAR yaitu 5! Jika tandanya minus, ambil yang kecil (4).',
        answer: '5'
      }
    ],
    summary: 'Menyederhanakan bentuk akar selalu mengandalkan perkalian bilangan kuadrat terbesar (4, 9, 16, 25, 36, dst). Untuk merasionalkan penyebut binomial, kalikan dengan sekawan tanda berlawanan.'
  }
];
