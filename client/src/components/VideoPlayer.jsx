import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ stream, isLocal, username }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log(`VideoPlayer: Setting stream for ${username}`, {
        streamId: stream.id,
        tracks: stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, label: t.label }))
      });
      
      videoRef.current.srcObject = stream;
      
      // Auto-play attempt
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          console.log(`Video playing for ${username}`);
        } catch (err) {
          console.warn(`Video play failed for ${username}:`, err);
        }
      };

      playVideo();
    }
  }, [stream, username]);

  return (
    <div className="relative w-full h-full bg-surface rounded-xl overflow-hidden border border-white/5 shadow-lg flex items-center justify-center">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-gray-500 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-white font-bold">{username?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      )}
      
      {/* Name Tag */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm">
        {username} {isLocal && "(You)"}
      </div>
    </div>
  );
};
