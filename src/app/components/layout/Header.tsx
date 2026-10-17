"use client";

import { Search, MapPin, ChevronDown, X, Leaf } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 pt-3 pb-3 shadow-xs">
      {/* Top row: Brand & Delivery Time Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <Leaf className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="font-extrabold text-stone-900 text-lg leading-tight tracking-tight">
              Fresh<span className="text-emerald-600">Mart</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Fast 20-min delivery
            </p>
          </div>
        </div>

        {/* Address Badge */}
        <button 
          type="button"
          className="bg-stone-100 hover:bg-stone-200/80 transition-colors py-1.5 px-3 rounded-full flex items-center space-x-1.5 text-xs font-semibold text-stone-700 active:scale-95 transition-transform"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate max-w-[100px]">Home</span>
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search fruits, vegetables, dairy, bakery..."
          className="w-full bg-stone-100/90 border border-stone-200/80 rounded-2xl py-2.5 pl-10 pr-9 text-sm placeholder:text-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
