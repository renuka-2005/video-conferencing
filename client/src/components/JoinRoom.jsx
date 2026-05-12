import React, { useState } from 'react';
import { Video, RefreshCw, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

export const JoinRoom = ({ onJoin, onBack }) => {
  const [roomId, setRoomId] = useState('');
  const { user, logout } = useAuth();

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 11).toUpperCase();
    setRoomId(id);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (user?.username && roomId.trim()) {
      onJoin(roomId.trim(), user.username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]"></div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>
      
      {/* Top right logout */}
      <button 
        onClick={logout}
        className="absolute top-8 right-8 flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Log out</span>
      </button>

      <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/5 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Join Meeting</h1>
          <p className="text-gray-400 text-center text-lg">
            Enter a Room ID to start connecting with your team.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-8">
          <div className="space-y-3">
            <label htmlFor="roomId" className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
              Room Identification
            </label>
            <div className="flex gap-3">
              <input
                id="roomId"
                type="text"
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                placeholder="EX: A1B2C3D4E"
              />
              <button
                type="button"
                onClick={generateRoomId}
                className="px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center justify-center group active:scale-95"
                title="Generate Random ID"
              >
                <RefreshCw className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!roomId.trim()}
            className={cn(
              "w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl",
              roomId.trim() 
                ? "bg-primary hover:bg-blue-600 text-white shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-white/5 cursor-not-allowed text-gray-600 border border-white/5"
            )}
          >
            <span>JOIN ROOM</span>
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secured by encryption</span>
        </div>
      </div>
    </div>
  );
};
