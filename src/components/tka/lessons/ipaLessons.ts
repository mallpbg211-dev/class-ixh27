import { TkaMateriLesson } from '../tkaMateriLessonsData';

export const IPA_LESSONS: TkaMateriLesson[] = [
  // 1. IPA_BAB_1
  {
    id: 'IPA_LESSON_1',
    subject: 'IPA',
    chapterId: 'IPA_BAB_1',
    chapterNumber: 'Bab 1',
    chapterTitle: 'Biologi Manusia',
    overview: 'Pernahkah tanganmu otomatis menarik diri saat menyentuh wajan panas tanpa sempat berpikir? Atau kenapa tubuhmu berkeringat saat udara terik? Bab ini membongkar rahasia kabel jaringan tubuh (sistem saraf & hormon), cara manusia mewariskan generasi (sistem reproduksi), dan kecanggihan tubuh menjaga keseimbangan otomatis (homeostasis).',
    keyPoints: [
      {
        title: 'Neuron (Sel Saraf) dan Perambatan Impuls',
        description: 'Neuron adalah unit fungsional terkecil sistem saraf. Dendrit bertindak seperti antena penerima sinyal rangsang, Badan Sel mengolah dan memelihara metabolisme, Akson (neurit) seperti kabel panjang yang menghantarkan arus impuls listrik ke neuron lain, dan Selubung Mielin bertindak sebagai isolator lemak yang membuat loncatan impuls melesat sangat kencang.',
        formulaOrConcept: 'Arah Aliran Impuls Neuron Tunggal:\n$$\\text{Dendrit} \\longrightarrow \\text{Badan Sel} \\longrightarrow \\text{Akson (Neurit)} \\longrightarrow \\text{Sinapsis}$$\nCelah antardua neuron disebut sinapsis yang disambung oleh zat kimia neurotransmiter (asetilkolin, dopamin).'
      },
      {
        title: 'Gerak Sadar vs Gerak Refleks',
        description: 'Gerak sadar diproses dan diperintahkan oleh otak besar (korteks serebri), sedangkan gerak refleks adalah respons pertahanan darurat yang jalurnya dipotong langsung di sumsum tulang belakang (medula spinalis) tanpa menunggu kesadaran otak.',
        formulaOrConcept: 'Jalur Gerak Refleks:\n$$\\text{Reseptor (Indra)} \\longrightarrow \\text{Neuron Sensorik} \\longrightarrow \\text{Interneuron (Sumsum Tulang Belakang)} \\longrightarrow \\text{Neuron Motorik} \\longrightarrow \\text{Efektor (Otot/Kelenjar)}$$'
      },
      {
        title: 'Sistem Reproduksi Pria & Spermatogenesis',
        description: 'Testis berfungsi memproduksi jutaan sel sperma dan hormon testosteron, dibungkus skrotum yang menjaga suhu 1-2°C lebih rendah dari suhu tubuh. Sperma dimatangkan di epididimis, dialirkan lewat saluran vas deferens, diberi nutrisi oleh kelenjar vesikula seminalis & prostat, lalu dikeluarkan lewat uretra.',
        formulaOrConcept: 'Jalur Perjalanan Sperma Pria:\n$$\\text{Tubulus Seminiferus (Testis)} \\longrightarrow \\text{Epididimis (Pematangan)} \\longrightarrow \\text{Vas Deferens} \\longrightarrow \\text{Uretra}$$\nHormon Pengatur: FSH, LH, dan Testosteron.'
      },
      {
        title: 'Sistem Reproduksi Wanita, Siklus Menstruasi & Fertilisasi',
        description: 'Ovarium menghasilkan satu sel telur (ovum) setiap bulan melalui proses ovulasi. Fertilisasi (pertemuan sperma dan ovum membentuk zigot) terjadi di saluran Tuba Fallopii (Oviduk). Zigot berkembang menjadi blastosist dan menempel (implantasi) di dinding rahim (endometrium). Jika tidak terjadi pembuahan, endometrium meluruh bersama darah menstruasi.',
        formulaOrConcept: 'Fase Siklus Menstruasi:\n$$\\text{Menstruasi} \\longrightarrow \\text{Proliferasi (FSH & Estrogen)} \\longrightarrow \\text{Ovulasi (Lonjakan LH)} \\longrightarrow \\text{Sekresi (Progesteron)}$$'
      },
      {
        title: 'Mekanisme Homeostasis dan Termoregulasi',
        description: 'Homeostasis adalah kemampuan tubuh mempertahankan kondisi internal yang stabil dan konstan (seperti suhu tubuh 37°C, kadar gula darah, dan pH) melalui umpan balik negatif (negative feedback) yang diatur oleh pusat hipotalamus di otak.',
        formulaOrConcept: 'Saat Tubuh Kegerahan ($T > 37^\\circ\\text{C}$):\n$$\\text{Vasodilatasi Pembuluh Darah} + \\text{Pengeluaran Keringat (Evaporasi)}$$\nSaat Kedinginan ($T < 37^\\circ\\text{C}$):\n$$\\text{Vasokonstriksi (Menyempit)} + \\text{Menggigil (Kontraksi Otot Panas)}$$'
      },
      {
        title: 'Pengaturan Glukosa Darah (Insulin vs Glukagon)',
        description: 'Pankreas bertindak sebagai termostat gula darah. Saat sehabis makan karbohidrat (gula darah naik), sel beta pankreas melepas insulin untuk menyimpan glukosa menjadi glikogen di hati. Saat berpuasa/kelaparan (gula darah turun), sel alfa pankreas melepas glukagon untuk memecah glikogen kembali menjadi glukosa.',
        formulaOrConcept: 'Keseimbangan Glukosa:\n$$\\text{Gula Naik} \\xrightarrow{\\text{Insulin}} \\text{Glikogen Hati (Turun Normal)}$$\n$$\\text{Gula Turun} \\xrightarrow{\\text{Glukagon}} \\text{Glukosa Darah (Naik Normal)}$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Pada saat jari tangan tanpa sengaja tertusuk duri mawar, tangan secara spontan tersentak menjauh sebelum kita menyadari rasa sakitnya. Bagaimanakah urutan jalannya impuls saraf pada peristiwa tersebut?',
        stepByStep: [
          '1. Kulit jari bertindak sebagai penerima rangsang panas/sakit (Reseptor).',
          '2. Rangsangan diubah menjadi impuls listrik dan dihantarkan melalui Neuron Sensorik (aferen).',
          '3. Impuls tidak menuju ke otak besar, melainkan langsung diteruskan oleh Interneuron di Sumsum Tulang Belakang (Medula Spinalis) sebagai pusat refleks.',
          '4. Perintah gerak dikirim keluar melalui Neuron Motorik (eferen).',
          '5. Impuls diterima oleh otot bisep lengan (Efektor) untuk berkontraksi menarik tangan menjauh.',
          '6. Setelah gerakan refleks terjadi, impuls rasa sakit baru diteruskan ke otak sehingga kita baru merasakan nyeri sesudahnya.'
        ],
        theKingTip: 'THE KING Alur Gerak Refleks: RESEPTOR ⟶ SENSORIK ⟶ SUMSUM TULANG BELAKANG ⟶ MOTORIK ⟶ EFEKTOR. Ingat singkatan sakti: "Re-Sen-Sum-Mo-Ef"!',
        answer: 'Reseptor ⟶ Saraf Sensorik ⟶ Sumsum Tulang Belakang ⟶ Saraf Motorik ⟶ Efektor'
      },
      {
        question: 'Seorang wanita memiliki siklus menstruasi teratur 28 hari. Jika hari pertama menstruasinya jatuh pada tanggal 3 Mei, kapankah perkiraan terjadinya peristiwa ovulasi (pelepasan sel telur)?',
        stepByStep: [
          '1. Pahami konsep ovulasi: peristiwa ovulasi selalu terjadi tepat 14 hari sebelum hari pertama menstruasi periode berikutnya.',
          '2. Pada siklus ideal 28 hari, ovulasi terjadi pada hari ke-14 dihitung sejak hari pertama menstruasi (HPHT).',
          '3. Hari pertama menstruasi: 3 Mei.',
          '4. Hari ke-14: $3 + 14 - 1 = 16\\text{ Mei}$ (atau tanggal 3 Mei ditambah 14 hari = 17 Mei).',
          '5. Rentang masa subur ovulasi wanita tersebut adalah sekitar tanggal 16–17 Mei.'
        ],
        theKingTip: 'THE KING: Ovulasi selalu hari ke-14 pada siklus 28 hari. Tinggal hitung: tanggal menstruasi $+ 14$ hari $= 3 + 14 = 17\\text{ Mei}$ (puncak ovulasi hari ke-14).',
        answer: 'Sekitar tanggal 16 - 17 Mei (hari ke-14 sejak hari pertama haid)'
      },
      {
        question: 'Di organ manakah pembuahan (fertilisasi) antara ovum dan sperma terjadi pada tubuh manusia, dan di manakah zigot akan tumbuh berkembang menjadi janin?',
        stepByStep: [
          '1. Ovarium melepaskan ovum matang ke corong infundibulum.',
          '2. Ovum bergerak menuju saluran tuba fallopii (saluran telur / oviduk).',
          '3. Sperma berenang menyusuri rahim hingga bertemu ovum di 1/3 bagian luar Tuba Fallopii. Di sinilah fertilisasi terjadi membentuk zigot.',
          '4. Zigot membelah menjadi morula dan blastosist sambil bergerak menuju rahim (uterus).',
          '5. Blastosist menempel di dinding endometrium rahim dan berkembang menjadi janin terlindung cairan amnion hingga masa kelahiran.'
        ],
        theKingTip: 'THE KING: Pasangan Lokasi Keramat: "Fertilisasi di Tuba Fallopii, Tumbuh Janin di Uterus (Rahim)". Sering sekali keluar sebagai pilihan berganda!',
        answer: 'Fertilisasi di Tuba Fallopii (Oviduk); Pertumbuhan janin di Uterus (Rahim)'
      },
      {
        question: 'Ketika suhu lingkungan meningkat sangat panas di siang hari, sebutkan dua mekanisme homeostasis yang dilakukan tubuh manusia untuk mencegah terjadinya hipertermia!',
        stepByStep: [
          '1. Pusat kendali suhu tubuh di otak (Hipotalamus) mendeteksi kenaikan suhu darah.',
          '2. Respon 1: Vasodilatasi (pelebaran pembuluh darah di dekat permukaan kulit) agar lebih banyak panas tubuh yang diradiasikan keluar ke lingkungan.',
          '3. Respon 2: Kelenjar keringat dipicu memproduksi keringat. Penguapan (evaporasi) keringat menyerap panas dari kulit sehingga tubuh terasa sejuk kembali.'
        ],
        theKingTip: 'THE KING: Kunci Termoregulasi Panas: "Pelebaran pembuluh darah kulit (vasodilatasi) + Pengeluaran keringat". Kalau dingin: "Menggigil + pembuluh darah menyempit (vasokonstriksi)".',
        answer: 'Vasodilatasi pembuluh darah kapiler kulit dan sekresi keringat untuk pendinginan evaporatif.'
      },
      {
        question: 'Pasien penderita diabetes melitus mengalami lonjakan kadar glukosa dalam darah dan urine. Kelenjar apakah yang mengalami gangguan dan hormon apa yang kurang diproduksi?',
        stepByStep: [
          '1. Kadar glukosa darah normal diatur oleh organ pankreas.',
          '2. Khususnya pada bagian pulau-pulau Langerhans terdapat sel beta penghasil hormon Insulin.',
          '3. Hormon insulin berfungsi membuka pintu sel tubuh agar dapat menyerap glukosa dan memicu hati mengubah glukosa menjadi cadangan glikogen.',
          '4. Jika pankreas rusak atau kekurangan insulin, glukosa menumpuk di aliran darah (hiperglikemia) dan terbuang lewat urine.'
        ],
        theKingTip: 'THE KING: Penyakit Kencing Manis (Diabetes Melitus) = Organ Pankreas bermasalah, kekurangan hormon Insulin!',
        answer: 'Organ Pankreas; kekurangan hormon Insulin.'
      },
      {
        question: 'Bagian sel saraf yang berfungsi membungkus akson dan mempercepat jalannya impuls listrik dengan transmisi melompat (saltatori) adalah ...',
        stepByStep: [
          '1. Akson diselimuti lapisan lemak pelindung yang disebut Selubung Mielin.',
          '2. Selubung mielin dibentuk oleh sel Schwann pada sistem saraf tepi.',
          '3. Antara satu selubung mielin dengan selubung berikutnya terdapat celah tak bermielin yang disebut Nodus Ranvier.',
          '4. Adanya nodus ranvier memungkinkan arus impuls melompat dari satu nodus ke nodus berikutnya (konduksi saltatori) sehingga kecepatan rambat meningkat puluhan kali lipat.'
        ],
        theKingTip: 'THE KING: Selubung Mielin = Isolator lemak pelindung. Nodus Ranvier = Celah penyela loncatan kilat impuls.',
        answer: 'Selubung Mielin (dan Nodus Ranvier)'
      },
      {
        question: 'Sebutkan hormon yang memicu ovulasi dan pembentukan korpus luteum pada siklus reproduksi wanita!',
        stepByStep: [
          '1. Kelenjar hipofisis anterior di dasar otak menghasilkan hormon gonadotropin FSH dan LH.',
          '2. FSH (Follicle Stimulating Hormone) mematangkan folikel telur di ovarium.',
          '3. Folikel memproduksi estrogen yang kemudian memicu lonjakan sekresi hormon LH (Luteinizing Hormone).',
          '4. Lonjakan hormon LH secara mendadak inilah yang menyebabkan dinding folikel pecah dan melepaskan ovum (ovulasi), serta mengubah sisa folikel menjadi korpus luteum penghasil progesteron.'
        ],
        theKingTip: 'THE KING: FSH = mematangkan Folikel. LH = meletuskan Folikel (Ovulasi). Ingat "L" untuk Lonjakan pelepasan telur!',
        answer: 'LH (Luteinizing Hormone)'
      },
      {
        question: 'Mengapa testis pria terletak di luar rongga perut di dalam kantung skrotum, tidak berada di dalam rongga tubuh seperti ovarium pada wanita?',
        stepByStep: [
          '1. Pembentukan sel sperma yang sehat dan fungsional (spermatogenesis) memerlukan suhu lingkungan yang optimal.',
          '2. Suhu optimal pembentukan sperma adalah sekitar 34–35°C (1 sampai 2°C lebih rendah daripada suhu inti rongga tubuh manusia normal yang mencapai 37°C).',
          '3. Skrotum berfungsi sebagai termostat alami yang dapat mengendur atau mengerut untuk menjaga testis tetap pada suhu optimal tersebut.'
        ],
        theKingTip: 'THE KING: Skrotum menjaga suhu testis $1 - 2^\\circ\\text{C}$ lebih dingin dari suhu tubuh normal demi kelangsungan hidup sperma.',
        answer: 'Untuk menjaga suhu testis tetap 1–2°C lebih rendah dari suhu tubuh demi optimalisasi proses pembentukan sperma.'
      },
      {
        question: 'Apa fungsi hormon ADH (Antidiuretic Hormone) yang dihasilkan oleh hipotalamus dan disimpan di hipofisis posterior saat tubuh mengalami dehidrasi?',
        stepByStep: [
          '1. Saat tubuh kekurangan cairan, kepekatan osmotik darah meningkat.',
          '2. Hipotalamus mendeteksi rasa haus dan merangsang pelepasan hormon ADH.',
          '3. Hormon ADH bekerja pada tubulus ginjal untuk meningkatkan penyerapan kembali (reabsorpsi) air masuk ke pembuluh darah.',
          '4. Akibatnya, air diselamatkan kembali ke tubuh, volume urine yang dikeluarkan menjadi sedikit dan berwarna pekat.'
        ],
        theKingTip: 'THE KING: "Anti-Diuretik" artinya "Anti-Banyak Kencing". Kalau ADH tinggi, urine sedikit dan pekat (menghemat air tubuh).',
        answer: 'Meningkatkan reabsorpsi air pada tubulus ginjal sehingga mengurangi pengeluaran urine dan mencegah dehidrasi.'
      },
      {
        question: 'Bagian otak yang bertanggung jawab mengatur keseimbangan gerak tubuh, koordinasi otot saat bersepeda, dan ketangkasan bermain alat musik adalah ...',
        stepByStep: [
          '1. Otak besar (Serebrum): pusat kecerdasan, ingatan, kesadaran, dan gerak sadar.',
          '2. Otak kecil (Serebelum): pusat koordinasi gerakan otot, ketepatan gerak halus, dan keseimbangan posisi tubuh.',
          '3. Batang otak / Medula Oblongata: pusat pengatur refleks otomatis vital seperti detak jantung, pernapasan, dan tekanan darah.'
        ],
        theKingTip: 'THE KING: Serebelum (Otak Kecil) = Keseimbangan dan Koordinasi Otot! Kalau mabuk atau jatuh terbentur otak kecil, jalan sempoyongan.',
        answer: 'Otak Kecil (Cerebellum)'
      }
    ],
    summary: 'Sistem koordinasi memadukan kerja saraf (reaksi cepat hitungan milidetik) dan endokrin/hormon (pengaruh lambat berjangka panjang). Pastikan tidak tertukar antara gerak sadar (otak) dan gerak refleks (sumsum tulang belakang).'
  },

  // 2. IPA_BAB_2
  {
    id: 'IPA_LESSON_2',
    subject: 'IPA',
    chapterId: 'IPA_BAB_2',
    chapterNumber: 'Bab 2',
    chapterTitle: 'Tekanan Zat',
    overview: 'Mengapa paku dibuat berujung runcing dan mengapa kapal selam baja raksasa bisa melayang di lautan tanpa tenggelam? Tekanan menjelaskan bagaimana gaya disebarkan pada suatu bidang. Di bab ini, kita menaklukkan rumus tekanan zat padat, zat cair (hidrostatis & Archimedes), serta tekanan gas atmosfer.',
    keyPoints: [
      {
        title: 'Konsep Dasar Tekanan Zat Padat',
        description: 'Tekanan adalah besarnya gaya dorong tegak lurus yang bekerja per satu satuan luas permukaan bidang sentuh. Tekanan berbanding lurus dengan gaya dorong ($F$), tetapi berbanding terbalik dengan luas bidang tekan ($A$). Makin runcing benda, luasnya makin sempit sehingga tekanannya melesat sangat besar.',
        formulaOrConcept: 'Rumus Tekanan Padat:\n$$P = \\dfrac{F}{A}$$\nSatuan SI: Pascal (Pa) atau $\\text{N/m}^2$.\n$$1\\text{ Pa} = 1\\text{ N/m}^2$$'
      },
      {
        title: 'Tekanan Hidrostatis (Tekanan Zat Cair Diam)',
        description: 'Zat cair memiliki massa, sehingga gravitasi bumi menarik molekul cairan ke bawah menghasilkan tekanan pada setiap kedalaman. Tekanan hidrostatis HANYA bergantung pada massa jenis fluida ($\\rho$), percepatan gravitasi ($g$), dan kedalaman dari permukaan bebas cairan ($h$). Bentuk wadah bejana sama sekali tidak memengaruhi tekanan!',
        formulaOrConcept: 'Rumus Tekanan Hidrostatis:\n$$P_h = \\rho \\times g \\times h$$\nIngat: $h$ diukur dari PERMUKAAN air ke bawah menuju posisi benda!'
      },
      {
        title: 'Hukum Pascal (Prinsip Pompa Hidrolik)',
        description: 'Tekanan yang diberikan pada zat cair dalam ruang tertutup akan diteruskan oleh zat cair tersebut ke segala arah dengan sama besar dan merata tanpa berkurang sedikit pun. Prinsip ini dimanfaatkan pada dongkrak mobil dan rem cakram hidrolik hidrolik.',
        formulaOrConcept: 'Persamaan Hukum Pascal:\n$$P_1 = P_2 \\implies \\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}$$\nHubungan dengan diameter penampang:\n$$\\dfrac{F_1}{F_2} = \\left(\\dfrac{D_1}{D_2}\\right)^2$$'
      },
      {
        title: 'Hukum Archimedes & Gaya Angkat Ke Atas',
        description: 'Benda yang dicelupkan sebagian atau seluruhnya ke dalam zat cair akan mengalami gaya apung ke atas ($F_a$) sebesar berat zat cair yang dipindahkan atau didesak oleh benda tersebut.',
        formulaOrConcept: 'Gaya Apung Archimedes:\n$$F_a = \\rho_f \\times g \\times V_{\\text{bf}}$$\ndengan $\\rho_f$ = massa jenis cairan dan $V_{\\text{bf}}$ = volume benda yang tercelup.'
      },
      {
        title: 'Syarat Terapung, Melayang, dan Tenggelam',
        description: 'Benda terapung jika massa jenis benda lebih kecil dari fluida ($\\rho_b < \\rho_f$). Benda melayang di dalam cairan jika massa jenis benda sama persis dengan fluida ($\\rho_b = \\rho_f$). Benda tenggelam ke dasar jika massa jenis benda lebih besar dari fluida ($\\rho_b > \\rho_f$).',
        formulaOrConcept: 'Kondisi Benda Terapung:\n$$\\dfrac{V_{\\text{tercelup}}}{V_{\\text{total}}} = \\dfrac{\\rho_b}{\\rho_f}$$'
      },
      {
        title: 'Tekanan Gas dan Hukum Boyle',
        description: 'Pada suhu konstan, tekanan gas dalam ruang tertutup berbanding terbalik dengan volumenya. Jika ruangan ditekan mengecil separuhnya, kerapatan molekul bertambah rapat dan tekanannya berlipat ganda dua kali.',
        formulaOrConcept: 'Hukum Boyle:\n$$P_1 \\times V_1 = P_2 \\times V_2$$\nTekanan Atmosfer standar di permukaan laut: $1\\text{ atm} = 76\\text{ cmHg} = 10^5\\text{ Pa}$. Setiap naik $100\\text{ m}$, tekanan turun $1\\text{ cmHg}$.'
      }
    ],
    exampleProblems: [
      {
        question: 'Sebuah balok beton bermassa 120 kg memiliki ukuran panjang 2 m, lebar 1 m, dan tebal 0,5 m diletakkan di atas lantai. Jika percepatan gravitasi bumi $g = 10\\text{ m/s}^2$, hitunglah tekanan maksimum yang dapat diberikan balok pada lantai!',
        stepByStep: [
          '1. Hitung berat balok (gaya tekan): $F = w = m \\times g = 120 \\times 10 = 1.200\\text{ N}$.',
          '2. Tekanan bernilai MAKSIMUM jika luas bidang sentuhnya ($A$) paling MINIMUM.',
          '3. Luas permukaan terkecil dari balok: $A_{\\min} = l \\times t = 1\\text{ m} \\times 0,5\\text{ m} = 0,5\\text{ m}^2$.',
          '4. Tekanan maksimum: $P_{\\max} = \\dfrac{F}{A_{\\min}} = \\dfrac{1.200}{0,5} = 2.400\\text{ Pa}$ (atau $\\text{N/m}^2$).'
        ],
        theKingTip: 'THE KING: Tekanan Terbesar = Bagi dengan luas bidang Terkecil ($1 \\times 0,5 = 0,5$). $P = \\dfrac{1.200}{0,5} = 2.400\\text{ Pa}$. Kalau ditanya tekanan terkecil, bagi dengan luas terbesar ($2 \\times 1 = 2$).',
        answer: '2.400 Pa'
      },
      {
        question: 'Seorang penyelam berada pada kedalaman 15 meter di bawah permukaan danau air tawar. Jika massa jenis air $1.000\\text{ kg/m}^3$ dan $g = 10\\text{ m/s}^2$, berapakah tekanan hidrostatis yang dirasakan oleh telinga penyelam?',
        stepByStep: [
          '1. Identifikasi variabel: kedalaman $h = 15\\text{ m}$, $\\rho = 1.000\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$.',
          '2. Gunakan rumus tekanan hidrostatis: $P_h = \\rho \\times g \\times h$.',
          '3. $P_h = 1.000 \\times 10 \\times 15 = 150.000\\text{ N/m}^2$ (atau $150\\text{ kPa}$).'
        ],
        theKingTip: 'THE KING: Di air biasa, setiap kedalaman 10 meter menyumbang $100\\text{ kPa}$ ($1\\text{ atm}$). Kedalaman $15\\text{ m} = 1,5 \\times 100\\text{ kPa} = 150.000\\text{ Pa}$!',
        answer: '150.000 Pa (atau 150 kPa)'
      },
      {
        question: 'Sebuah dongkrak hidrolik memiliki luas penampang kecil $A_1 = 20\\text{ cm}^2$ dan penampang besar $A_2 = 800\\text{ cm}^2$. Jika pada penampang kecil diberi gaya tekan sebesar 250 N, berapakah massa beban mobil maksimal yang dapat terangkat pada penampang besar ($g = 10\\text{ m/s}^2$)?',
        stepByStep: [
          '1. Gunakan persamaan Hukum Pascal: $\\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}$.',
          '2. $\\dfrac{250}{20} = \\dfrac{F_2}{800}$.',
          '3. $F_2 = \\dfrac{250}{20} \\times 800 = 12,5 \\times 800 = 10.000\\text{ N}$.',
          '4. Beban massa mobil: $m = \\dfrac{F_2}{g} = \\dfrac{10.000}{10} = 1.000\\text{ kg}$ (1 ton).'
        ],
        theKingTip: 'THE KING: Cari faktor kelipatan luas: $800 / 20 = 40$ kali lipat. Maka gaya angkat otomatis membesar 40 kali lipat: $F_2 = 40 \\times 250 = 10.000\\text{ N}$. Massa $= 10.000 / 10 = 1.000\\text{ kg}$!',
        answer: '1.000 kg (gaya angkat 10.000 N)'
      },
      {
        question: 'Sebuah balok kayu bervolume $0,06\\text{ m}^3$ terapung di air sungai (massa jenis air $1.000\\text{ kg/m}^3$). Jika bagian kayu yang terendam di dalam air adalah $0,045\\text{ m}^3$, berapakah massa jenis balok kayu tersebut?',
        stepByStep: [
          '1. Pada kondisi terapung berlaku kesetimbangan gaya berat dan gaya apung: $w = F_a$.',
          '2. $\\rho_b \\times g \\times V_{\\text{total}} = \\rho_f \\times g \\times V_{\\text{tercelup}}$.',
          '3. Coret $g$: $\\rho_b = \\dfrac{V_{\\text{tercelup}}}{V_{\\text{total}}} \\times \\rho_f$.',
          '4. $\\rho_b = \\dfrac{0,045}{0,06} \\times 1.000 = \\dfrac{3}{4} \\times 1.000 = 750\\text{ kg/m}^3$.'
        ],
        theKingTip: 'THE KING: Fraksi bagian terendam adalah perbandingan massa jenisnya! Tercelup $0,045 / 0,06 = 3/4 = 75\\%$. Maka massa jenis kayu langsung $75\\% \\times 1.000 = 750\\text{ kg/m}^3$.',
        answer: '750 kg/m³'
      },
      {
        question: 'Sebuah batu bermassa 5 kg di udara memiliki berat 50 N. Ketika ditimbang seluruhnya di dalam air, berat batu terbaca sebesar 30 N. Berapakah besar gaya apung Archimedes yang dialami batu dan berapa volumenya ($g = 10\\text{ m/s}^2$)?',
        stepByStep: [
          '1. Berat semu di dalam air: $w_{\\text{semu}} = w_{\\text{udara}} - F_a$.',
          '2. Gaya apung: $F_a = w_{\\text{udara}} - w_{\\text{semu}} = 50\\text{ N} - 30\\text{ N} = 20\\text{ N}$.',
          '3. Cari volume batu ($V_b$): $F_a = \\rho_{\\text{air}} \\times g \\times V_b$.',
          '4. $20 = 1.000 \\times 10 \\times V_b \\implies V_b = \\dfrac{20}{10.000} = 0,002\\text{ m}^3$ (atau $2.000\\text{ cm}^3$).'
        ],
        theKingTip: 'THE KING: Gaya ke atas Archimedes = Selisih berat di udara dan berat di air: $50 - 30 = 20\\text{ N}$. Volume $= \\dfrac{F_a}{10.000} = 0,002\\text{ m}^3 = 2\\text{ liter}$.',
        answer: 'Gaya apung = 20 N; Volume = 0,002 m³'
      },
      {
        question: 'Sebuah pipa U diisi air (massa jenis $1\\text{ g/cm}^3$). Pada kaki kanan dituangkan minyak (massa jenis $0,8\\text{ g/cm}^3$) setinggi 10 cm. Berapakah selisih ketinggian permukaan air pada kaki kiri dengan permukaan minyak?',
        stepByStep: [
          '1. Pada bidang batas berlaku kesetimbangan tekanan: $\\rho_{\\text{air}} \\times h_{\\text{air}} = \\rho_{\\text{minyak}} \\times h_{\\text{minyak}}$.',
          '2. $1 \\times h_{\\text{air}} = 0,8 \\times 10 \\implies h_{\\text{air}} = 8\\text{ cm}$.',
          '3. Selisih ketinggian kedua zat cair: $\\Delta h = h_{\\text{minyak}} - h_{\\text{air}} = 10\\text{ cm} - 8\\text{ cm} = 2\\text{ cm}$.'
        ],
        theKingTip: 'THE KING: Tekanan hidrostatis bejana U: $\\rho_1 \\times h_1 = \\rho_2 \\times h_2$. Tinggi air $= 0,8 \\times 10 = 8\\text{ cm}$. Selisihnya $= 10 - 8 = 2\\text{ cm}$.',
        answer: '2 cm'
      },
      {
        question: 'Sebuah kota terletak pada ketinggian 600 meter di atas permukaan laut. Berapakah tekanan udara rata-rata di kota tersebut dinyatakan dalam cmHg?',
        stepByStep: [
          '1. Tekanan udara di permukaan laut $= 76\\text{ cmHg}$.',
          '2. Setiap kenaikan ketinggian 100 meter, tekanan udara turun sebesar 1 cmHg.',
          '3. Penurunan tekanan untuk ketinggian 600 m: $\\Delta P = \\dfrac{600}{100} \\times 1\\text{ cmHg} = 6\\text{ cmHg}$.',
          '4. Tekanan udara kota: $P = 76\\text{ cmHg} - 6\\text{ cmHg} = 70\\text{ cmHg}$.'
        ],
        theKingTip: 'THE KING Rumus Ketinggian Barometer: $P = 76 - \\dfrac{h}{100}$. Ketinggian 600 m: $P = 76 - 6 = 70\\text{ cmHg}$. Cepat dan presisi!',
        answer: '70 cmHg'
      },
      {
        question: 'Gas dalam ruang tertutup bertekanan 2 atm memiliki volume 4 liter. Jika gas ditekan perlahan pada suhu tetap sehingga volumenya menjadi 1 liter, berapakah tekanan gas sekarang?',
        stepByStep: [
          '1. Karena suhu tetap (isotermik), gunakan Hukum Boyle: $P_1 \\times V_1 = P_2 \\times V_2$.',
          '2. $2\\text{ atm} \\times 4\\text{ liter} = P_2 \\times 1\\text{ liter}$.',
          '3. $P_2 = \\dfrac{8}{1} = 8\\text{ atm}$.'
        ],
        theKingTip: 'THE KING: Volume menyusut menjadi $1/4$ kali semula ($4 \\implies 1$). Karena berbanding terbalik, tekanan otomatis naik 4 kali lipat: $4 \\times 2 = 8\\text{ atm}$!',
        answer: '8 atm'
      },
      {
        question: 'Sebuah kapal feri baja bermassa 2.000 ton dapat terapung di laut, padahal sebutir jarum besi kecil langsung tenggelam ke dasar. Jelaskan secara fisika mengapa fenomena ini terjadi!',
        stepByStep: [
          '1. Syarat terapung atau tenggelam ditentukan oleh massa jenis total rata-rata benda dibandingkan massa jenis zat cair.',
          '2. Jarum besi terbuat dari besi padat tanpa rongga udara, sehingga $\\rho_{\\text{besi}} \\approx 7.800\\text{ kg/m}^3 > \\rho_{\\text{air}} (1.000\\text{ kg/m}^3)$, akibatnya tenggelam.',
          '3. Kapal feri memiliki lambung berongga sangat besar yang terisi udara (massa jenis udara sangat kecil $\\approx 1,2\\text{ kg/m}^3$).',
          '4. Rongga udara memperbesar volume total kapal secara masif, sehingga massa jenis rata-rata kapal feri menjadi jauh lebih kecil daripada massa jenis air laut.',
          '5. Gaya apung Archimedes yang dihasilkan sama dengan berat total kapal feri.'
        ],
        theKingTip: 'THE KING: Ingat kata kunci "Rongga Udara"! Lambung kapal memperbesar volume total $V$, sehingga massa jenis rata-rata kapal menjadi lebih kecil dari air laut ($\\rho_{\\text{kapal}} < \\rho_{\\text{air}}$).',
        answer: 'Karena lambung kapal berongga udara besar sehingga massa jenis rata-rata kapal lebih kecil dari air laut.'
      },
      {
        question: 'Dinding sebuah bendungan waduk pembangkit listrik selalu dibuat semakin tebal dan melebar pada bagian dasarnya. Mengapa struktur bendungan dirancang demikian?',
        stepByStep: [
          '1. Berdasarkan hukum tekanan hidrostatis: $P_h = \\rho \\times g \\times h$.',
          '2. Tekanan zat cair berbanding lurus dengan kedalaman ($h$).',
          '3. Semakin dalam posisi dinding dari permukaan danau waduk, tekanan air yang menekan dinding bendungan semakin luar biasa besar.',
          '4. Agar bendungan tidak jebol menahan tekanan hidrostatis air yang sangat besar di bagian dasar, dinding bawah sengaja dicor beton jauh lebih tebal dan kokoh.'
        ],
        theKingTip: 'THE KING: Tekanan hidrostatis makin dalam makin dahsyat ($P_h \\propto h$). Dinding dasar bendungan wajib paling tebal untuk menahan tekanan air terbesar.',
        answer: 'Karena tekanan hidrostatis berbanding lurus dengan kedalaman, sehingga tekanan air di dasar danau waduk adalah yang paling besar.'
      }
    ],
    summary: 'Tekanan berbanding lurus dengan gaya dorong tetapi berbanding terbalik dengan luas permukaan. Pada fluida statis, tekanan hidrostatis hanya bergantung pada kedalaman h, dan Hukum Archimedes menegaskan gaya apung sebesar berat zat cair yang dipindahkan.'
  },

  // 3. IPA_BAB_3 (NEW)
  {
    id: 'IPA_LESSON_3',
    subject: 'IPA',
    chapterId: 'IPA_BAB_3',
    chapterNumber: 'Bab 3',
    chapterTitle: 'Kelistrikan',
    overview: 'Pernahkah rambutmu berdiri saat menggosokkan balon ke kepala, atau bagaimana lampu kamar bisa menyala terang saat sakelar ditekan? Bab ini mengupas dunia elektron: dari petir dan muatan listrik statis yang saling tolak-menarik (Hukum Coulomb), arus listrik dinamis (Hukum Ohm & Rangkaian Seri-Paralel), hingga menghitung biaya rekening listrik PLN di rumahmu.',
    keyPoints: [
      {
        title: 'Muatan Listrik Statis dan Polarisasi',
        description: 'Benda tersusun atas atom netral (jumlah proton sama dengan elektron). Benda dapat bermuatan jika terjadi perpindahan elektron. Penggaris mika yang digosok kain wol akan kelebihan elektron (bermuatan negatif), sedangkan kaca yang digosok sutra akan kehilangan elektron (bermuatan positif). Muatan sejenis tolak-menolak, muatan berlainan jenis tarik-menarik.',
        formulaOrConcept: 'Sifat Muatan Listrik:\n$$Q = n \\times e$$\ndengan muatan dasar elektron $e = -1,6 \\times 10^{-19}\\text{ C}$.'
      },
      {
        title: 'Hukum Coulomb (Gaya Tarik/Tolak Listrik)',
        description: 'Besarnya gaya elektrostatik tarik-menarik atau tolak-menolak antara dua muatan berbanding lurus dengan hasil kali kedua muatan dan berbanding terbalik dengan kuadrat jarak pisah keduanya.',
        formulaOrConcept: 'Persamaan Hukum Coulomb:\n$$F_c = k \\times \\dfrac{q_1 \\times q_2}{r^2}$$\ndengan konstanta $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.'
      },
      {
        title: 'Kuat Arus Listrik dan Beda Potensial',
        description: 'Arus listrik mengalir dari potensial tinggi (kutub positif) ke potensial rendah (kutub negatif). Namun, aliran elektron sebenarnya mengalir dari potensial rendah ke potensial tinggi. Kuat arus listrik adalah banyaknya muatan yang melintasi penampang kawat per satuan detik.',
        formulaOrConcept: 'Kuat Arus Listrik:\n$$I = \\dfrac{Q}{t} \\implies Q = I \\times t$$\nSatuan SI: Ampere (A), dengan $1\\text{ A} = 1\\text{ Coulomb/detik}$.'
      },
      {
        title: 'Hukum Ohm dan Hambatan Jenis Kawat',
        description: 'Kuat arus listrik yang mengalir pada suatu penghantar berbanding lurus dengan beda potensial (tegangan) ujung-ujungnya dan berbanding terbalik dengan hambatannya. Hambatan kawat dipengaruhi oleh panjang kawat ($l$), luas penampang kawat ($A$), dan hambatan jenis kawat ($\\rho$).',
        formulaOrConcept: 'Hukum Ohm:\n$$V = I \\times R \\iff I = \\dfrac{V}{R}$$\nHambatan Kawat Penghantar:\n$$R = \\rho \\times \\dfrac{l}{A}$$'
      },
      {
        title: 'Hukum I Kirchhoff & Rangkaian Seri - Paralel',
        description: 'Hukum I Kirchhoff menyatakan bahwa jumlah kuat arus yang masuk ke suatu titik percabangan sama dengan jumlah kuat arus yang keluar dari titik tersebut. Rangkaian seri membagi tegangan dengan arus sama ($R_s = R_1 + R_2$). Rangkaian paralel membagi arus dengan tegangan sama di tiap cabang ($1/R_p = 1/R_1 + 1/R_2$).',
        formulaOrConcept: 'Hukum Kirchhoff & Rangkaian:\n$$\\sum I_{\\text{masuk}} = \\sum I_{\\text{keluar}}$$\n$$R_{\\text{seri}} = R_1 + R_2 + R_3$$\n$$\\dfrac{1}{R_{\\text{paralel}}} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\dots$$'
      },
      {
        title: 'Energi, Daya Listrik & Rekening PLN',
        description: 'Daya listrik ($P$) adalah laju penggunaan energi per detik. Menghitung tagihan rekening listrik PLN di rumah dengan menjumlahkan seluruh energi listrik alat-alat rumah tangga dalam satuan kiloWatt-jam (kWh).',
        formulaOrConcept: 'Daya & Energi Listrik:\n$$P = V \\times I = I^2 \\times R = \\dfrac{V^2}{R}$$\n$$W = P \\times t \\quad (\\text{dalam Watt-jam})$$\n$$W_{\\text{kWh}} = \\dfrac{\\sum(P \\times t)}{1.000}$$'
      }
    ],
    exampleProblems: [
      {
        question: 'Dua buah muatan listrik masing-masing sebesar $+4\\,\\mu\\text{C}$ dan $+6\\,\\mu\\text{C}$ terpisah sejauh 2 cm di udara. Jika $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$, berapakah besar gaya tolak-menolak kedua muatan tersebut?',
        stepByStep: [
          '1. Konversi satuan ke SI: $q_1 = 4\\,\\mu\\text{C} = 4 \\times 10^{-6}\\text{ C}$ dan $q_2 = 6\\,\\mu\\text{C} = 6 \\times 10^{-6}\\text{ C}$.',
          '2. Jarak pisah: $r = 2\\text{ cm} = 0,02\\text{ m} = 2 \\times 10^{-2}\\text{ m}$.',
          '3. Kuadrat jarak: $r^2 = (2 \\times 10^{-2})^2 = 4 \\times 10^{-4}\\text{ m}^2$.',
          '4. Hitung dengan Hukum Coulomb: $F = k \\times \\dfrac{q_1 \\times q_2}{r^2}$.',
          '5. $F = 9 \\times 10^9 \\times \\dfrac{(4 \\times 10^{-6}) \\times (6 \\times 10^{-6})}{4 \\times 10^{-4}} = 9 \\times 10^9 \\times \\dfrac{24 \\times 10^{-12}}{4 \\times 10^{-4}}$.',
          '6. $F = 9 \\times 6 \\times 10^{9 - 12 - (-4)} = 54 \\times 10^1 = 540\\text{ N}$.'
        ],
        theKingTip: 'THE KING: Coret angka 4 pada $q_1$ dengan 4 pada $r^2$! Sisa angka bulat: $9 \\times 6 = 54$. Pangkat sepuluh: $9 - 6 - 6 + 4 = 1 \\implies 54 \\times 10 = 540\\text{ N}$. Selesai cepat tanpa hitung rumit!',
        answer: '540 N (tolak-menolak)'
      },
      {
        question: 'Dua muatan sejenis mengalami gaya tolak sebesar $F$ saat terpisah pada jarak $R$. Jika jarak pisah kedua muatan dijauhkan menjadi $3R$, berapakah besar gaya tolaknya sekarang?',
        stepByStep: [
          '1. Berdasarkan Hukum Coulomb: gaya berbanding terbalik dengan kuadrat jarak ($F \\propto \\dfrac{1}{r^2}$).',
          '2. Jarak baru $r\' = 3R$.',
          '3. Gaya baru: $F\' = \\dfrac{1}{(3)^2} \\times F = \\dfrac{1}{9} F$.'
        ],
        theKingTip: 'THE KING: Kuadratkan faktor jarak di bawah pecahan! Jarak jadi 3 kali $\\implies$ Gaya jadi $\\dfrac{1}{3^2} = \\dfrac{1}{9}$ kali semula.',
        answer: '1/9 F'
      },
      {
        question: 'Muatan listrik sebesar 180 Coulomb mengalir melalui seutas kawat penghantar selama 1,5 menit. Tentukan kuat arus listrik yang mengalir pada kawat tersebut!',
        stepByStep: [
          '1. Identifikasi muatan: $Q = 180\\text{ C}$.',
          '2. Konversi waktu ke detik: $t = 1,5\\text{ menit} = 1,5 \\times 60 = 90\\text{ detik}$.',
          '3. Hitung kuat arus: $I = \\dfrac{Q}{t} = \\dfrac{180}{90} = 2\\text{ Ampere}$.'
        ],
        theKingTip: 'THE KING: Jangan lupa menit WAJIB diubah ke detik ($1,5 \\times 60 = 90$). Kuat arus langsung: $180 / 90 = 2\\text{ A}$.',
        answer: '2 Ampere'
      },
      {
        question: 'Tiga buah resistor masing-masing bernilai $R_1 = 6\\,\\Omega$, $R_2 = 12\\,\\Omega$, dan $R_3 = 4\\,\\Omega$. Jika $R_1$ dan $R_2$ dirangkai paralel kemudian diserikan dengan $R_3$, berapakah hambatan total pengganti rangkaian?',
        stepByStep: [
          '1. Hitung hambatan paralel $R_1$ dan $R_2$: $\\dfrac{1}{R_p} = \\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{2 + 1}{12} = \\dfrac{3}{12}$.',
          '2. $R_p = \\dfrac{12}{3} = 4\\,\\Omega$.',
          '3. Rangkaikan seri dengan $R_3$: $R_{\\text{total}} = R_p + R_3 = 4\\,\\Omega + 4\\,\\Omega = 8\\,\\Omega$.'
        ],
        theKingTip: 'THE KING Paralel Dua Hambatan: Rumus hasil kali bagi jumlah: $R_p = \\dfrac{R_1 \\times R_2}{R_1 + R_2} = \\dfrac{6 \\times 12}{6 + 12} = \\dfrac{72}{18} = 4\\,\\Omega$. Total $= 4 + 4 = 8\\,\\Omega$.',
        answer: '8 Ω'
      },
      {
        question: 'Sebuah rangkaian tertutup memiliki hambatan luar $R = 5,5\\,\\Omega$ dihubungkan dengan baterai bertegangan GGL $\\mathcal{E} = 12\\text{ V}$ dan hambatan dalam baterai $r = 0,5\\,\\Omega$. Tentukan kuat arus listrik yang mengalir dan tegangan jepit baterai!',
        stepByStep: [
          '1. Hambatan total rangkaian: $R_{\\text{total}} = R + r = 5,5 + 0,5 = 6\\,\\Omega$.',
          '2. Kuat arus rangkaian: $I = \\dfrac{\\mathcal{E}}{R + r} = \\dfrac{12}{6} = 2\\text{ Ampere}$.',
          '3. Tegangan jepit (tegangan pada hambatan luar): $V_{\\text{jepit}} = I \\times R = 2 \\times 5,5 = 11\\text{ Volt}$.',
          '4. (Atau: $V_{\\text{jepit}} = \\mathcal{E} - I \\cdot r = 12 - (2 \\times 0,5) = 11\\text{ Volt}$).'
        ],
        theKingTip: 'THE KING: Baterai kehilangan tegangan sebesar $I \\times r = 2 \\times 0,5 = 1\\text{ V}$ di dalam dirinya sendiri. Tegangan jepit keluar $= 12 - 1 = 11\\text{ V}$!',
        answer: 'Kuat arus = 2 A; Tegangan jepit = 11 V'
      },
      {
        question: 'Pada suatu titik percabangan, arus masuk $I_1 = 5\\text{ A}$ dan $I_2 = 3\\text{ A}$. Arus keluar terbagi menjadi dua cabang yaitu $I_3 = 4\\text{ A}$ dan $I_4$. Berapakah besar kuat arus $I_4$?',
        stepByStep: [
          '1. Gunakan Hukum I Kirchhoff: $\\sum I_{\\text{masuk}} = \\sum I_{\\text{keluar}}$.',
          '2. $I_1 + I_2 = I_3 + I_4$.',
          '3. $5 + 3 = 4 + I_4$.',
          '4. $8 = 4 + I_4 \\implies I_4 = 8 - 4 = 4\\text{ Ampere}$.'
        ],
        theKingTip: 'THE KING: Total masuk $= 5 + 3 = 8\\text{ A}$. Keluar harus 8 A juga. Karena sudah keluar 4 A, sisanya pasti $8 - 4 = 4\\text{ A}$.',
        answer: '4 Ampere'
      },
      {
        question: 'Sebuah kawat tembaga sepanjang 100 meter memiliki luas penampang $2\\text{ mm}^2$. Jika hambatan jenis tembaga adalah $1,7 \\times 10^{-8}\\,\\Omega\\cdot\\text{m}$, berapakah besar hambatan kawat tersebut?',
        stepByStep: [
          '1. Konversi luas penampang ke meter persegi: $A = 2\\text{ mm}^2 = 2 \\times 10^{-6}\\text{ m}^2$.',
          '2. Gunakan rumus hambatan kawat: $R = \\rho \\times \\dfrac{l}{A}$.',
          '3. $R = (1,7 \\times 10^{-8}) \\times \\dfrac{100}{2 \\times 10^{-6}}$.',
          '4. $R = 1,7 \\times 10^{-8} \\times 50 \\times 10^6 = 85 \\times 10^{-2} = 0,85\\,\\Omega$.'
        ],
        theKingTip: 'THE KING: Angka bulat: $1,7 \\times 100 / 2 = 85$. Pangkat sepuluh: $-8 - (-6) = -2$. $85 \\times 10^{-2} = 0,85\\,\\Omega$.',
        answer: '0,85 Ω'
      },
      {
        question: 'Sebuah setrika listrik memiliki spesifikasi 220 V / 400 W. Jika setrika tersebut digunakan selama 2 jam setiap hari selama 30 hari, berapakah energi listrik yang diserap dalam satuan kWh?',
        stepByStep: [
          '1. Daya setrika $P = 400\\text{ Watt} = 0,4\\text{ kW}$.',
          '2. Total waktu pemakaian dalam sebulan: $t = 2\\text{ jam/hari} \\times 30\\text{ hari} = 60\\text{ jam}$.',
          '3. Energi listrik dalam kWh: $W = P \\times t = 0,4\\text{ kW} \\times 60\\text{ jam} = 24\\text{ kWh}$.'
        ],
        theKingTip: 'THE KING: Hitung total watt-jam lalu bagi 1.000: $\\dfrac{400 \\times 2 \\times 30}{1.000} = \\dfrac{24.000}{1.000} = 24\\text{ kWh}$.',
        answer: '24 kWh'
      },
      {
        question: 'Sebuah rumah menggunakan 4 lampu masing-masing 25 W menyala 10 jam/hari, 1 TV 80 W menyala 5 jam/hari, dan 1 kulkas 100 W menyala 24 jam/hari. Jika tarif listrik Rp1.500 per kWh, berapakah biaya listrik peralatan tersebut selama 1 bulan (30 hari)?',
        stepByStep: [
          '1. Energi 4 lampu: $4 \\times 25\\text{ W} \\times 10\\text{ jam} = 1.000\\text{ Wh/hari}$.',
          '2. Energi TV: $1 \\times 80\\text{ W} \\times 5\\text{ jam} = 400\\text{ Wh/hari}$.',
          '3. Energi Kulkas: $1 \\times 100\\text{ W} \\times 24\\text{ jam} = 2.400\\text{ Wh/hari}$.',
          '4. Total energi per hari: $1.000 + 400 + 2.400 = 3.800\\text{ Wh} = 3,8\\text{ kWh/hari}$.',
          '5. Total energi 30 hari: $3,8 \\times 30 = 114\\text{ kWh}$.',
          '6. Biaya listrik sebulan: $114\\text{ kWh} \\times \\text{Rp}1.500 = \\text{Rp}171.000$.'
        ],
        theKingTip: 'THE KING: Jumlahkan watt-jam harian $= 1.000 + 400 + 2.400 = 3.800\\text{ Wh}$. Dalam 30 hari $= 3,8 \\times 30 = 114\\text{ kWh}$. Biaya $= 114 \\times 1.500 = \\text{Rp}171.000$.',
        answer: 'Rp171.000'
      },
      {
        question: 'Sebuah pemanas air listrik berdaya 500 Watt memiliki hambatan kawat $R$. Jika pemanas air tersebut dipasang pada sumber tegangan yang hanya bernilai separuh dari tegangan normalnya (110 V dari seharusnya 220 V), berapakah daya yang dihasilkan pemanas air sekarang?',
        stepByStep: [
          '1. Hubungan daya dengan tegangan pada hambatan kawat tetap adalah $P = \\dfrac{V^2}{R}$.',
          '2. Daya berbanding lurus dengan kuadrat tegangannya ($P \\propto V^2$).',
          '3. Tegangan baru $V\' = \\dfrac{1}{2} V$.',
          '4. Daya baru: $P\' = \\left(\\dfrac{1}{2}\\right)^2 \\times P = \\dfrac{1}{4} \\times 500\\text{ Watt} = 125\\text{ Watt}$.'
        ],
        theKingTip: 'THE KING: Jebakan klasik! Daya sebanding dengan KUADRAT tegangan ($V^2$). Tegangan turun setengah, daya anjlok seperempatnya: $500 / 4 = 125\\text{ Watt}$!',
        answer: '125 Watt'
      }
    ],
    summary: 'Gaya Coulomb berbanding terbalik dengan kuadrat jarak ($r^2$). Pada rangkaian listrik, resistor seri menjumlahkan hambatan sedangkan paralel memperkecil hambatan pengganti. Tagihan PLN dihitung dari akumulasi kWh ($P \\times t / 1000$).'
  },

  // 4. IPA_BAB_4 (NEW)
  {
    id: 'IPA_LESSON_4',
    subject: 'IPA',
    chapterId: 'IPA_BAB_4',
    chapterNumber: 'Bab 4',
    chapterTitle: 'Kemagnetan & Energi Ramah Lingkungan',
    overview: 'Bagaimana kompas pelaut selalu tahu arah utara dan bagaimana kincir angin raksasa bisa menghasilkan listrik untuk ribuan rumah? Bab ini mengajakmu menguak misteri medan magnet bumi, cara membuat magnet buatan dan elektromagnetik, prinsip transformator penurun tegangan, serta transisi dunia menuju energi hijau ramah lingkungan.',
    keyPoints: [
      {
        title: 'Sifat Magnet dan Teori Domain Magnetik',
        description: 'Setiap magnet memiliki dua kutub: Kutub Utara (U) dan Kutub Selatan (S). Kutub senama tolak-menolak, kutub tak senama tarik-menarik. Di dalam benda feromagnetik (besi, baja), terdapat kumpulan magnet-magnet elementer (domain magnet). Pada besi lunak, domain mudah diarahkan namun cepat hilang (magnet sementara). Pada baja, domain sangat sulit diarahkan namun jika sudah teratur akan bertahan sangat kuat (magnet permanen).',
        formulaOrConcept: 'Garis Gaya Magnet:\nKeluar dari Kutub Utara (U) dan Masuk menuju Kutub Selatan (S).'
      },
      {
        title: 'Kemagnetan Bumi (Sudut Deklinasi & Inklinasi)',
        description: 'Bumi bertindak seperti magnet batang raksasa. Kutub utara magnet bumi berada di dekat kutub selatan geografis bumi, dan kutub selatan magnet bumi berada di dekat kutub utara geografis bumi. Penyimpangan jarum kompas menghasilkan dua sudut penting.',
        formulaOrConcept: 'Sudut Deklinasi:\nPenyimpangan jarum kompas terhadap arah Utara-Selatan geografis bumi sebenarnya.\nSudut Inklinasi:\nKemiringan jarum kompas terhadap bidang horizontal permukaan bumi (tegak 90° di kutub, sejajar 0° di khatulistiwa).'
      },
      {
        title: 'Elektromagnetik & Kaidah Tangan Kanan Oersted',
        description: 'Hans Christian Oersted membuktikan bahwa di sekitar kawat yang dialiri arus listrik timbul medan magnet. Arah medan magnet melingkar ditentukan dengan Kaidah Tangan Kanan: ibu jari menunjukkan arah arus listrik ($I$), sedangkan empat jari yang menggenggam menunjukkan arah garis medan magnet ($B$).',
        formulaOrConcept: 'Kaidah Tangan Kanan Kumparan (Solenoida):\nEmpat jari = Arah Arus Listrik ($I$)\nIbu Jari = Kutub Utara Magnet ($U$)'
      },
      {
        title: 'Gaya Lorentz pada Kawat Berarus',
        description: 'Kawat berarus listrik yang berada di dalam medan magnet akan mengalami gaya mekanik yang disebut Gaya Lorentz. Arahnya tegak lurus terhadap arus dan medan magnet, menjadi dasar prinsip kerja motor listrik dan kipas angin.',
        formulaOrConcept: 'Persamaan Gaya Lorentz:\n$$F_L = B \\times I \\times l \\times \\sin \\theta$$\nAturan Tangan Kanan: Ibu Jari = Arus ($I$), Jari Telunjuk = Medan ($B$), Telapak Tangan = Arah Gaya Lorentz ($F_L$).'
      },
      {
        title: 'Induksi Elektromagnetik & Transformator (Trafo)',
        description: 'Michael Faraday menemukan bahwa perubahan jumlah garis gaya magnet yang memotong kumparan akan menimbulkan arus listrik induksi (GGL Induksi). Prinsip ini dipakai pada generator listrik dan transformator (step-up untuk menaikkan tegangan, step-down untuk menurunkan tegangan).',
        formulaOrConcept: 'Persamaan Transformator Ideal ($100\\%$ efisiensi):\n$$\\dfrac{V_p}{V_s} = \\dfrac{N_p}{N_s} = \\dfrac{I_s}{I_p}$$\nEfisiensi Trafo Nyata:\n$$\\eta = \\dfrac{P_s}{P_p} \\times 100\\% = \\dfrac{V_s \\times I_s}{V_p \\times I_p} \\times 100\\%$$'
      },
      {
        title: 'Prinsip Energi Ramah Lingkungan (Energi Hijau Terbarukan)',
        description: 'Menggantikan bahan bakar fosil penyebab pemanasan global dengan sumber energi bersih: Tenaga Surya (sel fotovoltaik), Pembangkit Listrik Tenaga Air (PLTA), Tenaga Angin (kincir angin aerogenerator), Geotermal (panas bumi), dan Biomassa/Biofuel yang dapat diperbarui terus-menerus.',
        formulaOrConcept: 'Keunggulan Energi Ramah Lingkungan:\nNir-emisi karbon ($CO_2$), tidak menghasilkan polusi udara asam ($SO_2/NO_x$), dan sumber energinya berkelanjutan (sustainable).'
      }
    ],
    exampleProblems: [
      {
        question: 'Sebuah batang besi AB dibuat magnet dengan cara digosok searah oleh kutub utara (U) magnet permanen dari ujung A menuju ujung B secara berulang-ulang. Tentukan kutub magnet yang terbentuk pada ujung A dan ujung B batang besi tersebut!',
        stepByStep: [
          '1. Pahami aturan penggosokan magnet: ujung terakhir besi yang terlepas dari gosokan magnet akan selalu memiliki kutub yang BERLAWANAN dengan kutub magnet yang menggosoknya.',
          '2. Penggosokan dilakukan dari A menuju B dengan kutub Utara (U).',
          '3. Ujung B adalah ujung terakhir yang disentuh magnet kutub Utara.',
          '4. Maka ujung B menjadi kutub Selatan (S).',
          '5. Karena ujung B menjadi kutub Selatan, maka ujung awal A otomatis menjadi kutub Utara (U).'
        ],
        theKingTip: 'THE KING: "Ujung Lepasan Selalu Berlawanan!" Ujung B lepas dari kutub Utara $\\implies$ Ujung B jadi Selatan (S), ujung A jadi Utara (U).',
        answer: 'Ujung A = Kutub Utara (U); Ujung B = Kutub Selatan (S)'
      },
      {
        question: 'Sebuah transformator step-down memiliki kumparan primer 1.200 lilitan dan kumparan sekunder 300 lilitan. Jika kumparan primer dihubungkan dengan tegangan bolak-balik 220 Volt, berapakah tegangan yang dihasilkan pada kumparan sekunder?',
        stepByStep: [
          '1. Gunakan perbandingan lilitan dan tegangan trafo: $\\dfrac{V_p}{V_s} = \\dfrac{N_p}{N_s}$.',
          '2. $\\dfrac{220}{V_s} = \\dfrac{1.200}{300}$.',
          '3. Sederhanakan rasio lilitan: $\\dfrac{1.200}{300} = 4$.',
          '4. $V_s = \\dfrac{220}{4} = 55\\text{ Volt}$.'
        ],
        theKingTip: 'THE KING: Lilitan berkurang dari 1.200 menjadi 300 (turun 4 kali lipat). Maka tegangan juga langsung turun 4 kali lipat: $220 / 4 = 55\\text{ Volt}$!',
        answer: '55 Volt'
      },
      {
        question: 'Sebuah kawat tembaga sepanjang 50 cm dialiri arus listrik sebesar 4 Ampere secara tegak lurus di dalam medan magnet homogen 0,6 Tesla. Berapakah besar Gaya Lorentz yang bekerja pada kawat tersebut?',
        stepByStep: [
          '1. Konversi panjang kawat ke SI: $l = 50\\text{ cm} = 0,5\\text{ m}$.',
          '2. Kuat arus $I = 4\\text{ A}$, kuat medan magnet $B = 0,6\\text{ T}$, sudut $\\theta = 90^\\circ (\\sin 90^\\circ = 1)$.',
          '3. Gunakan rumus Gaya Lorentz: $F_L = B \\times I \\times l$.',
          '4. $F_L = 0,6 \\times 4 \\times 0,5 = 0,6 \\times 2 = 1,2\\text{ Newton}$.'
        ],
        theKingTip: 'THE KING: Rumus "BIL": $F = B \\times I \\times l$. Kalikan langsung: $0,6 \\times 4 \\times 0,5 = 1,2\\text{ N}$.',
        answer: '1,2 Newton'
      },
      {
        question: 'Sebuah transformator memiliki tegangan primer 220 V dan tegangan sekunder 110 V. Jika daya input pada kumparan primer adalah 200 Watt dan efisiensi transformator 80%, berapakah kuat arus listrik yang mengalir pada kumparan sekunder?',
        stepByStep: [
          '1. Hitung daya output sekunder menggunakan rumus efisiensi: $P_s = \\eta \\times P_p$.',
          '2. $P_s = 80\\% \\times 200\\text{ Watt} = 0,8 \\times 200 = 160\\text{ Watt}$.',
          '3. Hubungan daya sekunder dengan arus sekunder: $P_s = V_s \\times I_s$.',
          '4. $160 = 110 \\times I_s \\implies I_s = \\dfrac{160}{110} = \\dfrac{16}{11} \\approx 1,45\\text{ Ampere}$.'
        ],
        theKingTip: 'THE KING: Daya output sekunder $= 80\\% \\times 200 = 160\\text{ W}$. Arus sekunder langsung: $I_s = P_s / V_s = 160 / 110 = 1,45\\text{ A}$.',
        answer: '1,45 Ampere (atau 16/11 A)'
      },
      {
        question: 'Sebutkan tiga cara meningkatkan kekuatan medan magnet pada elektromagnet (kumparan kawat solenoide)!',
        stepByStep: [
          '1. Memperbanyak jumlah lilitan kawat kumparan solenoide.',
          '2. Memperbesar kuat arus listrik ($I$) yang dialirkan ke dalam kumparan.',
          '3. Memasukkan inti besi lunak ke dalam rongga kumparan sebagai pengumpul garis medan magnet.'
        ],
        theKingTip: 'THE KING Tiga Kunci Elektromagnet Kuat: "Tambah Lilitan, Perbesar Arus Listrik, dan Beri Inti Besi Lunak"!',
        answer: 'Memperbanyak lilitan kumparan, memperbesar kuat arus listrik, dan memasukkan inti besi lunak.'
      },
      {
        question: 'Jika jarum kompas dibawa tepat ke daerah khatulistiwa (ekuator bumi), bagaimanakah kedudukan sudut inklinasi jarum kompas tersebut?',
        stepByStep: [
          '1. Sudut inklinasi adalah sudut kemiringan jarum kompas terhadap garis horizontal permukaan bumi.',
          '2. Di kutub magnet bumi, jarum kompas tertarik tegak lurus ke dalam bumi sehingga sudut inklinasi bernilai $90^\\circ$.',
          '3. Di daerah khatulistiwa (ekuator), garis medan magnet bumi mengalir sejajar dengan permukaan tanah horizontal.',
          '4. Akibatnya, jarum kompas berada dalam posisi horizontal sempurna dan sudut inklinasi bernilai $0^\\circ$.'
        ],
        theKingTip: 'THE KING: Sudut Inklinasi: Di Khatulistiwa $= 0^\\circ$ (horizontal sejajar tanah), di Kutub Bumi $= 90^\\circ$ (tegak lurus menunjuk ke dalam tanah).',
        answer: '0° (posisi jarum mendatar sejajar dengan permukaan bumi)'
      },
      {
        question: 'Sebuah kawat penghantar dialiri arus listrik ke arah timur di dalam medan magnet homogen yang mengarah ke utara. Ke manakah arah Gaya Lorentz yang dialami kawat?',
        stepByStep: [
          '1. Gunakan Kaidah Tangan Kanan Gaya Lorentz.',
          '2. Ibu Jari menunjukkan arah arus ($I$): arahkan ke Timur (ke kanan).',
          '3. Empat Jari menunjukkan arah medan magnet ($B$): arahkan ke Utara (ke depan/atas).',
          '4. Arah dorongan Telapak Tangan menunjukkan Gaya Lorentz ($F_L$): telapak tangan menghadap ke Atas (keluar bidang menjauhi tanah).'
        ],
        theKingTip: 'THE KING: Ibu jari ke Timur, telunjuk ke Utara, telapak tangan mendorong ke ATAS tegak lurus bidang!',
        answer: 'Mengarah ke Atas'
      },
      {
        question: 'Manakah dari pembangkit listrik berikut yang memanfaatkan energi ramah lingkungan dan tidak menghasilkan gas rumah kaca saat beroperasi? (1) PLTU Batubara, (2) PLTB Kincir Angin, (3) PLTD Diesel, (4) PLTA Waduk Air.',
        stepByStep: [
          '1. PLTU batubara dan PLTD diesel membakar hidrokarbon fosil yang melepaskan jutaan ton gas $CO_2$ dan sulfur dioksida ke atmosfer.',
          '2. PLTB (Pembangkit Listrik Tenaga Bayu/Angin) memutar generator murni dari embusan angin tanpa pembakaran bahan bakar apa pun.',
          '3. PLTA (Pembangkit Listrik Tenaga Air) memutar turbin dari gravitasi aliran air waduk tanpa emisi karbon.',
          '4. Pilihan yang ramah lingkungan adalah (2) dan (4).'
        ],
        theKingTip: 'THE KING: Energi hijau ramah lingkungan = Angin (PLTB), Air (PLTA), Surya (PLTS), dan Panas Bumi (PLTP). Tanpa asap pembakaran fosil!',
        answer: 'Nomor (2) PLTB dan Nomor (4) PLTA'
      },
      {
        question: 'Bagaimanakah prinsip kerja panel surya (solar cell) fotovoltaik dalam menghasilkan arus listrik untuk rumah tangga?',
        stepByStep: [
          '1. Panel surya dibuat dari lapisan semikonduktor silikon tipe-p dan tipe-n yang membentuk sambungan p-n.',
          '2. Ketika partikel foton cahaya matahari mengenai permukaan silikon, energi foton diserap oleh elektron valensi silikon.',
          '3. Penyerapan energi ini menyebabkan elektron terlepas dan bergerak bebas (efek fotovoltaik).',
          '4. Pergerakan elektron bebas melintasi sambungan p-n menghasilkan beda potensial dan arus listrik searah (DC).',
          '5. Arus DC diubah menggunakan alat inverter menjadi arus bolak-balik (AC) untuk menyalakan perangkat elektronik rumah.'
        ],
        theKingTip: 'THE KING: Panel surya menggunakan Efek Fotovoltaik: partikel foton cahaya matahari mengeksitasi elektron pada semikonduktor silikon menghasilkan arus DC.',
        answer: 'Efek fotovoltaik mengubah energi foton cahaya matahari menjadi aliran elektron bebas pada semikonduktor silikon.'
      },
      {
        question: 'Sebutkan tiga cara yang dapat menyebabkan sifat kemagnetan suatu magnet permanen hilang atau rusak!',
        stepByStep: [
          '1. Dipanaskan atau dibakar hingga melebihi suhu Curie: energi panas membuat getaran atom menjadi sangat acak sehingga domain magnetik kehilangan keteraturan arahnya.',
          '2. Dipukul-pukul keras dengan palu berulang-ulang atau dijatuhkan dari tempat tinggi: guncangan mekanik mengacaukan orientasi magnet-magnet elementernya.',
          '3. Dialiri arus listrik bolak-balik (AC): arus bolak-balik yang arahnya terus berbalik puluhan kali per detik membingungkan arah domain magnetik hingga teracak kembali netral.'
        ],
        theKingTip: 'THE KING Tiga Perusak Magnet: "Dipanaskan/Dibakar, Dipukul keras berulang-ulang, dan Dialiri Arus Listrik AC"!',
        answer: 'Dipanaskan/dibakar, dipukul-pukul berulang kali, dan dialiri arus listrik bolak-balik (AC).'
      }
    ],
    summary: 'Kutub magnet sejenis tolak-menolak dan berlawanan jenis tarik-menarik. Transformator bekerja berdasarkan hukum induksi elektromagnetik Faraday di mana perbandingan tegangan sebanding dengan perbandingan jumlah lilitan kawat.'
  }
];
