export enum GameMode {
  HANZI_PINYIN = 'HANZI_PINYIN',
  HANZI_MEANING = 'HANZI_MEANING',
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface VocabSet {
  id: string;
  name: string;
  createdAt: number;
  items: VocabItem[];
}

export interface CardItem {
  id: string;
  content: string;
  vocabId: string;
  type: 'hanzi' | 'pinyin' | 'meaning';
  isMatched: boolean;
  isSelected: boolean;
  isError?: boolean;
}

export interface User {
  name: string;
  avatar: string;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  GAME = 'GAME',
}

export interface GameConfig {
  sourceType: 'HSK' | 'UPLOAD';
  hskLevel?: number;
  setId?: string; // ID của danh sách tự tạo (nếu có)
  customVocab?: VocabItem[];
  mode: GameMode;
}