import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ThumbnailDisplay } from './components/ThumbnailDisplay';
import { getVideoTitle, generateThumbnailImage, addOverlaysToImage } from './services/geminiService';

export default function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [baseThumbnails, setBaseThumbnails] = useState<string[] | null>(null);
  const [finalThumbnail, setFinalThumbnail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setUserImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please enter a video title or YouTube URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBaseThumbnails(null);
    setFinalThumbnail(null);

    try {
      // Step 1: Get Video Title
      setLoadingStep('Analyzing input and extracting title...');
      const title = await getVideoTitle(userInput);
      setVideoTitle(title);

      // Step 2: Generate Base Image Variations with ImageGen
      setLoadingStep('Generating image variations with AI...');
      const baseImages = await generateThumbnailImage(title);
      setBaseThumbnails(baseImages);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [userInput]);

  const handleFinalizeThumbnail = useCallback(async (selectedImage: string) => {
    setIsLoading(true);
    setError(null);
    setBaseThumbnails(null);

    try {
      // Step 3: Add Text Overlay (and user image if provided) with Nano Banana
      setLoadingStep('Adding stylish overlays to your selection...');
      const finalImage = await addOverlaysToImage(selectedImage, videoTitle, userImage);
      setFinalThumbnail(`data:image/jpeg;base64,${finalImage}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [videoTitle, userImage]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8 sm:mt-12 md:mt-16">
          <p className="text-center text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Instantly create stunning, clickable YouTube thumbnails. Just enter your video title or a link to get started.
          </p>
          
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-900/10">
            <InputForm
              userInput={userInput}
              setUserInput={setUserInput}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              userImage={userImage}
            />
            {error && <div className="mt-6 text-center text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</div>}
            
            <ThumbnailDisplay 
              isLoading={isLoading}
              loadingStep={loadingStep}
              baseThumbnails={baseThumbnails}
              finalThumbnail={finalThumbnail}
              onSelectThumbnail={handleFinalizeThumbnail}
            />
          </div>
        </main>
      </div>
    </div>
  );
}