import React, { useState } from 'react';
import { generateDrawingPrompt } from '../services/geminiService';
import { SparklesIcon } from './Icons';

interface AIPromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
}

export const AIPromptGenerator: React.FC<AIPromptGeneratorProps> = ({ onPromptGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePrompt = async () => {
    setIsLoading(true);
    try {
      const newPrompt = await generateDrawingPrompt();
      onPromptGenerated(`來畫「${newPrompt}」吧！`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
      onPromptGenerated(`錯誤: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <button
        onClick={handleGeneratePrompt}
        disabled={isLoading}
        className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black shadow-brutalist-sm shadow-brutalist-sm-hover disabled:bg-gray-400 flex items-center gap-2 transition-all"
      >
        <SparklesIcon />
        <span className="hidden sm:inline">{isLoading ? '思考中...' : '來點靈感'}</span>
      </button>
  );
};
