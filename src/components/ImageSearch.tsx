import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageSearchProps {
  onDesignNumberFound: (designNumber: string) => void;
}

export default function ImageSearch({ onDesignNumberFound }: ImageSearchProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    const worker = await createWorker();

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      
      // Look for patterns that match design numbers (e.g., D.No 123 or D.123)
      const match = text.match(/D\.(?:No\s*)?(\d+)/i);
      
      if (match) {
        onDesignNumberFound(match[1]);
        toast.success('Design number found!');
      } else {
        toast.error('No design number found in image');
      }
    } catch (error) {
      toast.error('Error processing image');
      console.error(error);
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
        <div className="space-y-1 text-center">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isProcessing ? 'Processing...' : 'Upload or take a photo of the design'}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
          disabled={isProcessing}
        />
      </label>
    </div>
  );
}