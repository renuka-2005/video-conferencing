import React from 'react';
import { Video, Plus, LogOut, Shield, Zap, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home = ({ onStartMeeting, onJoinMeeting }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/20 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
           Video Conferencing
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">{user?.username}</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold animate-in fade-in slide-in-from-top-4">
            <Zap className="w-4 h-4" />
            <span>Video Conferencing</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter leading-none animate-in fade-in slide-in-from-left-4">
            Connect Beyond <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Boundaries.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed animate-in fade-in slide-in-from-left-6 duration-700">
            Experience crystal clear video calls with real-time AI subtitles, 
            instant summarization, and seamless screen sharing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <button 
              onClick={onStartMeeting}
              className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span>Start New Meeting</span>
            </button>
            
            <button 
              onClick={onJoinMeeting}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Video className="w-6 h-6" />
              <span>Join via ID</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
            <div>
              <div className="text-2xl font-bold">100+</div>
              <div className="text-sm text-gray-500">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4K</div>
              <div className="text-sm text-gray-500">Video Quality</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0.1s</div>
              <div className="text-sm text-gray-500">Latency</div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 gap-4 relative animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="space-y-4 pt-12">
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
              title="AI Subtitles"
              desc="Real-time translation and transcription for global teams."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-purple-400" />}
              title="Secure"
              desc="End-to-end encryption for all your conversations."
            />
          </div>
          <div className="space-y-4">
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-emerald-400" />}
              title="Reliable"
              desc="Built on decentralized infrastructure for 99.9% uptime."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Instant"
              desc="Zero lag, zero friction. Just one click to connect."
            />
          </div>
          
          {/* Decorative element */}
          <div className="absolute inset-0 bg-primary/5 blur-[80px] -z-10 rounded-full"></div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 left-8 text-sm text-gray-600">
        © 2026  All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl backdrop-blur-sm hover:bg-white/[0.05] transition-colors group cursor-default">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);
