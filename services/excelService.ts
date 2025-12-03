import * as XLSX from 'xlsx';
import { VocabItem } from '../types';

export async function parseExcelFile(file: File): Promise<VocabItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          reject('File Excel phải có ít nhất 1 hàng dữ liệu (ngoài header)');
          return;
        }

        // Skip header row and parse data
        const vocabItems: VocabItem[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Skip empty rows
          if (!row || row.length < 3) continue;
          
          const [hanzi, pinyin, meaning] = row;
          
          // Validate required fields
          if (!hanzi || !pinyin || !meaning) continue;
          
          vocabItems.push({
            id: `excel-${Date.now()}-${i}`,
            hanzi: String(hanzi).trim(),
            pinyin: String(pinyin).trim(),
            meaning: String(meaning).trim(),
          });
        }

        if (vocabItems.length === 0) {
          reject('Không tìm thấy dữ liệu hợp lệ trong file. Đảm bảo file có 3 cột: Hán tự, Pinyin, Nghĩa');
          return;
        }

        resolve(vocabItems);
      } catch (error) {
        console.error('Error parsing Excel:', error);
        reject('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.');
      }
    };

    reader.onerror = () => {
      reject('Không thể đọc file. Vui lòng thử lại.');
    };

    reader.readAsBinaryString(file);
  });
}
