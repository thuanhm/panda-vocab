import { VocabItem } from '../types';

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

export async function generateHSKVocab(level: number, count: number): Promise<VocabItem[]> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
    throw new Error('Gemini API Key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào environment variables.');
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
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
    throw new Error('Không thể tạo từ vựng. Vui lòng kiểm tra API key và thử lại.');
  }
}
