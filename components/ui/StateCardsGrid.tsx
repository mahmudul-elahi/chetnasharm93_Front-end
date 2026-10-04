import React from "react";
import StateCard, { StateCardConfig } from "./StateCard";

interface StateCardsGridProps {
  cards: StateCardConfig[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const StateCardsGrid: React.FC<StateCardsGridProps> = ({
  cards,
  columns = 4,
  className = "",
}) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 ${className}`}>
      {cards.map((card, index) => (
        <StateCard key={index} config={card} />
      ))}
    </div>
  );
};

export default StateCardsGrid;