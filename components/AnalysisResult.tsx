import React from 'react';
import { AnalysisData } from '../types';

interface AnalysisResultProps {
  data: AnalysisData;
  imageUrl: string;
  onReset: () => void;
}

const ScoreCircle: React.FC<{ score: number; label: string; delay: string }> = ({ score, label, delay }) => (
  <div className={`flex flex-col items-center animate-fade-in ${delay}`}>
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-2xl"></div>
      
      {/* Ring */}
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1e293b" // slate-800
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * score) / 100}
          strokeLinecap="round"
          className="transition-all duration-1500 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" /> {/* slate-400 */}
            <stop offset="100%" stopColor="#fbbf24" /> {/* amber-400 */}
          </linearGradient>
        </defs>
      </svg>
      
      {/* Text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold text-amber-50 font-calligraphy drop-shadow-lg">{score}</span>
        <span className="text-xs text-slate-500 mt-1 uppercase tracking-[0.2em]">分</span>
      </div>
    </div>
    <span className="mt-4 text-slate-300 text-sm md:text-base font-medium tracking-widest uppercase">{label}</span>
  </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, imageUrl, onReset }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-slide-up pb-20">
      
      {/* Left Column: Image & Scores */}
      <div className="space-y-12 flex flex-col">
        {/* Image Card */}
        <div className="relative group rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/80">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
          />
          {/* Badge */}
          <div className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
            <span className="text-xs text-slate-300 tracking-[0.3em] font-light">AI PHYSIOGNOMY</span>
          </div>
        </div>

        {/* Scores Row */}
        <div className="flex justify-around items-center bg-slate-800/30 rounded-3xl p-10 border border-white/5 backdrop-blur-sm">
          <ScoreCircle score={data.appearanceScore} label="颜值指数" delay="delay-100" />
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-600/30 to-transparent"></div>
          <ScoreCircle score={data.fortuneScore} label="今日运势" delay="delay-200" />
        </div>
      </div>

      {/* Right Column: Analysis Text */}
      <div className="space-y-10 flex flex-col justify-center">
        
        {/* Poem Section */}
        <div className="relative text-center py-12 px-8 bg-gradient-to-b from-slate-800/80 to-transparent rounded-t-[2rem] border-t border-x border-slate-700/30 animate-fade-in delay-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400/50 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
          <h2 className="font-calligraphy text-4xl md:text-5xl text-amber-100 mb-4 drop-shadow-lg leading-relaxed tracking-wide">
            {data.poem.split(/[,，。]/)[0]}
          </h2>
          <h2 className="font-calligraphy text-4xl md:text-5xl text-amber-100 drop-shadow-lg leading-relaxed tracking-wide">
            {data.poem.split(/[,，。]/)[1]?.replace(/[。]/, '') || ''}
          </h2>
        </div>

        {/* Details Section */}
        <div className="bg-slate-900/40 rounded-b-[2rem] border border-white/5 p-8 md:p-12 space-y-10 backdrop-blur-sm animate-fade-in delay-500">
          
          {/* Appearance Commentary */}
          <div>
            <h3 className="flex items-center text-slate-300 font-bold mb-4 text-lg tracking-wider">
              <span className="text-amber-400 mr-3 text-2xl">◈</span> 形象点评
            </h3>
            <p className="text-slate-300/90 leading-loose text-justify text-lg font-light">
              {data.compliment}
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          {/* Fortune Advice */}
          <div>
            <h3 className="flex items-center text-amber-200/90 font-bold mb-4 text-lg tracking-wider">
              <span className="text-amber-400 mr-3 text-2xl">◈</span> 运势指引
            </h3>
            <p className="text-slate-300/90 leading-loose text-justify text-lg font-light">
              {data.fortuneAdvice}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <button
              onClick={onReset}
              className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 hover:border-slate-500 text-slate-200 font-medium tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/30 flex items-center justify-center space-x-3 group"
            >
              <svg className="w-5 h-5 text-amber-400/70 group-hover:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>再测一次</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};