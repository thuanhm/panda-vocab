import { VocabItem } from '../types';

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

// Fallback vocabulary data for each HSK level
const FALLBACK_VOCAB: { [key: number]: Array<{ hanzi: string; pinyin: string; meaning: string }> } = {
  1: [
    { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "xin chào" },
    { hanzi: "谢谢", pinyin: "xièxie", meaning: "cảm ơn" },
    { hanzi: "再见", pinyin: "zàijiàn", meaning: "tạm biệt" },
    { hanzi: "对不起", pinyin: "duìbuqǐ", meaning: "xin lỗi" },
    { hanzi: "没关系", pinyin: "méiguānxi", meaning: "không sao" },
    { hanzi: "我", pinyin: "wǒ", meaning: "tôi" },
    { hanzi: "你", pinyin: "nǐ", meaning: "bạn" },
    { hanzi: "他", pinyin: "tā", meaning: "anh ấy" },
  ],
  2: [
    { hanzi: "学习", pinyin: "xuéxí", meaning: "học tập" },
    { hanzi: "工作", pinyin: "gōngzuò", meaning: "làm việc" },
    { hanzi: "朋友", pinyin: "péngyou", meaning: "bạn bè" },
    { hanzi: "时间", pinyin: "shíjiān", meaning: "thời gian" },
    { hanzi: "地方", pinyin: "dìfang", meaning: "địa phương" },
    { hanzi: "东西", pinyin: "dōngxi", meaning: "đồ vật" },
    { hanzi: "问题", pinyin: "wèntí", meaning: "vấn đề" },
    { hanzi: "意思", pinyin: "yìsi", meaning: "ý nghĩa" },
  ],
  3: [
    { hanzi: "环境", pinyin: "huánjìng", meaning: "môi trường" },
    { hanzi: "机会", pinyin: "jīhuì", meaning: "cơ hội" },
    { hanzi: "经验", pinyin: "jīngyàn", meaning: "kinh nghiệm" },
    { hanzi: "努力", pinyin: "nǔlì", meaning: "nỗ lực" },
    { hanzi: "情况", pinyin: "qíngkuàng", meaning: "tình huống" },
    { hanzi: "态度", pinyin: "tàidu", meaning: "thái độ" },
    { hanzi: "影响", pinyin: "yǐngxiǎng", meaning: "ảnh hưởng" },
    { hanzi: "重要", pinyin: "zhòngyào", meaning: "quan trọng" },
  ],
  4: [
    { hanzi: "表达", pinyin: "biǎodá", meaning: "biểu đạt" },
    { hanzi: "发展", pinyin: "fāzhǎn", meaning: "phát triển" },
    { hanzi: "改变", pinyin: "gǎibiàn", meaning: "thay đổi" },
    { hanzi: "观点", pinyin: "guāndiǎn", meaning: "quan điểm" },
    { hanzi: "激动", pinyin: "jīdòng", meaning: "xúc động" },
    { hanzi: "节约", pinyin: "jiéyuē", meaning: "tiết kiệm" },
    { hanzi: "理解", pinyin: "lǐjiě", meaning: "hiểu biết" },
    { hanzi: "效率", pinyin: "xiàolǜ", meaning: "hiệu suất" },
  ],
};

// Generate more fallback vocab for higher levels
for (let level = 5; level <= 9; level++) {
  FALLBACK_VOCAB[level] = FALLBACK_VOCAB[4]; // Reuse level 4 for now
}

export async function generateHSKVocab(level: number, count: number): Promise<VocabItem[]> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PLACEHOLDER_API_KEY' || GEMINI_API_KEY === '') {
    console.warn('Gemini API Key not configured, using fallback vocabulary');
    return getFallbackVocab(level, count);
  }

  const prompt = `Generate exactly ${count} Chinese vocabulary words for HSK level ${level}.
Return ONLY a valid JSON array with this exact format, no additional text:
[
  {
    "hanzi": "你好",
    "pinyin": "nǐ hǎo",
    "meaning": "xin chào"
  }
]

Requirements:
- Exactly ${count} words
- HSK ${level} level vocabulary
- Vietnamese meanings
- Proper pinyin with tone marks
- Valid JSON format only`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean up the response
    textResponse = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const vocabArray = JSON.parse(textResponse);
    
    // Add IDs to each vocab item
    return vocabArray.map((item: any, index: number) => ({
      id: `hsk${level}-${Date.now()}-${index}`,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      meaning: item.meaning,
    }));
  } catch (error) {
    console.error('Error generating HSK vocab:', error);
    console.warn('Falling back to predefined vocabulary');
    return getFallbackVocab(level, count);
  }
}

function getFallbackVocab(level: number, count: number): VocabItem[] {
  const fallbackData = FALLBACK_VOCAB[level] || FALLBACK_VOCAB[1];
  
  // Shuffle and take requested count
  const shuffled = [...fallbackData].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  // If we need more items, repeat the array
  while (selected.length < count) {
    selected.push(...shuffled.slice(0, count - selected.length));
  }
  
  return selected.map((item, index) => ({
    id: `hsk${level}-fallback-${Date.now()}-${index}`,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    meaning: item.meaning,
  }));
}
