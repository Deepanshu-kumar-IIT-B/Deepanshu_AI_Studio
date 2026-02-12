
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="pt-12 pb-8 px-6 text-center space-y-2">
      <h1 className="vogue-title text-3xl font-black uppercase tracking-tighter leading-tight">
        Deepanshu AI studio
      </h1>
      <div className="flex items-center justify-center space-x-3 opacity-60">
        <span className="h-[1px] w-4 bg-zinc-700"></span>
        <p className="uppercase tracking-[0.6em] text-[9px] font-bold text-zinc-400">
          AI FASHION ENHANCER
        </p>
        <span className="h-[1px] w-4 bg-zinc-700"></span>
      </div>
    </header>
  );
};

export default Header;
