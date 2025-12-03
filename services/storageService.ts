import { VocabSet, VocabItem } from '../types';

const STORAGE_KEY = 'panda_vocab_sets';

export const getSavedSets = (): VocabSet[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu đã lưu:", error);
    return [];
  }
};

const saveToLocalStorage = (sets: VocabSet[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
};

export const createVocabSet = (name: string): VocabSet[] => {
  const currentSets = getSavedSets();
  const newSet: VocabSet = {
    id: Date.now().toString(),
    name: name.trim(),
    createdAt: Date.now(),
    items: []
  };
  // Thêm mới lên đầu
  const updatedSets = [newSet, ...currentSets];
  saveToLocalStorage(updatedSets);
  return updatedSets;
};

export const updateVocabSet = (setId: string, newItems: VocabItem[]): VocabSet[] => {
  const currentSets = getSavedSets();
  const targetSetIndex = currentSets.findIndex(s => s.id === setId);

  if (targetSetIndex === -1) return currentSets;

  const targetSet = currentSets[targetSetIndex];
  
  // Logic Merge: Dùng Map để xử lý trùng lặp dựa trên Hanzi
  const vocabMap = new Map<string, VocabItem>();

  // 1. Đưa các từ cũ vào Map
  targetSet.items.forEach(item => {
    vocabMap.set(item.hanzi.trim(), item);
  });

  // 2. Duyệt các từ mới, ghi đè vào Map (hoặc thêm mới)
  newItems.forEach(item => {
    const key = item.hanzi.trim();
    if (vocabMap.has(key)) {
      // Nếu đã có -> Update Pinyin/Meaning nhưng giữ ID cũ để ổn định (hoặc tạo ID mới cũng được)
      const oldItem = vocabMap.get(key)!;
      vocabMap.set(key, {
        ...item,
        id: oldItem.id // Giữ ID cũ nếu muốn, hoặc dùng ID của item mới
      });
    } else {
      // Nếu chưa có -> Thêm mới
      vocabMap.set(key, item);
    }
  });

  // 3. Chuyển lại thành mảng
  const mergedItems = Array.from(vocabMap.values());

  const updatedSet = {
    ...targetSet,
    items: mergedItems
  };

  const updatedSets = [...currentSets];
  updatedSets[targetSetIndex] = updatedSet;
  
  saveToLocalStorage(updatedSets);
  return updatedSets;
};

export const deleteVocabSet = (idString: string): VocabSet[] => {
  const currentSets = getSavedSets();
  const updatedSets = currentSets.filter(set => set.id !== idString);
  saveToLocalStorage(updatedSets);
  return updatedSets;
};