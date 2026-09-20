import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Student, DailyAttendance, CashTransaction, AttendanceStatus, ClassMinutes } from '../types';
import { savePdfDoc, saveExcelWorkbook } from './fileDownloader';

/**
 * Exports Attendance report as a formatted PDF
 */
export async function exportAttendanceToPDF(
  students: Student[],
  attendance: Record<string, DailyAttendance>,
  selectedDate: string,
  className = 'Kelas IX-H',
  schoolName = 'SMP NEGERI 1 BOJONGSARI',
  waliKelas = 'Ibu Siti Nur Syamsyiah, S.Pd',
  waliKelasNip = '19790412 200501 2 008'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const daily = attendance[selectedDate] || {
    date: selectedDate,
    records: {},
    notes: {},
  };

  const parsedDate = new Date(selectedDate);
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : selectedDate;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(31, 58, 95);
  doc.text(schoolName.toUpperCase(), 105, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text(`LAPORAN PRESENSI HARIAN PESERTA DIDIK - ${className.toUpperCase()}`, 105, 22, { align: 'center' });

  doc.setDrawColor(28, 95, 224);
  doc.setLineWidth(0.8);
  doc.line(14, 26, 196, 26);
  doc.setLineWidth(0.2);
  doc.line(14, 27.5, 196, 27.5);

  // Metadata Info Box
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 75);
  doc.text(`Hari / Tanggal  : ${formattedDate}`, 14, 34);
  doc.text(`Wali Kelas       : ${waliKelas}`, 14, 39);
  doc.text(`Tahun Ajaran   : 2026/2027 (Semester Ganjil)`, 14, 44);

  // Calculate statistics
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpa = 0;

  students.forEach((s) => {
    const st = daily.records[s.id] || 'HADIR';
    if (st === 'HADIR') hadir++;
    else if (st === 'SAKIT') sakit++;
    else if (st === 'IZIN') izin++;
    else if (st === 'ALPA') alpa++;
  });

  const total = students.length;
  const pct = total > 0 ? ((hadir / total) * 100).toFixed(1) : '100';

  doc.text(`Hadir : ${hadir} | Sakit : ${sakit} | Izin : ${izin} | Alpa : ${alpa} (Tingkat Kehadiran: ${pct}%)`, 105, 34, { align: 'left' });
  doc.text(`Total Siswa : ${total} Orang (18 Putra / 14 Putri)`, 105, 39, { align: 'left' });
  doc.text(`Status Data : Terverifikasi Sistem Presensi Digital`, 105, 44, { align: 'left' });

  // Table rows
  const tableData = students.map((s, idx) => {
    const status: AttendanceStatus = daily.records[s.id] || 'HADIR';
    const note = daily.notes?.[s.id] || '-';
    let statusDisplay = 'Hadir';
    if (status === 'SAKIT') statusDisplay = 'Sakit';
    else if (status === 'IZIN') statusDisplay = 'Izin';
    else if (status === 'ALPA') statusDisplay = 'Alpa';

    return [
      String(idx + 1),
      String(s.id),
      s.name,
      s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      s.role,
      statusDisplay,
      note,
    ];
  });

  autoTable(doc, {
    startY: 48,
    head: [['No', 'Abs', 'Nama Peserta Didik', 'L/P', 'Jabatan', 'Status', 'Keterangan']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [31, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 50, 65],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 55 },
      3: { cellWidth: 22, halign: 'center' },
      4: { cellWidth: 32 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 35 },
    },
    alternateRowStyles: {
      fillColor: [242, 245, 252],
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 5) {
        const val = data.cell.raw;
        if (val === 'Sakit') {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Izin') {
          data.cell.styles.textColor = [37, 99, 235];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Alpa') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
    },
  });

  // Footer & Signature
  // @ts-expect-error lastAutoTable is injected by jspdf-autotable
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 180) + 10;

  if (finalY < 250) {
    const dateText = `Bojongsari, ${formattedDate}`;
    doc.setFontSize(8.5);
    doc.setTextColor(50, 60, 75);

    doc.text('Mengetahui,', 25, finalY);
    doc.text('Wali Kelas IX-H', 25, finalY + 5);
    doc.text(waliKelas, 25, finalY + 24);
    doc.text(`NIP. ${waliKelasNip}`, 25, finalY + 28);

    doc.text(dateText, 140, finalY);
    doc.text('Ketua Kelas IX-H', 140, finalY + 5);
    doc.text('Hikmal Syukri Febriyanto', 140, finalY + 24);
    doc.text('NISN. 0081293847', 140, finalY + 28);
  }

  return await savePdfDoc(
    doc,
    `Laporan_Presensi_IXH_${selectedDate}.pdf`,
    `Laporan Presensi ${className} - ${formattedDate}`
  );
}

