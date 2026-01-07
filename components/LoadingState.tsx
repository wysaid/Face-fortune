import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
      {/* Mystical Orb Animation */}
      <div className="relative w-40 h-40 mb-10">
        <div className="absolute inset-0 rounded-full border border-t-amber-400/60 border-r-slate-500/30 border-b-slate-500/30 border-l-transparent animate-spin duration-[3s]"></div>
        <div className="absolute inset-4 rounded-full border border-t-transparent border-r-transparent border-b-amber-200/40 border-l-slate-400/40 animate-[spin_2s_linear_infinite_reverse]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500/20 to-slate-500/20 rounded-full animate-pulse blur-md"></div>
        </div>
      </div>
      
      <h3 className="text-3xl font-calligraphy text-amber-100/90 mb-3 tracking-widest">正在观相中...</h3>
      <p className="text-slate-500 text-sm animate-pulse tracking-widest uppercase font-light">
        AI Reading in progress
      </p>
    </div>
  );
};