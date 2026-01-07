import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingState } from './components/LoadingState';
import { analyzeImage } from './services/geminiService';
import { AnalysisData } from './types';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      setImage(resultStr);
    };
    reader.readAsDataURL(file);

    // Start analysis
    setLoading(true);
    try {
      // Convert file to base64 string for API
      const base64Data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        r.onload = () => {
          if (typeof r.result === 'string') {
            // Remove data:image/xxx;base64, prefix
            const base64Content = r.result.split(',')[1];
            resolve(base64Content);
          } else {
            reject(new Error('Failed to process image'));
          }
        };
        r.onerror = error => reject(error);
      });

      const data = await analyzeImage(base64Data, file.type);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('AI 也就是打了个盹，请重试一下吧 (API Key 可能未配置或配额不足)');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-slate-100 font-serif selection:bg-amber-500 selection:text-white overflow-x-hidden">
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 mb-6 drop-shadow-2xl">
            AI 观相 · 运势解析
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light tracking-[0.2em] uppercase">
            上传照片 · 探寻你的颜值密码与今日运程
          </p>
        </header>

        {/* Main Content */}
        <main className="relative w-full">
          {error && (
             <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-500/30 text-red-200 px-8 py-6 rounded-2xl mb-12 text-center animate-fade-in backdrop-blur-sm shadow-lg">
               {error}
             </div>
          )}

          {!image && !loading && (
            <div className="animate-slide-up py-8">
              <UploadZone onImageSelect={handleImageSelect} />
            </div>
          )}

          {loading && (
            <LoadingState />
          )}

          {image && !loading && result && (
            <div className="animate-fade-in">
              <AnalysisResult 
                data={result} 
                imageUrl={image} 
                onReset={handleReset} 
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-32 text-center text-slate-600 text-sm tracking-wider">
          <p>© 2024 AI Fortune Teller. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
}