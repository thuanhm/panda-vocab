import React, { useState, useEffect } from 'react';
import { VocabItem, CardItem, GameMode } from '../types';
import GameCard from './GameCard';
import Button from './Button';
import confetti from 'canvas-confetti';

interface GameProps {
  vocabList: VocabItem[];
  mode: GameMode;
  onExit: () => void;
  onRestart: () => void; // Chơi lại danh sách hiện tại
  onNext: () => void;    // Tạo danh sách mới
}

const Game: React.FC<GameProps> = ({ vocabList, mode, onExit, onRestart, onNext }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);

  // Initialize Game
  useEffect(() => {
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

      // Card 2: Based on Mode
      const content2 = mode === GameMode.HANZI_PINYIN ? vocab.pinyin : vocab.meaning;
      const type2 = mode === GameMode.HANZI_PINYIN ? 'pinyin' : 'meaning';

      newCards.push({
        id: `${vocab.id}-${type2}`,
        content: content2,
        vocabId: vocab.id,
        type: type2,
        isMatched: false,
        isSelected: false,
      });
    });

    // Shuffle
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCardId(null);
    setWrongPairIds([]);
    setMatchedCount(0);
  }, [vocabList, mode]);

  const handleCardClick = (clickedCard: CardItem) => {
    // Ignore clicks on matched cards or if we are currently showing an error animation
    if (clickedCard.isMatched || wrongPairIds.length > 0) return;

    // Deselect if clicking the same card
    if (clickedCard.id === selectedCardId) {
      setSelectedCardId(null);
      setCards(prev => prev.map(c => c.id === clickedCard.id ? { ...c, isSelected: false } : c));
      return;
    }

    // Select the card visually
    setCards(prev => prev.map(c => 
      c.id === clickedCard.id ? { ...c, isSelected: true } : 
      c.id === selectedCardId ? c : // Keep the currently selected one selected
      { ...c, isSelected: false } // Deselect others (safety)
    ));

    if (selectedCardId === null) {
      // First card selection
      setSelectedCardId(clickedCard.id);
    } else {
      // Second card selection - check match
      const prevCard = cards.find(c => c.id === selectedCardId);
      if (!prevCard) return;

      if (prevCard.vocabId === clickedCard.vocabId) {
        // MATCH!
        setCards(prev => prev.map(c => 
          c.id === clickedCard.id || c.id === selectedCardId
            ? { ...c, isMatched: true, isSelected: false }
            : c
        ));
        setMatchedCount(prev => prev + 1);
        setSelectedCardId(null);
      } else {
        // NO MATCH
        setWrongPairIds([selectedCardId, clickedCard.id]);
        
        // Show error state
        setCards(prev => prev.map(c => 
          c.id === clickedCard.id || c.id === selectedCardId
            ? { ...c, isError: true, isSelected: false }
            : c
        ));

        // Reset after delay
        setTimeout(() => {
          setWrongPairIds([]);
          setSelectedCardId(null);
          setCards(prev => prev.map(c => 
            c.id === clickedCard.id || c.id === selectedCardId
              ? { ...c, isError: false, isSelected: false }
              : c
          ));
        }, 800);
      }
    }
  };

  // Win Condition
  useEffect(() => {
    if (vocabList.length > 0 && matchedCount === vocabList.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9FAC', '#A0E8AF', '#FFD57E']
      });
    }
  }, [matchedCount, vocabList.length]);

  const isWin = vocabList.length > 0 && matchedCount === vocabList.length;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-2">
         <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-panda-dark">Điểm: {matchedCount} / {vocabList.length}</span>
         </div>
         <Button variant="outline" onClick={onExit} className="!py-2 !px-4 text-sm">
           Thoát
         </Button>
      </div>
      
      <p className="text-panda-dark/70 mb-6 font-semibold">
        Ghép các cặp từ tương ứng lại với nhau nhé!
      </p>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full mb-8">
        {cards.map(card => (
          <GameCard key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>

      {/* Win Modal Overlay */}
      {isWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-pop">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-panda-secondary">
              <div className="text-6xl mb-4">🐼🎉</div>
              <h2 className="text-3xl font-extrabold text-panda-dark mb-2">Tuyệt vời!</h2>
              <p className="text-gray-600 mb-6">Bạn đã ghép đúng tất cả các từ.</p>
              
              <div className="flex flex-col gap-3">
                <Button variant="secondary" onClick={onNext} className="w-full text-green-900">
                  ➡ Chơi tiếp (Từ mới)
                </Button>
                <Button onClick={onRestart} className="w-full">
                  ↺ Chơi lại (Bài này)
                </Button>
                <Button variant="outline" onClick={onExit} className="w-full">
                  🏠 Về trang chủ
                </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Game;