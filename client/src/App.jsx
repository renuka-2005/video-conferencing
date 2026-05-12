import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JoinRoom } from './components/JoinRoom';
import { VideoGrid } from './components/VideoGrid';
import { Controls } from './components/Controls';
import { Chat } from './components/Chat';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { useWebRTC } from './hooks/useWebRTC';
import { useSocket } from './context/SocketContext';
import { useAuth } from './context/AuthContext';
import { useSpeechToText } from './hooks/useSpeechToText';
import { SubtitleOverlay } from './components/SubtitleOverlay';
import { Home } from './components/Home';
import { LandingPage } from './components/LandingPage';
import { Download } from 'lucide-react';


function MeetingRoom({ roomId, username, onLeave }) {
  const {
    localStream,
    remoteStreams,
    toggleMediaTrack,
    toggleScreenShare,
    isScreenSharing,
    participants,
    mediaStatus
  } = useWebRTC(roomId, username);

  const socket = useSocket();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [subtitles, setSubtitles] = useState([]); // [{username, text}]
  const [fullTranscript, setFullTranscript] = useState([]); // [{username, text, timestamp}]
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSpeechResult = useCallback((text) => {
    if (socket && roomId) {
      socket.emit('subtitle-message', { roomId, text, username });
      
      // Update local subtitles (replace or add)
      setSubtitles(prev => {
        const others = prev.filter(s => s.username !== 'You');
        return [...others, { username: 'You', text }];
      });

      // Clear subtitle after 3 seconds
      setTimeout(() => {
        setSubtitles(prev => prev.filter(s => s.username !== 'You' || s.text !== text));
      }, 3000);

      // Add to full transcript for AI summary
      setFullTranscript(prev => [...prev, { username, text, timestamp: new Date() }]);
    }
  }, [socket, roomId, username]);

  const { isListening, toggleListening } = useSpeechToText(handleSpeechResult);

  useEffect(() => {
    if (!socket) return;

    socket.on('subtitle-message', ({ username: senderName, text }) => {
      setSubtitles(prev => {
        const others = prev.filter(s => s.username !== senderName);
        return [...others, { username: senderName, text }];
      });

      // Add to full transcript
      setFullTranscript(prev => [...prev, { username: senderName, text, timestamp: new Date() }]);

      // Clear after 3 seconds
      setTimeout(() => {
        setSubtitles(prev => prev.filter(s => s.username !== senderName || s.text !== text));
      }, 3000);
    });

    return () => {
      socket.off('subtitle-message');
    };
  }, [socket]);

  const handleSummarize = async () => {
    if (fullTranscript.length === 0) {
      alert("No transcript available to summarize.");
      return;
    }

    setIsSummarizing(true);
    try {
      const transcriptText = fullTranscript
        .map(t => `[${t.username}]: ${t.text}`)
        .join('\n');

      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText })
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Summary failed", err);
      alert("Failed to generate summary. Make sure the backend is running.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const file = new Blob([summary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Meeting_Summary_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setChatUnreadCount(0);
    }
  };

  const handleUnreadMsg = () => {
    setChatUnreadCount(prev => prev + 1);
  };

  const handleLeave = () => {
    if (socket) {
       socket.disconnect();
       // re-connect socket for next join
       socket.connect();
    }
    onLeave();
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden font-sans relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm border border-white/10 shadow-lg">
        <span className="text-gray-400">Room:</span> <span className="font-bold tracking-wider">{roomId}</span>
      </div>

      <div className="flex-1 relative overflow-hidden transition-all duration-300" style={{ marginRight: isChatOpen ? '320px' : '0' }}>
        <VideoGrid 
          localStream={localStream} 
          remoteStreams={remoteStreams} 
          participants={participants}
          username={username} 
        />
      </div>

      <Chat 
        roomId={roomId}
        username={username}
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onUnreadMsg={handleUnreadMsg}
      />

      <SubtitleOverlay subtitles={subtitles} />

      {summary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-surface max-w-2xl w-full rounded-2xl p-8 border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Meeting Summary</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleDownloadSummary}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => setSummary('')}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="prose prose-invert max-h-[60vh] overflow-y-auto pr-4 text-gray-300 whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        </div>
      )}

      <Controls 
        onToggleMic={() => toggleMediaTrack('audio')}
        onToggleVideo={() => toggleMediaTrack('video')}
        onToggleScreenShare={toggleScreenShare}
        onLeave={handleLeave}
        isScreenSharing={isScreenSharing}
        onToggleChat={handleToggleChat}
        chatUnreadCount={chatUnreadCount}
        onToggleSubtitle={toggleListening}
        isSubtitleOn={isListening}
        mediaStatus={mediaStatus}
      />
      
      {/* AI Summary Button */}
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="fixed bottom-24 right-4 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-all z-30 disabled:opacity-50"
      >
        {isSummarizing ? 'Summarizing...' : 'AI Summary'}
      </button>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function MainApp() {
  const [view, setView] = useState('home'); // 'home', 'join', 'meeting'
  const [roomData, setRoomData] = useState({ roomId: '', username: '' });
  const { user } = useAuth();

  const handleStartMeeting = () => {
    const id = Math.random().toString(36).substring(2, 11);
    setRoomData({ roomId: id, username: user.username });
    setView('meeting');
  };

  const handleJoinClick = () => {
    setView('join');
  };

  const handleJoinSubmit = (roomId, username) => {
    setRoomData({ roomId, username });
    setView('meeting');
  };

  const handleLeave = () => {
    setView('home');
    setRoomData({ roomId: '', username: '' });
  };

  return (
    <>
      {view === 'home' && (
        <Home 
          onStartMeeting={handleStartMeeting} 
          onJoinMeeting={handleJoinClick} 
        />
      )}
      {view === 'join' && (
        <JoinRoom 
          onJoin={handleJoinSubmit} 
          onBack={() => setView('home')}
        />
      )}
      {view === 'meeting' && (
        <MeetingRoom 
          roomId={roomData.roomId} 
          username={roomData.username} 
          onLeave={handleLeave} 
        />
      )}
    </>
  );
}


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            user ? <MainApp /> : <LandingPage />
          } 
        />
        {/* Fallback to home if authenticated but on wrong path, or redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
