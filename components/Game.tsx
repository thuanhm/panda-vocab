import React, { useState, useEffect } from 'react';
import { VocabItem, GameMode, CardItem } from '../types';
import confetti from 'canvas-confetti';
import Button from './Button';

interface GameProps {
  vocabList: VocabItem[];
  mode: GameMode;
  onExit: () => void;
  onRestart: () => void;
  onNext: () => void;
}

const Game: React.FC<GameProps> = ({ vocabList, mode, onExit, onRestart, onNext }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [vocabList, mode]);

  const initializeGame = () => {
    const newCards: CardItem[] = [];
    
    vocabList.forEach((vocab) => {
      // Card 1: Hanzi
      newCards.push({
        id: `${vocab.id}-hanzi`,
        content: vocab.hanzi,
        vocabId: vocab.id,
        type: 'hanzi',
        isMatched: false,
        isSelected: false,
      });

      // Card 2: Pinyin or Meaning (based on mode)
      if (mode === GameMode.HANZI_PINYIN) {
        newCards.push({
          id: `${vocab.id}-pinyin`,
          content: vocab.pinyin,
          vocabId: vocab.id,
          type: 'pinyin',
          isMatched: false,
          isSelected: false,
        });
      } else {
        newCards.push({
          id: `${vocab.id}-meaning`,
          content: vocab.meaning,
          vocabId: vocab.id,
          type: 'meaning',
          isMatched: false,
          isSelected: false,
        });
      }
    });

    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setIsComplete(false);
  };

  const handleCardClick = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || selectedCards.includes(cardId)) return;
    if (selectedCards.length >= 2) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    // Update card state
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isSelected: true } : c
    ));

    if (newSelected.length === 2) {
      checkMatch(newSelected);
    }
  };

  const checkMatch = (selected: string[]) => {
    const [id1, id2] = selected;
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    if (card1 && card2 && card1.vocabId === card2.vocabId) {
      // Match!
      setTimeout(() => {
        setCards(cards.map(c => 
          c.vocabId === card1.vocabId 
            ? { ...c, isMatched: true, isSelected: false }
            : c
        ));
        setMatchedPairs([...matchedPairs, card1.vocabId]);
        setSelectedCards([]);
        setScore(score + 10);

        // Confetti effect
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Check if game complete
        if (matchedPairs.length + 1 === vocabList.length) {
          setTimeout(() => {
            setIsComplete(true);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }, 500);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        setCards(cards.map(c => 
          selected.includes(c.id)
            ? { ...c, isSelected: false, isError: true }
            : c
        ));
        
        setTimeout(() => {
          setCards(cards.map(c => ({ ...c, isError: false })));
          setSelectedCards([]);
        }, 500);
      }, 500);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-panda-dark mb-2">Chúc mừng!</h2>
        <p className="text-gray-600 mb-6">Bạn đã hoàn thành màn chơi!</p>
        <div className="bg-panda-accent/20 p-4 rounded-xl mb-6">
          <p className="text-4xl font-bold text-panda-dark">{score} điểm</p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={onRestart} variant="secondary">
            🔄 Chơi Lại
          </Button>
          <Button onClick={onNext} variant="primary">
            ▶️ Chơi Tiếp
          </Button>
          <Button onClick={onExit} variant="danger">
            🏠 Về Trang Chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Thoát
          </button>
          <div>
            <p className="text-sm text-gray-500">Điểm</p>
            <p className="text-2xl font-bold text-panda-primary">{score}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Tiến độ</p>
          <p className="text-lg font-bold text-panda-dark">
            {matchedPairs.length} / {vocabList.length}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || selectedCards.length >= 2}
            className={`
              aspect-square p-4 rounded-xl font-bold text-center transition-all duration-300
              flex items-center justify-center text-lg
              ${card.isMatched 
                ? 'bg-green-100 border-4 border-green-400 text-green-700 scale-95 opacity-50' 
                : card.isSelected
                  ? 'bg-blue-100 border-4 border-blue-400 text-blue-700 scale-105 shadow-lg'
                  : card.isError
                    ? 'bg-red-100 border-4 border-red-400 text-red-700 animate-shake'
                    : 'bg-white border-4 border-gray-200 text-panda-dark hover:border-panda-primary hover:shadow-lg active:scale-95'
              }
              ${card.type === 'hanzi' ? 'text-2xl' : 'text-base'}
            `}
          >
            {card.content}
          </button>
        ))}
      </div>

      {/* Helper Text */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        {mode === GameMode.HANZI_PINYIN 
          ? '💡 Ghép Hán tự với Pinyin tương ứng'
          : '💡 Ghép Hán tự với nghĩa tiếng Việt'
        }
      </div>
    </div>
  );
};

export default Game;
