import React from 'react';
import { BlockType } from '../types';
import { BLOCK_STYLES } from '../constants';
import { Check } from 'lucide-react';

interface LevelGoalProps {
  type: BlockType;
  count: number;
  isCompleted: boolean;
}

export const LevelGoal: React.FC<LevelGoalProps> = ({ type, count, isCompleted }) => {
  const style = BLOCK_STYLES[type];
  const Icon = style.icon;

  return (
    <div className={`
      relative flex flex-col items-center justify-center p-2 rounded-lg 
      bg-slate-800 border-2 ${isCompleted ? 'border-green-500' : 'border-slate-600'}
      transition-colors duration-300
    `}>
      {isCompleted && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 shadow-md z-10">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
      <div className={`mb-1 ${style.textColor}`}>
        {Icon && <Icon size={20} />}
      </div>
      <span className={`font-bold text-sm ${isCompleted ? 'text-green-400' : 'text-white'}`}>
        {Math.max(0, count)}
      </span>
    </div>
  );
};
