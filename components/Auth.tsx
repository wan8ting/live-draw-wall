import React, { useState, useEffect, useRef } from 'react';
import { GoogleIcon } from './Icons';
import type { Wall } from '../types';

interface AuthProps {
  user: { name: string; avatar: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  walls: Wall[];
}

export const Auth: React.FC<AuthProps> = ({ user, onLogin, onLogout, walls }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button 
        onClick={onLogin}
        className="flex items-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black shadow-brutalist-sm shadow-brutalist-sm-hover transition-all"
      >
        <GoogleIcon />
        <span className="hidden sm:inline">使用 Google 登入</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
        <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-black bg-white" />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border-4 border-black rounded-lg shadow-brutalist z-10">
          <div className="p-4 border-b-4 border-black">
            <p className="font-bold text-lg truncate">Welcome, {user.name}!</p>
          </div>
          <div className="p-2">
            <p className="px-2 pb-1 font-bold">我的塗鴉牆</p>
            <div className="max-h-48 overflow-y-auto">
              {walls.length > 0 ? (
                walls.map(wall => (
                  <a 
                    key={wall.id}
                    href={`/#/wall/${wall.id}`} 
                    className="block w-full text-left px-2 py-1.5 text-black hover:bg-yellow-300 rounded-md truncate"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {wall.name}
                  </a>
                ))
              ) : (
                <p className="px-2 py-1.5 text-gray-500 text-sm">尚未建立任何塗鴉牆</p>
              )}
            </div>
          </div>
          <div className="p-2 border-t-2 border-black">
            <button
              onClick={() => {
                onLogout();
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-black hover:bg-yellow-300 rounded-md font-bold"
            >
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
