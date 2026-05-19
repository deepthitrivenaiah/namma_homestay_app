import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './UI';
import { Home, User, LogOut, Search, Map } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-brand-olive rounded-xl group-hover:rotate-12 transition-transform">
          <Home className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-brand-olive">NAMMA</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-earth/40 leading-none">HomeStay</p>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-earth/60">
        <Link to="/explore" className="hover:text-brand-olive transition-colors">Explore Stays</Link>
        {user && profile?.role === 'host' && (
          <Link to="/host" className="hover:text-brand-olive transition-colors">Host Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold">{user.displayName}</span>
              <span className="text-[10px] uppercase text-brand-earth/40">{profile?.role}</span>
            </div>
            <button 
              onClick={signOut}
              className="p-3 hover:bg-brand-olive/5 rounded-full text-brand-earth/60 hover:text-brand-olive transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Button onClick={signIn} size="sm">Host Portal Login</Button>
        )}
      </div>
    </nav>
  );
}
