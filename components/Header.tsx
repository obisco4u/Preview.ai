import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row justify-center items-center text-center gap-4">
      <SparklesIcon className="w-12 h-12 text-orange-400" />
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 text-transparent bg-clip-text">
        Preview.ai
      </h1>
    </header>
  );
};