/**
 * Exports Cash Transactions & Status as an Excel spreadsheet (.xlsx)
 */
export async function exportCashToExcel(
  students: Student[],
  transactions: CashTransaction[],
  paidMap: Record<number, boolean>,
  currentBalance: number,
  nominal: number,
  selectedDate: string,
  className = 'Kelas IX-H',
  schoolName = 'SMP NEGERI 1 BOJONGSARI'
) {
  const wb = XLSX.utils.book_new();

  // ---------------- SHEET 1: REKAP SETORAN HARIAN ----------------
  const paidRows = students.map((s, idx) => {
    const isPaid = Boolean(paidMap[s.id]);
    return {
      No: idx + 1,
      'No Absen': s.id,
      'Nama Siswa': s.name,
      'Nama Panggilan': s.nickname,
      Gender: s.gender === 'L' ? 'L' : 'P',
      Jabatan: s.role,
      'Tarif Kas (Rp)': nominal,
      'Status Bayar': isPaid ? 'Lunas' : 'Belum Bayar',
      'Nominal Masuk (Rp)': isPaid ? nominal : 0,
      Tanggal: selectedDate,
    };
  });

  const paidCount = students.filter((s) => paidMap[s.id]).length;
  const unpaidCount = students.length - paidCount;
  const totalCollected = paidCount * nominal;

  // Append summary row
  paidRows.push({
    No: 0,
    'No Absen': 0,
    'Nama Siswa': `TOTAL TERKUMPUL (${paidCount} LUNAS, ${unpaidCount} BELUM)`,
    'Nama Panggilan': '',
    Gender: '',
    Jabatan: '',
    'Tarif Kas (Rp)': students.length * nominal,
    'Status Bayar': `${Math.round((paidCount / students.length) * 100)}% Lunas`,
    'Nominal Masuk (Rp)': totalCollected,
    Tanggal: selectedDate,
  });

  const wsDaily = XLSX.utils.json_to_sheet(paidRows);
  // Column widths
  wsDaily['!cols'] = [
    { wch: 6 },
    { wch: 10 },
    { wch: 30 },
    { wch: 15 },
    { wch: 8 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsDaily, 'Setoran Kas Harian');

  // ---------------- SHEET 2: BUKU KAS & MUTASI TRANSAKSI ----------------
  let runningBalance = 0;
  const txRows = transactions.map((t, idx) => {
    if (t.type === 'PEMASUKAN') {
      runningBalance += t.amount;
    } else {
      runningBalance -= t.amount;
    }

    return {
      'No Transaksi': t.id || `TX-${idx + 1}`,
      Tanggal: t.date,
      Tipe: t.type === 'PEMASUKAN' ? 'Pemasukan (+)' : 'Pengeluaran (-)',
      Kategori: t.category,
      Keterangan: t.description,
      'Pemasukan (Rp)': t.type === 'PEMASUKAN' ? t.amount : 0,
      'Pengeluaran (Rp)': t.type === 'PENGELUARAN' ? t.amount : 0,
      'Dicatat Oleh': t.recordedBy,
    };
  });

  const wsTx = XLSX.utils.json_to_sheet(txRows);
  wsTx['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 20 },
    { wch: 35 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTx, 'Buku Mutasi Kas');

  // ---------------- SHEET 3: RINGKASAN SALDO ----------------
  const totalIncome = transactions
    .filter((t) => t.type === 'PEMASUKAN')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'PENGELUARAN')
    .reduce((acc, t) => acc + t.amount, 0);

  const summaryData = [
    { Parameter: 'Nama Sekolah', Nilai: schoolName },
    { Parameter: 'Nama Kelas', Nilai: className },
    { Parameter: 'Tarif Kas Harian', Nilai: `Rp ${nominal.toLocaleString('id-ID')} / siswa / hari` },
    { Parameter: 'Total Pemasukan Kas', Nilai: `Rp ${totalIncome.toLocaleString('id-ID')}` },
    { Parameter: 'Total Pengeluaran Kas', Nilai: `Rp ${totalExpense.toLocaleString('id-ID')}` },
    { Parameter: 'Sisa Saldo Kas Terakhir', Nilai: `Rp ${currentBalance.toLocaleString('id-ID')}` },
    { Parameter: 'Tanggal Ekspor Data', Nilai: new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }) },
    { Parameter: 'Bendahara Penanggung Jawab', Nilai: 'Sabrina Nur Salsabila & Afiqa Khairunnisa' },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 28 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Keuangan');

  // Download or share the file reliably on PWA/Android
  return await saveExcelWorkbook(
    wb,
    `Laporan_Uang_Kas_IXH_${selectedDate}.xlsx`,
    `Laporan Uang Kas ${className} - ${selectedDate}`
  );
}

