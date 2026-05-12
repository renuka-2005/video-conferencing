import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';

export const Controls = ({ 
  onToggleMic, 
  onToggleVideo, 
  onToggleScreenShare, 
  onLeave, 
  isScreenSharing,
  onToggleChat,
  chatUnreadCount,
  onToggleSubtitle,
  isSubtitleOn,
  mediaStatus
}) => {
  const handleMicToggle = () => {
    console.log("Controls: Mic toggle clicked");
    onToggleMic();
  };

  const handleVideoToggle = () => {
    console.log("Controls: Video toggle clicked");
    onToggleVideo();
  };

  return (
    <div className="h-20 bg-background/95 backdrop-blur-md border-t border-white/10 flex items-center justify-center px-6 gap-4">
      
      {/* Mic Button */}
      <button
        onClick={handleMicToggle}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          mediaStatus.micOn ? "bg-surface hover:bg-surface/80 text-white" : "bg-danger hover:bg-danger/80 text-white"
        )}
        title={mediaStatus.micOn ? "Mute" : "Unmute"}
      >
        {mediaStatus.micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      {/* Video Button */}
      <button
        onClick={handleVideoToggle}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          mediaStatus.videoOn ? "bg-surface hover:bg-surface/80 text-white" : "bg-danger hover:bg-danger/80 text-white"
        )}
        title={mediaStatus.videoOn ? "Stop Video" : "Start Video"}
      >
        {mediaStatus.videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      {/* Screen Share Button */}
      <button
        onClick={onToggleScreenShare}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isScreenSharing ? "bg-primary hover:bg-primary/80 text-white" : "bg-surface hover:bg-surface/80 text-white"
        )}
        title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
      >
        <MonitorUp className="w-5 h-5" />
      </button>

      {/* Chat Toggle Button */}
      <button
        onClick={onToggleChat}
        className="w-12 h-12 rounded-full bg-surface hover:bg-surface/80 text-white flex items-center justify-center transition-all duration-200 relative"
        title="Chat"
      >
        <MessageSquare className="w-5 h-5" />
        {chatUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {chatUnreadCount}
          </span>
        )}
      </button>

      {/* Subtitle Toggle Button */}
      <button
        onClick={onToggleSubtitle}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isSubtitleOn ? "bg-primary hover:bg-primary/80 text-white" : "bg-surface hover:bg-surface/80 text-white"
        )}
        title={isSubtitleOn ? "Hide Subtitles" : "Show Subtitles"}
      >
        <span className="font-bold text-xs">CC</span>
      </button>

      {/* Leave Button */}
      <div className="w-px h-8 bg-white/10 mx-2"></div>
      
      <button
        onClick={onLeave}
        className="px-6 h-12 rounded-full bg-danger hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-danger/20"
      >
        <PhoneOff className="w-5 h-5" />
        <span>Leave</span>
      </button>

    </div>
  );
};
