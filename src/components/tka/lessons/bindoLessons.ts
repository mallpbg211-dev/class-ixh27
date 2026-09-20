import { TkaMateriLesson } from '../tkaMateriLessonsData';

export const BINDO_LESSONS: TkaMateriLesson[] = [
  // 1. BINDO_BAB_1
  {
    id: 'BINDO_LESSON_1',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_1',
    chapterNumber: 'Bab 1',
    chapterTitle: 'Teks Deskripsi',
    overview: 'Pernahkah kamu membaca tulisan yang begitu hidup sampai kamu bisa seolah mencium aroma laut, merasakan dinginnya angin senja, atau melihat megahnya candi kuno? Itulah kekuatan teks deskripsi! Di bab ini, kamu belajar merangkai kata konkret, menguasai sudut pandang pengarang, membedah kosakata serapan, serta menyusun kalimat yang padu (kohesif dan koheren).',
    keyPoints: [
      {
        title: 'Pengertian & Ciri Khusus Teks Deskripsi',
        description: 'Teks deskripsi menggambarkan suatu objek, tempat, atau peristiwa secara jelas dan terperinci dengan melibatkan pancaindra (penglihatan, pendengaran, penciuman, peraba, pengecap) sehingga pembaca seolah melihat, mendengar, dan merasakan sendiri objek yang dideskripsikan.',
        formulaOrConcept: 'Ciri Utama: Melibatkan citraan pancaindra, menggunakan kata sifat konkret (warna, bentuk, rasa), dan bersifat personal/subjektif.'
      },
      {
        title: 'Struktur Teks Deskripsi',
        description: 'Teks deskripsi dibangun atas tiga fondasi utama: Identifikasi/Deskripsi Umum (mengenalkan nama objek, lokasi, sejarah, atau gambaran pembuka), Deskripsi Bagian (perincian detail bagian-bagian objek berdasarkan klasifikasi atau pengamatan mendalam), dan Simpulan/Kesan (pendapat pribadi penulis terhadap objek).',
        formulaOrConcept: 'Struktur Baku: Identifikasi (Deskripsi Umum) ⟶ Deskripsi Bagian ⟶ Simpulan / Penutup'
      },
      {
        title: 'Sudut Pandang Pengarang (Point of View)',
        description: 'Sudut pandang orang pertama menggunakan kata ganti "aku" atau "kami" di mana pengarang bertindak sebagai saksi atau pelaku utama. Sudut pandang orang ketiga menggunakan "ia", "dia", atau "mereka" di mana pengarang bertindak sebagai pengamat luar atau sosok serbatahu (omniscient).',
        formulaOrConcept: 'Orang Pertama: "Aku/Saya/Kami" (Terlibat langsung)\nOrang Ketiga: "Ia/Dia/Mereka/Nama Tokoh" (Pengamat luar serbatahu)'
      },
      {
        title: 'Kosakata Serapan dan Kata Bentukan',
        description: 'Bahasa Indonesia menyerap kosakata dari bahasa daerah dan asing melalui proses adopsi (ejaan persis sama, misal: internet, data), adaptasi (penyesuaian ejaan bahasa Indonesia, misal: access ⟶ akses, system ⟶ sistem), atau penerjemahan (misal: download ⟶ unduh).',
        formulaOrConcept: 'Kaidah Adaptasi: -tion ⟶ -si (action ⟶ aksi), -ic ⟶ -ik (electronic ⟶ elektronik), -ty ⟶ -tas (activity ⟶ aktivitas).'
      },
      {
        title: 'Kohesi dan Koherensi Antarkalimat',
        description: 'Kohesi adalah keterpaduan bentuk lahiriah kalimat (menggunakan kata hubung/konjungsi, kata rujukan "ini", "itu", kata ganti, dan pengulangan kata kunci). Koherensi adalah keterpaduan makna atau gagasan batiniah antarkalimat sehingga membentuk satu alur pemikiran yang logis dan tidak melompat-lompat.',
        formulaOrConcept: 'Kohesi = Kerapian sambungan kata (alat penghubung)\nKoherensi = Kerapian logika alur gagasan (makna)'
      },
      {
        title: 'Majas / Gaya Bahasa Citraan',
        description: 'Penulis sering memakai majas personifikasi (menganggap benda mati hidup seperti manusia, contoh: "ombak berkejar-kejaran menyapa bibir pantai") dan majas metafora (perbandingan langsung tanpa kata pembanding, contoh: "raja siang membakar padang rumput").',
        formulaOrConcept: 'Personifikasi: Benda mati bertindak seperti manusia hidup\nMetafora: Kiasan langsung tanpa kata "seperti/laksana"'
      }
    ],
    exampleProblems: [
      {
        question: 'Bacalah kutipan teks berikut: "Memasuki kawasan Pantai Menganti, deburan ombak putih berkejar-kejaran memecah karang terjal. Angin laut yang basah menyapa pipi kami dengan lembut, membawa aroma asin garam yang khas." Tentukan dua jenis citraan pancaindra yang paling dominan dalam kutipan tersebut!',
        stepByStep: [
          '1. Frasa "deburan ombak putih berkejar-kejaran memecah karang": kata "putih" melibatkan indra penglihatan (visual), sedangkan kata "deburan ombak" melibatkan indra pendengaran (auditori).',
          '2. Frasa "angin laut menyapa pipi dengan lembut": melibatkan indra peraba / taktil (merasakan hembusan angin di kulit).',
          '3. Frasa "aroma asin garam": melibatkan indra penciuman (olfaktori).',
          '4. Citraan yang paling dominan dan terasa langsung adalah penglihatan/pendengaran dan perabaan/penciuman.'
        ],
        theKingTip: 'THE KING: Kata kunci pancaindra: "melihat/warna/cahaya" = Penglihatan; "deburan/gemericik" = Pendengaran; "menyapa kulit/lembut/panas" = Perabaan; "aroma/wangi/bau" = Penciuman.',
        answer: 'Citraan penglihatan (visual) dan citraan perabaan (taktil) / penciuman'
      },
      {
        question: 'Kutipan teks: "Kelinci kesayanganku bernama Bagas. Bulunya putih bersih menyerupai kapas halus. Matanya cokelat jernih berbinar-binar seperti kelereng kaca." Termasuk bagian struktur apakah paragraf tersebut dalam teks deskripsi?',
        stepByStep: [
          '1. Kalimat pertama memperkenalkan identitas kelinci bernama Bagas (bagian identifikasi awal).',
          '2. Namun kalimat berikutnya langsung menguraikan ciri-ciri fisik bagian tubuh secara mendetail: bulu putih seperti kapas dan mata cokelat seperti kelereng.',
          '3. Karena fokus utama paragraf adalah membedah perincian fisik spesifik anggota tubuh objek, paragraf tersebut termasuk bagian Deskripsi Bagian.'
        ],
        theKingTip: 'THE KING: Jika teks sudah merinci warna bulu, bentuk mata, tekstur, atau ukuran spesifik objek, itu PASTI bagian "Deskripsi Bagian"!',
        answer: 'Deskripsi Bagian'
      },
      {
        question: 'Ubahlah kata serapan bahasa asing "complex", "production", dan "creative" ke dalam penulisan kata baku bahasa Indonesia yang sesuai dengan kaidah EYD V!',
        stepByStep: [
          '1. Kata "complex": akhiran "-x" diserap menjadi "-ks", huruf "c" menjadi "k" ⟶ kompleks.',
          '2. Kata "production": akhiran "-tion" diserap menjadi "-si", "c" menjadi "k" ⟶ produksi.',
          '3. Kata "creative": akhiran "-ive" diserap menjadi "-if", "c" menjadi "k" ⟶ kreatif.'
        ],
        theKingTip: 'THE KING Pola Serapan Asing: -x ⟶ -ks (kompleks); -tion ⟶ -si (produksi); -ive ⟶ -if (kreatif).',
        answer: 'Kompleks, produksi, kreatif'
      },
      {
        question: 'Perhatikan dua kalimat berikut: (1) Danau Toba merupakan danau vulkanik terbesar di Asia Tenggara. (2) Keindahan pemandangan alamnya memikat ribuan wisatawan domestik maupun mancanegara setiap tahun. Unsur kohesi apakah yang menghubungkan kedua kalimat tersebut?',
        stepByStep: [
          '1. Perhatikan kata "alamnya" pada kalimat (2).',
          '2. Klitika "-nya" pada kata "alamnya" merujuk kembali kepada objek "Danau Toba" pada kalimat (1).',
          '3. Penggunaan kata rujukan atau pronomina penunjuk ini disebut kohesi gramatikal perujukan (referensi).',
          '4. Kalimat kedua terpadu rapi tanpa harus mengulang kata "Danau Toba" secara kaku.'
        ],
        theKingTip: 'THE KING: Klitika "-nya", kata "ini", "itu", dan "tersebut" adalah senjata utama kohesi referensial (kata rujukan).',
        answer: 'Kohesi gramatikal perujukan (referensi) melalui kata ganti / klitika "-nya".'
      },
      {
        question: 'Tentukan sudut pandang yang digunakan dalam teks berikut: "Rani tertegun memandangi lukisan itu. Dadanya bergemuruh mengenang nasihat kakeknya setahun silam. Ia tidak tahu bahwa di balik jendela, ibunya sedang memperhatikannya dengan penuh haru."',
        stepByStep: [
          '1. Teks menggunakan nama tokoh "Rani" dan kata ganti "ia". Ini menunjukkan sudut pandang orang ketiga.',
          '2. Penulis mengetahui perasaan batin Rani ("dadanya bergemuruh mengenang nasihat").',
          '3. Penulis juga mengetahui hal yang tidak diketahui Rani, yaitu keberadaan ibunya di balik jendela.',
          '4. Karena penulis mengetahui perasaan, pikiran, dan peristiwa dari semua tokoh tanpa batas, sudut pandang yang dipakai adalah orang ketiga serbatahu (third-person omniscient).'
        ],
        theKingTip: 'THE KING: Pakai "ia/nama orang" + tahu rahasia batin semua tokoh = Sudut Pandang Orang Ketiga Serbatahu!',
        answer: 'Sudut pandang orang ketiga serbatahu'
      },
      {
        question: 'Temukan majas personifikasi dalam kalimat berikut: "Kabut tebal perlahan merayap turun menyelimuti lereng Gunung Merbabu saat matahari mulai berpamitan."',
        stepByStep: [
          '1. Majas personifikasi melekatkan sifat/perilaku manusia pada benda mati.',
          '2. Benda mati: "Kabut tebal" diberi tindakan "merayap turun" dan "menyelimuti".',
          '3. Benda mati: "Matahari" diberi tindakan seperti manusia yaitu "berpamitan".',
          '4. Keduanya merupakan ungkapan personifikasi yang sangat puitis.'
        ],
        theKingTip: 'THE KING: Kabut tidak bisa merayap, matahari tidak bisa berpamitan. Tindakan khas manusia yang ditempel ke alam = Personifikasi.',
        answer: 'Kabut merayap turun menyelimuti dan matahari berpamitan'
      },
      {
        question: 'Manakah penulisan kata berimbuhan gabungan yang benar sesuai PUEBI/EYD? (A) pertanggung jawaban, (B) pertanggungjawaban, (C) menanda-tangani, (D) tanda tangani.',
        stepByStep: [
          '1. Kaidah kata majemuk: jika hanya mendapat awalan atau akhiran saja, penulisannya tetap terpisah (contoh: tanda tangani, berterima kasih).',
          '2. Namun jika kata majemuk mendapat awalan DAN akhiran sekaligus (konfiks), maka penulisannya WAJIB serangkai tanpa spasi (contoh: pertanggungjawaban, menandatangani).',
          '3. Pada pilihan (B), kata "tanggung jawab" mendapat konfiks per-...-an sehingga wajib serangkai: "pertanggungjawaban".'
        ],
        theKingTip: 'THE KING Kaidah Gabung Kata: Apit depan-belakang = Rapat serangkai (pertanggungjawaban, menandatangani). Kena satu sisi saja = Pisah (tanda tangani, bertanggung jawab).',
        answer: 'Pilihan (B) pertanggungjawaban'
      },
      {
        question: 'Apakah yang dimaksud dengan kalimat berkoherensi namun tidak kohesif? Berikan satu contoh singkat!',
        stepByStep: [
          '1. Koheren artinya maknanya nyambung secara logika akal sehat.',
          '2. Tidak kohesif artinya kalimat-kalimatnya tidak menggunakan kata sambung atau perujukan eksplisit (terlihat terputus secara fisik kata).',
          '3. Contoh: "Hujan deras mengguyur kota seharian. Jalanan tergenang air setinggi lutut." (Maknanya sangat padu sebab-akibat, meskipun tanpa kata penghubung "akibatnya" atau "sehingga").'
        ],
        theKingTip: 'THE KING: Koherensi adalah ruh gagasannya (nyambung logis), kohesi adalah jembatan katanya (konjungsi/rujukan).',
        answer: 'Hubungan gagasan secara logika terpadu padat, meskipun tidak menggunakan kata hubung lahiriah secara eksplisit.'
      },
      {
        question: 'Jelaskan perbedaan mendasar antara teks deskripsi objektif dan teks deskripsi subjektif!',
        stepByStep: [
          '1. Deskripsi Objektif: menggambarkan objek apa adanya berdasarkan fakta terukur tanpa menyisipkan opini, emosi, atau perasaan pribadi penulis (misal: panjang meja 120 cm, berbahan kayu jati berwarna cokelat tua).',
          '2. Deskripsi Subjektif / Impresionis: menggambarkan objek disertai tafsiran kesan emosional, penilaian indah/buruk, dan perasaan personal penulis (misal: meja jati kuno itu tampak memancarkan wibawa dan kehangatan masa lampau).'
        ],
        theKingTip: 'THE KING: Objektif = Fakta ukuran fisik murni. Subjektif = Bumbu opini dan perasaan penulis.',
        answer: 'Deskripsi objektif memaparkan fakta fisik tanpa opini; deskripsi subjektif memuat opini, kesan batin, dan tafsiran emosional penulis.'
      },
      {
        question: 'Bagaimana cara menentukan ide pokok pada paragraf deskripsi yang rinciannya tersebar di seluruh kalimat?',
        stepByStep: [
          '1. Pada sebagian paragraf deskripsi, tidak terdapat kalimat utama yang tegas di awal (deduktif) maupun di akhir (induktif).',
          '2. Seluruh kalimat sama-sama menguraikan rincian objek (paragraf deskriptif menyebar).',
          '3. Cara menentukan ide pokok: simpulkan inti keseluruhan dari hal apa yang digambarkan oleh seluruh kalimat tersebut secara menyeluruh.',
          '4. Rumuskan dalam satu kalimat ringkas yang memayungi semua detail gambaran.'
        ],
        theKingTip: 'THE KING: Paragraf deskriptif sering kali ide pokoknya "Tersirat Menyebar". Ambil intisari: Objek apa yang dilukiskan + kesan umumnya apa.',
        answer: 'Menyimpulkan isi keseluruhan paragraf karena ide pokoknya tersebar secara tersirat di seluruh kalimat pengembang.'
      }
    ],
    summary: 'Teks deskripsi memusatkan pancaindra pembaca pada objek nyata. Struktur utamanya adalah Identifikasi lalu Deskripsi Bagian. Perhatikan kohesi (kata hubung/rujukan) dan koherensi (kelogisan alur gagasan).'
  },

  // 2. BINDO_BAB_2
  {
    id: 'BINDO_LESSON_2',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_2',
    chapterNumber: 'Bab 2',
    chapterTitle: 'Teks Prosedur',
    overview: 'Pernah gagal memasak mi instan atau bingung saat merakit meja belajar baru? Teks prosedur adalah penyelamat hidup kita! Bab ini membekalimu keterampilan menyusun instruksi yang runut dan presisi, mengubah cerita narasi menjadi panduan langkah teknis, merancang infografik poster yang memikat, hingga teknik wawancara narasumber.',
    keyPoints: [
      {
        title: 'Tujuan & Struktur Baku Teks Prosedur',
        description: 'Teks prosedur bertujuan memandu pembaca melakukan atau membuat sesuatu secara berurutan agar tujuan berhasil dicapai dengan tepat, aman, dan efisien. Strukturnya terdiri dari: Tujuan (pengantar), Alat dan Bahan (lengkap takaran), Langkah-langkah (kronologis bernomor), dan Penutup/Simpulan (tips atau penegasan).',
        formulaOrConcept: 'Struktur: Tujuan ⟶ Alat & Bahan (Material) ⟶ Langkah-Langkah Berurutan ⟶ Penutup / Tips'
      },
      {
        title: 'Ciri Kebahasaan Teks Prosedur',
        description: 'Menggunakan kalimat imperatif (perintah, suruhan, larangan), kata kerja aksi material (potonglah, tuangkan, rekatkan), konjungsi penanda urutan waktu (pertama, kedua, lalu, setelah itu, akhirnya), kata keterangan alat/cara/kuantitas akurat (rebus selama 5 menit, iris setebal 1 cm), dan kalimat saran atau peringatan.',
        formulaOrConcept: 'Ciri Bahasa: Verba Aksi + Kalimat Imperatif + Keterangan Cara/Alat/Kuantitas + Konjungsi Kronologis'
      },
      {
        title: 'Mengubah Teks Cerpen/Narasi Menjadi Prosedur',
        description: 'Ketika membaca cerpen yang menceritakan tokoh sedang membuat kue atau kerajinan tangan, buang bagian dialog santai, konflik tokoh, dan deskripsi suasana latar. Ambil hanya inti bahan-bahan yang dipakai dan urutkan kembali tindakan aksi tokoh ke dalam format langkah kerja terstruktur.',
        formulaOrConcept: 'Teknik Alih Teks: Saring Bahan & Alat ⟶ Hilangkan Drama/Tokoh ⟶ Ubah Jadi Kalimat Imperatif Bernomor'
      },
      {
        title: 'Membaca & Menyusun Infografik serta Poster',
        description: 'Infografik menyajikan prosedur secara visual dengan hierarki informasi: judul mencolok di bagian atas, ikon visual atau diagram alur, teks ringkas padat, perpaduan warna kontras yang ramah mata, dan proporsi gambar yang memperjelas instruksi.',
        formulaOrConcept: 'Prinsip Infografik: Visual Menarik + Alur Logis Searah Jarum Jam/Vertikal + Teks Singkat Berbobot'
      },
      {
        title: 'Teknik Wawancara untuk Menulis Prosedur',
        description: 'Untuk menyusun prosedur otentik (misalnya resep tradisional keluarga atau tips merawat anggrek langka), penulis melakukan wawancara dengan narasumber ahli. Gunakan pertanyaan terbuka 5W+1H yang berfokus pada "Bagaimana cara..." dan "Berapa lama/takaran...".',
        formulaOrConcept: 'Pertanyaan Wawancara Prosedur: Fokus pada "Bagaimana urutannya?", "Apa bahannya?", dan "Apa tips anti-gagalnya?".'
      },
      {
        title: 'Kalimat Larangan, Batasan, dan Saran',
        description: 'Prosedur yang baik selalu menyertakan batasan teknis agar tidak membahayakan pengguna atau merusak hasil akhir. Kalimat larangan memakai kata "jangan/hindari", kalimat batasan memakai batas kuantitas "hingga berwarna kecokelatan", dan kalimat saran memakai kata "sebaiknya/disarankan".',
        formulaOrConcept: 'Larangan: "Jangan biarkan..."\nBatasan: "...hingga mendidih rata"\nSaran: "Sebaiknya gunakan api kecil..."'
      }
    ],
    exampleProblems: [
      {
        question: 'Ubahlah kalimat pasif berikut menjadi kalimat imperatif (perintah) yang efektif untuk teks prosedur: "Campuran adonan tepung dan telur tersebut harus diaduk perlahan-lahan sampai tidak ada gumpalan."',
        stepByStep: [
          '1. Kalimat imperatif menghilangkan subjek formal atau kata bantu pasif "harus dilakukan".',
          '2. Awali langsung dengan kata kerja dasar tindakan aktif (infinitive verb) yang dapat ditambahi partikel penegas "-lah".',
          '3. Ubah "harus diaduk perlahan-lahan" menjadi "Aduklah campuran adonan tepung dan telur perlahan-lahan".',
          '4. Pertahankan keterangan batasan: "sampai tidak ada gumpalan!".'
        ],
        theKingTip: 'THE KING: Buang kata "harus/dapat/bisa", langsung tancapkan kata kerja di awal: "Aduklah adonan perlahan-lahan hingga tidak menggumpal!".',
        answer: 'Aduklah campuran adonan tepung dan telur perlahan-lahan sampai tidak ada gumpalan!'
      },
      {
        question: 'Sebuah kutipan cerpen berbunyi: "Sore itu Nenek mengajak Sinta ke kebun belakang. Nenek memetik lima lembar daun sirih segar yang sudah tua. Sambil bercerita tentang masa mudanya, Nenek mencuci daun itu sampai bersih dari tanah, lalu merebusnya di dalam panci kecil berisi dua gelas air hingga airnya tersisa satu gelas." Ubahlah kutipan tersebut menjadi dua butir langkah prosedur!',
        stepByStep: [
          '1. Eliminasi unsur fiksi: hilangkan dialog, cerita masa muda nenek, dan latar sore hari.',
          '2. Identifikasi alat, bahan, dan takaran: 5 lembar daun sirih tua, panci kecil, 2 gelas air.',
          '3. Susun langkah bernomor menggunakan kalimat imperatif aksi:',
          '   Langkah 1: Petik dan cucilah lima lembar daun sirih tua hingga bersih dari sisa tanah.',
          '   Langkah 2: Rebuslah daun sirih di dalam panci berisi dua gelas air hingga menyusut tersisa satu gelas air.'
        ],
        theKingTip: 'THE KING: Coret semua cerita basa-basi nenek! Ambil angka bahan (5 daun, 2 gelas air) dan kata kerja aksi (cuci, rebus hingga sisa 1 gelas).',
        answer: '1. Cucilah lima lembar daun sirih hingga bersih dari tanah. 2. Rebuslah daun tersebut dalam panci berisi dua gelas air hingga tersisa satu gelas.'
      },
      {
        question: 'Manakah dari kelompok kata berikut yang semuanya merupakan konjungsi penanda urutan kronologis dalam teks prosedur? (A) karena, sebab, akibatnya; (B) pertama, kemudian, setelah itu, akhirnya; (C) walaupun, meskipun, kendatipun; (D) dan, atau, serta.',
        stepByStep: [
          '1. Konjungsi kausalitas (sebab-akibat): karena, sebab, akibatnya.',
          '2. Konjungsi pertentangan: walaupun, meskipun, kendatipun.',
          '3. Konjungsi gabungan: dan, atau, serta.',
          '4. Konjungsi temporal / urutan kronologis: pertama, lalu, kemudian, setelah itu, selanjutnya, akhirnya.',
          '5. Pilihan yang tepat adalah (B).'
        ],
        theKingTip: 'THE KING: Teks prosedur bertumpu pada waktu: Pertama ⟶ Kedua ⟶ Lalu ⟶ Setelah itu ⟶ Akhirnya!',
        answer: 'Pilihan (B) pertama, kemudian, setelah itu, akhirnya'
      },
      {
        question: 'Apa fungsi bagian "Tujuan" pada struktur awal teks prosedur, dan mengapa bagian tersebut tidak boleh diabaikan?',
        stepByStep: [
          '1. Bagian Tujuan memberikan gambaran umum mengenai apa yang akan dibuat, dilakukan, atau dioperasikan.',
          '2. Bagian ini menjelaskan manfaat atau hasil akhir yang akan diperoleh pembaca.',
          '3. Tujuan berfungsi memotivasi pembaca dan memberi pemahaman awal mengapa prosedur ini penting dan bagaimana tingkat keberhasilannya.'
        ],
        theKingTip: 'THE KING: Bagian Tujuan = "Janji Hasil Akhir" sekaligus gambaran target yang akan dicapai pembaca.',
        answer: 'Menjelaskan sasaran, manfaat, dan hasil akhir yang akan diraih pembaca setelah menyelesaikan panduan.'
      },
      {
        question: 'Temukan keterangan batasan dan keterangan cara dalam kalimat berikut: "Tepung terigu harus diayak dengan saringan kawat halus sampai menghasilkan butiran yang sangat lembut."',
        stepByStep: [
          '1. Keterangan cara menjelaskan dengan teknik/alat apa tindakan dikerjakan: "dengan saringan kawat halus".',
          '2. Keterangan batasan/hasil akhir menyatakan batas kondisi yang harus dicapai: "sampai menghasilkan butiran yang sangat lembut".'
        ],
        theKingTip: 'THE KING: "Dengan alat apa" = Cara. "Sampai batas kondisi apa" = Batasan.',
        answer: 'Keterangan cara: "dengan saringan kawat halus"; Keterangan batasan: "sampai menghasilkan butiran yang sangat lembut".'
      },
      {
        question: 'Mengapa pada bagian alat dan bahan teks prosedur membuat makanan, takaran wajib ditulis dengan satuan kuantitatif yang presisi (misal: 250 gram, 1/2 sdt), bukan sekadar "secukupnya"?',
        stepByStep: [
          '1. Kata "secukupnya" bersifat relatif dan membingungkan pembaca pemula.',
          '2. Reaksi kimiawi memasak (terutama memanggang kue/roti) membutuhkan rasio bahan yang tepat agar adonan mengembang sempurna.',
          '3. Satuan kuantitatif presisi menjamin konsistensi hasil akhir sehingga pembaca dapat menduplikasi resep dengan tingkat keberhasilan 100%.'
        ],
        theKingTip: 'THE KING: Takaran kuantitatif presisi menjamin replikasi prosedur anti-gagal bagi pemula!',
        answer: 'Agar instruksi dapat ditiru secara akurat dan konsisten tanpa menimbulkan keraguan pada takaran bagi pembaca pemula.'
      },
      {
        question: 'Sebutkan tiga elemen visual penting yang wajib ada dalam sebuah poster infografik cara mencuci tangan pakai sabun!',
        stepByStep: [
          '1. Judul persuasif yang singkat dan mencolok di bagian atas.',
          '2. Ilustrasi gambar atau ikon langkah-langkah tangan bernomor yang jelas dan mudah dipahami dalam sekali pandang.',
          '3. Teks petunjuk singkat pendamping gambar yang menggunakan kalimat imperatif aksi serta durasi waktu (misal: "gosok selama 20 detik").'
        ],
        theKingTip: 'THE KING Tiga Elemen Infografik: Judul Tegas, Gambar/Ikon Urutan Bernomor, dan Keterangan Singkat Berdurasi.',
        answer: 'Judul yang jelas, ilustrasi gambar langkah bernomor, dan teks pendamping singkat berkalimat imperatif.'
      },
      {
        question: 'Dalam menyusun teks panduan pengoperasian mesin blender, di manakah posisi yang paling tepat untuk meletakkan kalimat peringatan keselamatan kerja (safety warning)?',
        stepByStep: [
          '1. Peringatan keselamatan kerja (misalnya "Pastikan kabel tercabut saat membersihkan mata pisau") bisa diletakkan di awal sebelum langkah penggunaan.',
          '2. Dapat juga diletakkan tepat pada butir langkah spesifik yang berisiko tinggi dengan kotak sorotan (highlight box) khusus.',
          '3. Tujuannya agar pengguna membaca peringatan tersebut SEBELUM melakukan tindakan berisiko, bukan sesudahnya.'
        ],
        theKingTip: 'THE KING: Peringatan bahaya SELALU mendahului tindakan! Tempatkan tepat pada langkah berisiko dengan tanda seru/peringatan.',
        answer: 'Tepat pada butir langkah kerja terkait dengan kotak penanda khusus atau di bagian awal sebelum mesin dioperasikan.'
      },
      {
        question: 'Jika kamu mewawancarai seorang barista kopi untuk menyusun teks prosedur seduh kopi manual (V60), susunlah dua pertanyaan wawancara yang tepat untuk menggali keterangan cara dan batasan!',
        stepByStep: [
          '1. Pertanyaan untuk menggali keterangan cara: "Bagaimanakah teknik gerakan menuangkan air panas dari teko leher angsa agar bubuk kopi terekstraksi merata?"',
          '2. Pertanyaan untuk menggali keterangan batasan: "Berapa derajat suhu air ideal dan berapa menit batas maksimal waktu penyeduhan agar rasa kopi tidak pahit gosong?"'
        ],
        theKingTip: 'THE KING: Tanyakan "Bagaimana teknik tuangnya?" (Cara) dan "Berapa menit batas maksimalnya?" (Batasan).',
        answer: '1. Bagaimanakah teknik menuangkan air secara merata? 2. Berapa suhu air yang tepat dan berapa menit batas waktu penyeduhan?'
      },
      {
        question: 'Tentukan jenis kalimat prosedur berikut: "Hindari penggunaan air mendidih saat mengencerkan madu murni agar enzim alaminya tidak rusak." Apakah termasuk kalimat perintah, kalimat larangan, atau kalimat saran?',
        stepByStep: [
          '1. Kalimat diawali dengan kata kerja "Hindari".',
          '2. Kata "hindari" atau "jangan" berfungsi mencegah pembaca melakukan tindakan tertentu yang berdampak buruk.',
          '3. Jadi kalimat tersebut merupakan jenis Kalimat Larangan (atau peringatan bernada pencegahan).'
        ],
        theKingTip: 'THE KING: Kata "Hindari / Jangan" = Kalimat Larangan. Kata "Sebaiknya" = Saran. Kata "Potonglah / Rebuslah" = Perintah.',
        answer: 'Kalimat Larangan'
      }
    ],
    summary: 'Teks prosedur menuntut urutan kronologis yang pantang tertukar. Gunakan kalimat imperatif aksi, keterangan takaran kuantitatif yang presisi, serta konjungsi penanda urutan waktu yang runtut.'
  },

  // 3. BINDO_BAB_3 (NEW)
  {
    id: 'BINDO_LESSON_3',
    subject: 'B_INDO',
    chapterId: 'BINDO_BAB_3',
    chapterNumber: 'Bab 3',
    chapterTitle: 'Teks Rekon',
    overview: 'Pernahkah kamu menulis diary tentang liburan seru atau membaca biografi tokoh hebat di media sosial? Itulah teks rekon (cerita ulang). Di era banjir informasi digital saat ini, bab ini melatih ketajaman berpikir kritismu untuk memilah mana fakta yang teruji, asumsi yang belum tentu benar, opini subjektif, serta cara menggunakan kamus KBBI untuk istilah medsos kekinian.',
    keyPoints: [
      {
        title: 'Pengertian & Ragam Jenis Teks Rekon',
        description: 'Teks rekon (recount text) adalah teks yang menceritakan kembali pengalaman, peristiwa, atau perbuatan di masa lampau secara kronologis untuk memberi informasi faktual atau menghibur pembaca. Terbagi atas: Rekon Pribadi (buku harian/pengalaman pribadi), Rekon Faktual/Informatif (laporan investigasi polisi, berita sejarah, laporan eksperimen sains), dan Rekon Imajinatif (cerita fiktif masa lalu).',
        formulaOrConcept: 'Jenis Teks Rekon: Rekon Pribadi (Personal) | Rekon Faktual (Sejarah/Sains) | Rekon Imajinatif (Kisah Fiksi)'
      },
      {
        title: 'Struktur Generik Teks Rekon',
        description: 'Teks rekon dibangun dari tiga bagian runtut: Orientasi (mengenalkan informasi 5W: siapa yang terlibat, apa peristiwanya, di mana tempatnya, dan kapan terjadinya), Urutan Peristiwa / Rekaman Kejadian (kronologi kejadian babak demi babak menggunakan konjungsi urutan waktu), dan Reorientasi (penutup opsional berisi rangkuman, refleksi pribadi, atau kesan penulis).',
        formulaOrConcept: 'Struktur Baku: Orientasi ⟶ Rekaman Urutan Peristiwa (Events) ⟶ Reorientasi (Refleksi/Kesan Penulis)'
      },
      {
        title: 'Membedah Fakta, Asumsi, dan Opini',
        description: 'Ini adalah keterampilan terpenting di era media sosial: Fakta adalah peristiwa nyata yang sudah terjadi, teruji kebenarannya secara objektif, dan memiliki data angka/bukti dokumen otentik. Asumsi adalah dugaan sementara yang belum tentu benar dan masih memerlukan pembuktian lapangan. Opini adalah pandangan, penilaian rasa, sikap, atau perasaan subjektif seseorang yang bisa berbeda bagi orang lain.',
        formulaOrConcept: 'Fakta: Objektif + Terbukti Nyata + Ada Data/Angka\nAsumsi: Dugaan/Perkiraan awal (Belum terbukti)\nOpini: Pandangan/Sikap subjektif (Kata: "menurut saya", "sangat indah", "seharusnya")'
      },
      {
        title: 'Menyaring Informasi & Menangkal Hoaks di Media Sosial',
        description: 'Di media sosial, hoaks sering berkedok berita fakta. Periksa keaslian sumber berita (terdaftar di Dewan Pers), telusuri jejak gambar/foto digital menggunakan pencarian gambar terbalik (reverse image search), waspadai judul sensasional umpan klik (clickbait), dan bedakan akun resmi terverifikasi dengan akun tiruan anonim.',
        formulaOrConcept: 'Cek Fakta: Cek Sumber Resmi + Waspadai Judul Clickbait Bombastis + Verifikasi Tanggal Peristiwa'
      },
      {
        title: 'Kosakata Gaul Medsos vs Kosakata Baku KBBI',
        description: 'Di media sosial sering muncul istilah serapan slang atau neologisme (misal: flexing, spill the tea, FOMO, netizen). Dalam situasi formal atau ujian TKA resmi, kata-kata tersebut memiliki padanan baku bahasa Indonesia di KBBI (misal: warganet untuk netizen, pamer kemewahan untuk flexing).',
        formulaOrConcept: 'Kamus KBBI V: Sumber rujukan tertinggi untuk mengecek makna leksikal, ejaan baku, kelas kata (nomina, verba, adjektiva), dan etimologi.'
      },
      {
        title: 'Penggunaan Kamus Cetak dan KBBI Daring',
        description: 'Mencari makna kata di kamus menggunakan Kata Dasar (bukan kata berimbuhan). Contoh: kata "mengomunikasikan" dicari pada entri huruf K dengan kata dasar "komunikasi". Memahami tanda leksikal di KBBI: n (nomina/kata benda), v (verba/kata kerja), a (adjektiva/kata sifat), adv (adverbia/keterangan).',
        formulaOrConcept: 'Kunci Kamus: Kupas imbuhan ⟶ Cari KATA DASAR ⟶ Cermati kelas kata (n, v, a).'
      }
    ],
    exampleProblems: [
      {
        question: 'Tentukan apakah kalimat berikut termasuk FAKTA, ASUMSI, atau OPINI: "Berdasarkan catatan Badan Nasional Penanggulangan Bencana (BNPB), gempa berkekuatan magnitudo 6,2 mengguncang wilayah Majene pada tanggal 15 Januari 2021 pukul 02.28 WITA."',
        stepByStep: [
          '1. Analisis sumber: ada lembaga resmi yang jelas dan berwenang (BNPB).',
          '2. Analisis data: memuat data angka magnitudo presisi (6,2), tanggal pasti (15 Januari 2021), dan jam kejadian eksak (02.28 WITA).',
          '3. Peristiwa tersebut telah benar-benar terjadi dan dapat dibuktikan kebenarannya secara historis objektif.',
          '4. Kesimpulan: Kalimat ini adalah FAKTA.'
        ],
        theKingTip: 'THE KING: Ada lembaga resmi + tanggal waktu pasti + angka ukuran terukur = Murni FAKTA!',
        answer: 'FAKTA'
      },
      {
        question: 'Tentukan jenis kalimat berikut (Fakta / Asumsi / Opini): "Pemberlakuan jam belajar malam tanpa gawai selama dua jam dipastikan akan langsung melipatgandakan nilai rapor seluruh siswa di sekolah kita."',
        stepByStep: [
          '1. Perhatikan kata "dipastikan akan langsung melipatgandakan".',
          '2. Kalimat ini memperkirakan suatu hasil di masa depan yang belum terbukti secara ilmiah.',
          '3. Nilai rapor siswa dipengaruhi oleh banyak faktor lain (minat belajar, metode guru, kesehatan, bimbingan keluarga).',
          '4. Pernyataan yang menganggap suatu hal pasti berhasil tanpa bukti pengujian konkret disebut ASUMSI (dugaan yang terlalu berani).'
        ],
        theKingTip: 'THE KING: Kata "dipastikan akan...", "kemungkinan besar karena..." yang belum terbukti di lapangan adalah ASUMSI.',
        answer: 'ASUMSI'
      },
      {
        question: 'Tentukan jenis kalimat berikut: "Taman wisata edukasi yang baru dibuka di pinggir kota itu terasa sangat membosankan dan tiket masuknya terlalu mahal untuk kantong pelajar."',
        stepByStep: [
          '1. Perhatikan kata sifat penilaian subjektif: "terasa sangat membosankan" dan "terlalu mahal".',
          '2. Sesuatu yang membosankan bagi seseorang bisa jadi sangat menarik dan edukatif bagi orang lain.',
          '3. Harga tiket yang dianggap mahal oleh seorang pelajar belum tentu mahal bagi keluarga lain.',
          '4. Karena mencerminkan perasaan, selera, dan penilaian pribadi, kalimat ini adalah OPINI.'
        ],
        theKingTip: 'THE KING: Kata sifat selera ("sangat membosankan", "terlalu mahal", "sangat lezat", "paling keren") adalah ciri mutlak OPINI!',
        answer: 'OPINI'
      },
      {
        question: 'Bacalah penggalan teks rekon sejarah berikut: "Pada tanggal 17 Agustus 1945 tepat pukul 10.00 WIB, di Jalan Pegangsaan Timur Nomor 56 Jakarta, Ir. Soekarno didampingi Drs. Mohammad Hatta membacakan naskah Proklamasi Kemerdekaan Indonesia." Bagian struktur teks rekon apakah kutipan tersebut?',
        stepByStep: [
          '1. Kutipan memuat informasi siapa yang terlibat (Ir. Soekarno dan Drs. Mohammad Hatta).',
          '2. Memuat informasi waktu kejadian (17 Agustus 1945 pukul 10.00 WIB).',
          '3. Memuat informasi tempat kejadian (Jalan Pegangsaan Timur No. 56 Jakarta).',
          '4. Memuat peristiwa yang terjadi (pembacaan naskah proklamasi).',
          '5. Karena berisi pengenalan latar peristiwa 5W, kutipan ini merupakan bagian Orientasi.'
        ],
        theKingTip: 'THE KING: Paragraf pembuka yang memuat Siapa, Kapan, di Mana, dan Apa peristiwanya = Bagian ORIENTASI!',
        answer: 'Orientasi'
      },
      {
        question: 'Jika kamu ingin mencari arti kata "berkelanjutan" di dalam Kamus Besar Bahasa Indonesia (KBBI), pada entri huruf apakah kamu harus mencarinya dan apa kata dasarnya?',
        stepByStep: [
          '1. Kata "berkelanjutan" memiliki imbuhan gabungan (konfiks) "ber-an" dan sufiks "-kan".',
          '2. Kupas seluruh imbuhan untuk menemukan kata dasar: ber- + lanjut + -an.',
          '3. Kata dasarnya adalah "lanjut".',
          '4. Di dalam kamus KBBI, kata ini dicari pada entri huruf awalan L (lanjut).',
          '5. Di bawah entri "lanjut", barulah kita menemukan kata turunan "berkelanjutan".'
        ],
        theKingTip: 'THE KING: Selalu cari KATA DASAR! "Berkelanjutan" ⟶ kata dasar "lanjut" ⟶ cari di huruf L.',
        answer: 'Huruf L, dengan kata dasar "lanjut"'
      },
      {
        question: 'Sebutkan padanan istilah baku bahasa Indonesia dalam KBBI untuk istilah media sosial populer berikut: (1) upload, (2) download, (3) online, (4) offline!',
        stepByStep: [
          '1. Kata "upload" diserap melalui penerjemahan menjadi: unggah.',
          '2. Kata "download" diserap menjadi: unduh.',
          '3. Kata "online" diserap menjadi: daring (dalam jaringan).',
          '4. Kata "offline" diserap menjadi: luring (luar jaringan).'
        ],
        theKingTip: 'THE KING Kuartet Medsos Baku: Upload = Unggah; Download = Unduh; Online = Daring; Offline = Luring.',
        answer: '(1) Unggah, (2) Unduh, (3) Daring, (4) Luring'
      },
      {
        question: 'Bagaimanakah urutan kronologis yang benar untuk merekonstruksi tiga peristiwa sejarah berikut: (1) Belanda menyerah tanpa syarat kepada Jepang di Kalijati, (2) Pasukan Sekutu menjatuhkan bom atom di Hiroshima dan Nagasaki, (3) Jepang menduduki wilayah Indonesia menggantikan Hindia Belanda.',
        stepByStep: [
          '1. Peristiwa (1) terjadi pada 8 Maret 1942 di Kalijati, Subang (Belanda menyerah ke Jepang).',
          '2. Menyusul peristiwa tersebut, (3) Jepang secara resmi mulai menduduki Indonesia dari tahun 1942 hingga 1945.',
          '3. Pada akhir Perang Pasifik, (2) Sekutu menjatuhkan bom atom di Hiroshima (6 Agustus 1945) dan Nagasaki (9 Agustus 1945) yang memaksa Jepang menyerah.',
          '4. Urutan kronologis yang benar adalah: (1) ⟶ (3) ⟶ (2).'
        ],
        theKingTip: 'THE KING: Cermati garis waktu sejarah: Belanda kalah (1942) ⟶ Penjajahan Jepang (1942-1945) ⟶ Bom Atom Hiroshima (Agustus 1945).',
        answer: '(1) ⟶ (3) ⟶ (2)'
      },
      {
        question: 'Sebuah pesan berantai di grup aplikasi pesan bertuliskan: "SEBARKAN! Menghirup uap air garam panas selama 10 menit terbukti membunuh seluruh virus penyakit dalam tenggorokan! Dokter spesialis di luar negeri sudah membuktikannya!" Sebutkan dua ciri hoaks yang tampak jelas pada pesan tersebut!',
        stepByStep: [
          '1. Menggunakan kalimat imperatif panik dan mendesak: "SEBARKAN!" (huruf kapital provokatif) untuk memicu kepanikan tanpa verifikasi.',
          '2. Mengklaim sumber anonim tanpa identitas yang jelas: "dokter spesialis di luar negeri" (tidak ada nama dokter, tidak ada nama rumah sakit, dan tidak ada jurnal ilmiah yang dirujuk).',
          '3. Membuat klaim medis ajaib yang tidak masuk akal secara kedokteran.'
        ],
        theKingTip: 'THE KING Ciri Khas Hoaks: Huruf kapital mendesak "SEBARKAN", klaim bombastis ajaib, dan sumber anonim fiktif!',
        answer: 'Adanya seruan mendesak bernada provokatif ("SEBARKAN!") dan pencantuman sumber ahli yang anonim tanpa identitas jelas.'
      },
      {
        question: 'Apa fungsi bagian "Reorientasi" dalam teks rekon, dan mengapa bagian ini bersifat opsional (boleh ada boleh tidak)?',
        stepByStep: [
          '1. Reorientasi berisi komentar pribadi, refleksi, kesan mendalam, atau simpulan akhir dari penulis mengenai peristiwa yang telah diceritakan.',
          '2. Bagian ini bersifat opsional karena teks rekon faktual (seperti berita koran atau laporan penyelidikan resmi) sering kali menghentikan teks tepat setelah rangkaian peristiwa selesai, tanpa perlu menambahkan opini pribadi jurnalis.',
          '3. Namun pada rekon pribadi, reorientasi membuat cerita menjadi berkesan dan memiliki pesan moral yang hangat.'
        ],
        theKingTip: 'THE KING: Reorientasi = Kesan penutup penulis. Bersifat opsional karena teks berita resmi wajib bebas dari opini pribadi wartawan.',
        answer: 'Memberikan komentar atau refleksi pribadi penulis atas peristiwa; bersifat opsional karena laporan faktual berita sering kali hanya memuat rekaman fakta murni.'
      },
      {
        question: 'Di media sosial sering digunakan kata "gimmick" dalam kalimat: "Aksi donasi selebritas itu hanyalah gimmick untuk menaikkan pengikut akunnya." Jelaskan makna istilah tersebut dalam konteks media sosial!',
        stepByStep: [
          '1. Kata "gimmick" (gimik) dalam bahasa komunikasi mengacu pada trik, siasat, atau tipuan gerak-gerik yang dirancang semata-mata untuk menarik perhatian publik atau penonton.',
          '2. Dalam konteks media sosial, gimik berarti tindakan yang dibuat-buat (tidak tulus) dengan tujuan utama viralitas, mendongkrak popularitas (engagement), atau menambah jumlah follower.'
        ],
        theKingTip: 'THE KING: Gimik = Siasat/trik pura-pura demi mencuri perhatian publik atau mengejar viralitas medsos.',
        answer: 'Siasat atau trik yang dirancang khusus untuk menarik perhatian publik/warganet demi mengejar popularitas dan viralitas.'
      }
    ],
    summary: 'Teks rekon menceritakan kembali peristiwa lampau secara kronologis (Orientasi - Urutan Peristiwa - Reorientasi). Asah kecerdasan literasimu untuk membedakan Fakta (terbukti), Asumsi (dugaan), dan Opini (penilaian subjektif).'
  }
];
