import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Shield, Zap, MessageSquare, Globe, ArrowRight, Star, Users, CheckCircle2 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
           Video Conferencing
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Security</a>
          <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-white/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-8 animate-fade-in">
          <Star className="w-3.5 h-3.5 fill-blue-400" />
          <span className="uppercase tracking-widest">Video Conferencing</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8 animate-slide-up">
          Meetings without <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
            the Friction.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Experience the future of collaboration. Real-time AI subtitles, 
          instant meeting summaries, and crystal-clear 4K video.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link 
            to="/register"
            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg transition-all">
            Book a Demo
          </button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-24 relative w-full max-w-5xl group animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Mock UI elements to represent the app */}
            <div className="h-8 bg-white/5 flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              <div className="flex-1 text-[10px] text-gray-500 text-center font-mono">antigravity.io/meeting/global-sync</div>
            </div>
            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative">
              {/* Representing Video Grid */}
              <div className="grid grid-cols-3 gap-3 p-6 w-full h-full opacity-60">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white/20" />
                  </div>
                ))}
              </div>
              {/* Floating Subtitle Mock */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300 italic">"Our AI is transcribing this meeting in real-time..."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-12 text-center">
            Trusted by teams at forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale contrast-125">
            {/* Placeholder logos */}
            <div className="text-2xl font-bold">ALPHA</div>
            <div className="text-2xl font-bold">OMEGA</div>
            <div className="text-2xl font-bold">VERTEX</div>
            <div className="text-2xl font-bold">NEXUS</div>
            <div className="text-2xl font-bold">PRISM</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to <br/> collaborate effectively</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful tools integrated into a single seamless experience. 
            No plugins required, works directly in your browser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
            title="Real-time AI Subtitles"
            description="Automatic transcription and live captions for every meeting, powered by state-of-the-art speech recognition."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-purple-400" />}
            title="AI Summarization"
            description="Get concise meeting summaries and action items instantly with our built-in Gemini AI integration."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-emerald-400" />}
            title="Global Infrastructure"
            description="Ultra-low latency connections across 50+ regions for a seamless meeting experience anywhere."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-orange-400" />}
            title="Secure by Default"
            description="End-to-end encryption and robust authentication ensure your conversations stay private."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-pink-400" />}
            title="Unlimited Participants"
            description="Scale from 1:1 calls to massive team meetings without compromising on video or audio quality."
          />
          <FeatureCard 
            icon={<CheckCircle2 className="w-6 h-6 text-blue-400" />}
            title="Enterprise Ready"
            description="Advanced admin controls, usage analytics, and custom integrations for large scale deployments."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Video Conferencing</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Redefining human connection through immersive, AI-powered communication tools. 
              Built for the modern hybrid world.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs text-gray-600">© 2026  All rights reserved.</p>
          <div className="flex gap-8 text-xs text-gray-600">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group hover:-translate-y-1">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600/10 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);
