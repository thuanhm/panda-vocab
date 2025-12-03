import { GoogleGenAI, Type } from "@google/genai";
import { VocabItem } from "../types";

export const generateHSKVocab = async (level: number, count: number = 8): Promise<VocabItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    // Transform into our VocabItem type with IDs
    return rawData.map((item: any, index: number) => ({
      id: `generated-${Date.now()}-${index}`,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      meaning: item.meaning,
    }));

  } catch (error) {
    console.error("Error generating vocab:", error);
    // Fallback data in case of error
    return [
      { id: 'err1', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào (Kiểm tra API Key)' },
      { id: 'err2', hanzi: '谢谢', pinyin: 'xiè xie', meaning: 'Cảm ơn' },
      { id: 'err3', hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt' },
      { id: 'err4', hanzi: '加油', pinyin: 'jiā yóu', meaning: 'Cố lên' },
    ];
  }
};
