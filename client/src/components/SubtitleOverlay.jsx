import React from 'react';

export const SubtitleOverlay = ({ subtitles }) => {
  if (subtitles.length === 0) return null;

  return (
    <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center pointer-events-none z-40">
      <div className="space-y-2 max-w-[80%]">
        {subtitles.map((sub) => (
          <div
            key={sub.username}
            className="bg-black/70 backdrop-blur-md px-6 py-2 rounded-full text-white text-center border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2 transition-all duration-300"
          >
            <span className="font-bold text-primary mr-2">{sub.username}:</span>
            <span className="text-gray-100">{sub.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
