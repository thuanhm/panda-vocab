import React from 'react';
import { CardItem } from '../types';

interface GameCardProps {
  card: CardItem;
  onClick: (card: CardItem) => void;
}

const GameCard: React.FC<GameCardProps> = ({ card, onClick }) => {
  // Determine card style based on state
  // Default is "face up" - white background, visible text
  let containerClass = "bg-white border-b-4 border-gray-200 hover:-translate-y-1 hover:shadow-md";
  let textClass = "text-gray-700";
  
  if (card.isMatched) {
    containerClass = "bg-panda-secondary border-b-4 border-green-400 opacity-60 scale-95 cursor-default"; // Success green
    textClass = "text-green-900";
  } else if (card.isError) {
    containerClass = "bg-red-100 border-b-4 border-red-400 animate-shake"; // Error red shake
    textClass = "text-red-800";
  } else if (card.isSelected) {
    containerClass = "bg-panda-primary border-b-4 border-pink-400 -translate-y-1 shadow-md"; // Active pink
    textClass = "text-white";
  }

  // Determine font size based on text length
  const fontSize = card.content.length > 10 ? 'text-sm' : card.content.length > 4 ? 'text-lg' : 'text-2xl';

  return (
    <div 
      onClick={() => !card.isMatched ? onClick(card) : null}
      className={`
        relative w-full aspect-square cursor-pointer transition-all duration-200 transform
        ${containerClass}
        rounded-2xl flex items-center justify-center p-2 text-center select-none
      `}
    >
        <span className={`font-bold ${fontSize} ${textClass} break-words leading-tight`}>
          {card.content}
        </span>
    </div>
  );
};

export default GameCard;