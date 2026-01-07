import React, { useCallback, useState } from 'react';

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (files[0].type.startsWith('image/')) {
          onImageSelect(files[0]);
        }
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className={`w-full max-w-2xl mx-auto border border-dashed rounded-[2rem] p-20 transition-all duration-500 cursor-pointer group backdrop-blur-sm
        ${
          isDragging
            ? 'border-amber-400/80 bg-slate-800/60 scale-105 shadow-[0_0_50px_rgba(251,191,36,0.1)]'
            : 'border-slate-600/40 hover:border-amber-200/40 hover:bg-white/[0.03]'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className={`p-6 rounded-full bg-slate-800/80 border border-slate-700 transition-transform duration-500 group-hover:scale-110 group-hover:border-amber-500/30 ${isDragging ? 'scale-110 border-amber-500/50' : ''}`}>
          <svg
            className="w-16 h-16 text-amber-100/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-medium text-slate-200 group-hover:text-amber-100 transition-colors">上传照片</h3>
          <p className="text-slate-500 mt-3 text-base font-light tracking-wide">
            点击选择或拖放照片至此<br />
            (支持 JPG, PNG 等常见格式)
          </p>
        </div>
      </div>
    </div>
  );
};