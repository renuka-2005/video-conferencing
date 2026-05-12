import React from 'react';
import { VideoPlayer } from './VideoPlayer';

export const VideoGrid = ({ localStream, remoteStreams, participants, username }) => {
  // Total participants: local + others in participants list
  const totalParticipants = 1 + Object.keys(participants).length;

  // Determine grid columns based on number of participants
  let gridCols = 'grid-cols-1';
  if (totalParticipants === 2) gridCols = 'md:grid-cols-2';
  else if (totalParticipants >= 3 && totalParticipants <= 4) gridCols = 'md:grid-cols-2';
  else if (totalParticipants >= 5 && totalParticipants <= 9) gridCols = 'md:grid-cols-3';
  else if (totalParticipants > 9) gridCols = 'md:grid-cols-4';

  return (
    <div className={`w-full h-full p-4 grid gap-4 ${gridCols} auto-rows-fr`}>
      {/* Local Video */}
      <VideoPlayer 
        stream={localStream} 
        isLocal={true} 
        username={username} 
      />

      {/* Remote Videos and Placeholders */}
      {Object.entries(participants).map(([socketId, participantUsername]) => {
        const remoteData = remoteStreams[socketId];
        
        return (
          <VideoPlayer 
            key={socketId} 
            stream={remoteData?.stream || null} 
            isLocal={false} 
            username={participantUsername} 
          />
        );
      })}
    </div>
  );
};
