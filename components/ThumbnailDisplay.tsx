import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface ThumbnailDisplayProps {
  isLoading: boolean;
  loadingStep: string;
  baseThumbnails: string[] | null;
  finalThumbnail: string | null;
  onSelectThumbnail: (imageBase64: string) => void;
}

export const ThumbnailDisplay: React.FC<ThumbnailDisplayProps> = ({ isLoading, loadingStep, baseThumbnails, finalThumbnail, onSelectThumbnail }) => {
  if (isLoading) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-800/50 min-h-[360px]">
        <Spinner className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold text-gray-200">Generating your thumbnail...</p>
        <p className="text-gray-400 mt-2">{loadingStep}</p>
      </div>
    );
  }

  if (baseThumbnails && baseThumbnails.length > 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Step 2: Choose Your Favorite Style</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {baseThumbnails.map((imgSrc, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
              onClick={() => onSelectThumbnail(imgSrc)}
              role="button"
              tabIndex={0}
              aria-label={`Select thumbnail variation ${index + 1}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectThumbnail(imgSrc); }}
            >
              <img src={`data:image/jpeg;base64,${imgSrc}`} alt={`Thumbnail variation ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-xl font-bold">Select this Style</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (finalThumbnail) {
    return (
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-6">Step 3: Download Your Thumbnail!</h2>
        <div className="relative group w-full max-w-2xl aspect-video rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden">
          <img src={finalThumbnail} alt="Generated YouTube Thumbnail" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <a
              href={finalThumbnail}
              download="youtube_thumbnail.jpg"
              className="inline-flex items-center gap-3 px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-transform duration-200 transform group-hover:scale-105"
            >
              <DownloadIcon className="w-6 h-6"/>
              Download
            </a>
           </div>
        </div>
      </div>
    );
  }

  return null;
};