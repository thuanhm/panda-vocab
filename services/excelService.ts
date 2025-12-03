import { VocabItem } from "../types";
import * as XLSX from 'xlsx';

export const parseExcelFile = async (file: File): Promise<VocabItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject("Đọc file thất bại");
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        // Filter valid rows (assuming Row 1 is header, or check content)
        // We look for rows with at least 3 columns
        const vocabList: VocabItem[] = [];
        
        // Start from index 1 to skip header, or 0 if no header. 
        // Heuristic: Check if row 0 looks like "Hanzi", "Pinyin", "Meaning"
        let startIndex = 0;
        if (jsonData.length > 0) {
            const firstRow = jsonData[0].map(c => String(c).toLowerCase());
            if (firstRow.some((c: string) => c.includes('hanzi') || c.includes('hán') || c.includes('chinese'))) {
                startIndex = 1;
            }
        }

        for (let i = startIndex; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length >= 3) {
             // Assuming Col 0: Hanzi, Col 1: Pinyin, Col 2: Meaning (Vietnamese)
             const hanzi = String(row[0] || '').trim();
             const pinyin = String(row[1] || '').trim();
             const meaning = String(row[2] || '').trim();

             if (hanzi && meaning) {
               vocabList.push({
                 id: `excel-${i}`,
                 hanzi,
                 pinyin,
                 meaning
               });
             }
          }
        }

        if (vocabList.length === 0) {
            reject("Không tìm thấy từ vựng hợp lệ. Hãy đảm bảo các cột là: Hanzi, Pinyin, Meaning.");
        } else {
            resolve(vocabList);
        }

      } catch (err) {
        console.error("Excel parse error", err);
        reject("Không thể đọc file Excel.");
      }
    };

    reader.onerror = (err) => reject("Lỗi đọc file: " + err);
    reader.readAsArrayBuffer(file);
  });
};