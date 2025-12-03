import { GoogleGenAI, Type } from "@google/genai";
import { VocabItem } from "../types";
import { getRandomFallbackVocab } from "./fallbackData";

export interface VocabResult {
  items: VocabItem[];
  source: 'AI' | 'FALLBACK';
  error?: string;
}

const getClient = (): GoogleGenAI | null => {
  // Ưu tiên VITE_API_KEY (Vite/Vercel), fallback sang process.env (nếu có)
  // Sử dụng import.meta.env an toàn
  let apiKey: string | undefined = undefined;
  
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Bỏ qua lỗi nếu không chạy trong Vite
  }

  // Nếu không tìm thấy, thử process.env (cho Nodejs hoặc các env khác)
  if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = process.env.API_KEY;
  }

  if (!apiKey) {
    console.warn("⚠️ Không tìm thấy API Key. Chuyển sang chế độ Offline Fallback.");
    return null;
  }

  return new GoogleGenAI({ apiKey });
};

export const generateHSKVocab = async (level: number, count: number = 8): Promise<VocabResult> => {
  const ai = getClient();
  
  // CASE 1: Thiếu API Key -> Dùng Fallback ngay lập tức
  if (!ai) {
    return {
      items: getRandomFallbackVocab(level, count),
      source: 'FALLBACK',
      error: 'Missing API Key'
    };
  }

  const systemInstruction = `Bạn là một giáo viên dạy tiếng Trung nhiệt tình cho người Việt Nam. 
  Hãy tạo danh sách từ vựng duy nhất cho cấp độ HSK ${level}.
  Kết quả trả về phải là một mảng JSON hợp lệ.`;

  const prompt = `Tạo ${count} từ tiếng Trung ngẫu nhiên và khác nhau cho trình độ HSK ${level}. 
  Bao gồm: hanzi (Chữ Hán), pinyin (Phiên âm), và meaning (Nghĩa tiếng Việt chuẩn xác).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hanzi: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              meaning: { type: Type.STRING, description: "Nghĩa tiếng Việt" },
            },
            required: ["hanzi", "pinyin", "meaning"],
          },
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No data returned from AI");

    const rawData = JSON.parse(jsonStr);
    
    // Transform success data
    const items = rawData.map((item: any, index: number) => ({
      id: `generated-${Date.now()}-${index}`,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      meaning: item.meaning,
    }));

    return {
      items,
      source: 'AI'
    };

  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    
    // CASE 2: API Error (Quota exceeded, Network error...) -> Dùng Fallback
    const fallbackItems = getRandomFallbackVocab(level, count);
    
    return {
      items: fallbackItems,
      source: 'FALLBACK',
      error: error.message || "Unknown API error"
    };
  }
};