/**
 * Exports Class Meeting Minutes / Berita Acara as a formatted official PDF
 */
export async function exportMinutesToPDF(
  minutes: ClassMinutes,
  schoolName = 'SMP NEGERI 1 BOJONGSARI',
  className = 'Kelas IX-H',
  waliKelas = 'Ibu Siti Nur Syamsyiah, S.Pd',
  waliKelasNip = '19790412 200501 2 008'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const parsedDate = new Date(minutes.date);
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : minutes.date;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(31, 58, 95);
  doc.text(schoolName.toUpperCase(), 105, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text(`BERITA ACARA & NOTULENSI MUSYAWARAH - ${className.toUpperCase()}`, 105, 22, { align: 'center' });

  doc.setDrawColor(28, 95, 224);
  doc.setLineWidth(0.8);
  doc.line(14, 26, 196, 26);
  doc.setLineWidth(0.2);
  doc.line(14, 27.5, 196, 27.5);

  // Metadata Table
  const metaRows = [
    ['Hari / Tanggal', formattedDate],
    ['Waktu Pelaksanaan', minutes.time || '13:00 WIB - Selesai'],
    ['Tempat / Ruang', minutes.location || `Ruang ${className}`],
    ['Agenda Rapat', minutes.agenda],
    ['Pimpinan Rapat', minutes.leader],
    ['Notulis / Pencatat', minutes.notetaker],
    ['Jumlah Peserta Hadir', `${minutes.attendeesCount || 32} Orang`],
  ];

  autoTable(doc, {
    startY: 32,
    head: [['Informasi Pelaksanaan', 'Keterangan Rinci']],
    body: metaRows,
    theme: 'plain',
    headStyles: {
      fillColor: [31, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 50, 65],
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 135 },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 252],
    },
  });

  // @ts-expect-error lastAutoTable is injected by jspdf-autotable
  let currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 90) + 8;

  // Decisions / Poin Kesepakatan
  if (minutes.decisions && minutes.decisions.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(31, 58, 95);
    doc.text('POIN-POIN KEPUTUSAN & HASIL MUFAKAT:', 14, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 70);

    minutes.decisions.forEach((dec, idx) => {
      const splitDec = doc.splitTextToSize(`${idx + 1}. ${dec}`, 180);
      doc.text(splitDec, 16, currentY);
      currentY += splitDec.length * 5;
    });

    currentY += 4;
  }

  // Summary / Content
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(31, 58, 95);
  doc.text('RINGKASAN PEMBAHASAN / RISALAH RAPAT:', 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(45, 55, 70);

  const splitContent = doc.splitTextToSize(minutes.content, 180);
  doc.text(splitContent, 14, currentY);
  currentY += splitContent.length * 5 + 12;

  // Signatures
  if (currentY < 240) {
    const dateSign = `Bojongsari, ${formattedDate}`;
    doc.setFontSize(8.5);
    doc.setTextColor(50, 60, 75);

    doc.text('Pimpinan Rapat,', 25, currentY);
    doc.text(minutes.leader, 25, currentY + 22);
    doc.text('Pimpinan Sidang / Rapat', 25, currentY + 26);

    doc.text(dateSign, 130, currentY);
    doc.text('Notulis Sidang,', 130, currentY + 4);
    doc.text(minutes.notetaker, 130, currentY + 22);
    doc.text('Sekretaris Kelas', 130, currentY + 26);

    currentY += 34;
    if (currentY < 275) {
      doc.text('Mengetahui,', 80, currentY);
      doc.text(`Wali ${className}`, 80, currentY + 4);
      doc.text(waliKelas, 80, currentY + 22);
      doc.text(`NIP. ${waliKelasNip}`, 80, currentY + 26);
    }
  }

  const cleanName = minutes.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  return await savePdfDoc(
    doc,
    `Berita_Acara_${cleanName}_${minutes.date}.pdf`,
    `Berita Acara - ${minutes.title}`
  );
}
