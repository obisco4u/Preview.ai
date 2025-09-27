import React, { useRef } from 'react';
import { Spinner } from './Spinner';
import { ImageIcon } from './icons/ImageIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface InputFormProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  userImage: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, onGenerate, isLoading, userImage, onImageUpload, onImageRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onGenerate();
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    event.target.value = '';
  };


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter video title or YouTube URL..."
          disabled={isLoading}
          className="w-full pl-14 pr-36 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition duration-200 disabled:opacity-50"
        />
        <button
          onClick={handleImageButtonClick}
          disabled={isLoading}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
          aria-label="Add image"
        >
          <ImageIcon className="w-7 h-7" />
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || !userInput.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-14 w-32 px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-full hover:from-orange-600 hover:via-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate'}
        </button>
      </div>

      {userImage && (
        <div className="mt-4 flex justify-center">
            <div className="relative w-24 h-24">
                <img src={userImage} alt="Uploaded preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <button 
                    onClick={onImageRemove} 
                    className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-white hover:bg-red-500 transition-colors duration-200 p-1"
                    aria-label="Remove image"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};