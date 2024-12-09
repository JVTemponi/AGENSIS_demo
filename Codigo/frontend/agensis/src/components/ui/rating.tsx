import { useState, useEffect } from 'react';

interface RatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

const Rating = ({ value = 0, onChange, readonly = false }: RatingProps) => {
  const [rating, setRating] = useState(value);

  // Atualiza o rating interno quando o valor da prop muda
  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleStarClick = (index: number) => {
    if (readonly) return;
    
    const newRating = index + 1;
    setRating(newRating);
    
    // Chama a função onChange se ela existir
    if (onChange) {
      onChange(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          className={`
            ${readonly ? '' : 'cursor-pointer'} 
            ${i < rating ? 'text-yellow-500' : 'text-gray-300'} 
            text-2xl
            transition-colors
            duration-200
            hover:text-yellow-400
          `}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex">{renderStars()}</div>
    </div>
  );
};

export { Rating };