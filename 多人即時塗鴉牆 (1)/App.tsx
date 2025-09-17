import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { AIPromptGenerator } from './components/AIPromptGenerator';
import { Auth } from './components/Auth';
import { NameWallModal } from './components/NameWallModal';
import { Toast } from './components/Toast';
import { ShareIcon } from './components/Icons';
import type { DrawOptions, Wall } from './types';

function App() {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [currentWallId, setCurrentWallId] = useState<string | null>(null);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawOptions, setDrawOptions] = useState<DrawOptions>({
    color: '#000000',
    lineWidth: 5,
    isErasing: false,
    brushType: 'pencil',
  });

  // Load walls from localStorage on initial render
  useEffect(() => {
    try {
      const savedWalls = localStorage.getItem('live-draws-walls');
      if (savedWalls) {
        setWalls(JSON.parse(savedWalls));
      }
    } catch (error) {
      console.error("Failed to load walls from localStorage:", error);
    }
  }, []);

  // Sync walls to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('live-draws-walls', JSON.stringify(walls));
    } catch (error) {
      console.error("Failed to save walls to localStorage:", error);
    }
  }, [walls]);
  
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;
    const wallIdMatch = hash.match(/^#\/wall\/([a-zA-Z0-9_-]+)/);
    if (wallIdMatch) {
      setCurrentWallId(wallIdMatch[1]);
    } else {
      setCurrentWallId(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);

  const handleLogin = () => setUser({ name: 'Tina', avatar: `https://api.multiavatar.com/Tina.svg` });
  const handleLogout = () => setUser(null);
  
  const navigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  const handleCreateWall = (wallName: string) => {
    if (!wallName.trim()) return;
    const newWall: Wall = {
      id: `wall_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: wallName.trim(),
    };
    setWalls(prev => [...prev, newWall]);
    window.location.hash = `#/wall/${newWall.id}`;
    setIsNameModalOpen(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast("分享連結已複製！");
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
      showToast("複製失敗！");
    });
  };
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const currentWall = walls.find(w => w.id === currentWallId);

  const renderHomePage = () => (
    <div className="min-h-screen w-full flex flex-col bg-vibrant-gradient">
       <header className="w-full p-4 bg-black flex justify-between items-center h-[72px]">
        <a href="#" onClick={navigateHome} className="text-white text-2xl font-bold">Live Draws</a>
        <Auth user={user} onLogin={handleLogin} onLogout={handleLogout} walls={walls} />
      </header>
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl md:text-7xl font-bold text-black">最即時的線上共同塗鴉牆</h1>
          <p className="text-xl md:text-2xl text-black max-w-2xl">邀請別人一起創作的最佳選擇</p>
          {user ? (
             <button onClick={() => setIsNameModalOpen(true)} className="bg-orange-500 text-black border-4 border-black font-bold py-4 px-8 text-2xl rounded-lg shadow-brutalist shadow-brutalist-hover transition-all transform hover:scale-105">
                建立塗鴉牆
              </button>
          ) : (
            <div className="bg-pink-300 text-black border-4 border-black p-4 rounded-lg shadow-brutalist">
              <p className="font-bold">請先登入以建立塗鴉牆！</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  const renderCanvasPage = () => (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center p-2 sm:p-4 font-mono overflow-hidden">
      <header className="w-full max-w-7xl flex justify-between items-center mb-4 h-[56px]">
        <a href="#" onClick={navigateHome} className="text-black text-2xl font-bold">Live Draws</a>
        <div className="text-black text-lg font-bold sm:text-xl truncate">{currentWall?.name || '未命名塗鴉牆'}</div>
        <div className="flex items-center gap-4">
          <AIPromptGenerator onPromptGenerated={showToast} />
          <button onClick={handleShare} className="p-2 bg-white border-2 border-black rounded-md shadow-brutalist-sm shadow-brutalist-sm-hover" title="分享">
             <ShareIcon />
          </button>
          <Auth user={user} onLogin={handleLogin} onLogout={handleLogout} walls={walls} />
        </div>
      </header>
      <main className="relative w-full flex-1 max-w-7xl flex flex-col items-center">
        <Canvas ref={canvasRef} drawOptions={drawOptions} />
      </main>
      <footer className="w-full flex justify-center mt-4">
        <Toolbar canvasRef={canvasRef} drawOptions={drawOptions} setDrawOptions={setDrawOptions} />
      </footer>
    </div>
  );

  return (
    <>
      {currentWallId ? renderCanvasPage() : renderHomePage()}
      <NameWallModal 
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onCreate={handleCreateWall}
      />
      <Toast message={toastMessage} isVisible={!!toastMessage} />
    </>
  );
}

export default App;