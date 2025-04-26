import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64String: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [base64Image, setBase64Image] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBase64Image(base64String);
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center w-full">
        <label 
          htmlFor="image-upload"
          className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-[#46392d] rounded-lg shadow-lg tracking-wide border border-[#46392d]/20 cursor-pointer hover:bg-[#46392d]/5 transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base">Select an image</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {base64Image && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
          <img
            src={base64Image}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 