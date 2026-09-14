import React from 'react';
import { Sparkles, ScanFace } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAssistantButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function AIAssistantButton({ onClick, isOpen }: AIAssistantButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden select-none">
      <motion.button
        id="dnyl-ai-advisor-trigger"
        onClick={onClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.35)] border border-zinc-700/60 hover:border-zinc-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
        aria-label="Open DNYL AI Style Advisor and Virtual Try-On"
      >
        {/* Ambient Subtle Glow */}
        <span className="absolute -inset-0.5 rounded-full bg-linear-to-r from-emerald-500/20 via-zinc-400/20 to-emerald-500/20 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Icon with Optical Frame Badge */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-white group-hover:border-zinc-500 transition-colors">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        {/* Text Details */}
        <div className="flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-white font-sans">
              Find My Frame
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[8px] font-bold tracking-wider uppercase bg-zinc-800 text-emerald-400 rounded-xs border border-zinc-700">
              AI
            </span>
          </div>
          <span className="text-[9px] tracking-wider text-zinc-400 font-medium font-sans">
            Style Advisor &amp; Virtual Try-On
          </span>
        </div>
      </motion.button>
    </div>
  );
}
