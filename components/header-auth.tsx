'use client';

import { useState, useEffect } from 'react';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { AuthModal } from '@/components/auth-modal';

type UserData = {
  id: string;
  email: string;
  name?: string | null;
};

export function HeaderAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error('Auth check error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs font-sans opacity-40">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A1A1A]/5 border border-[#1A1A1A]/20 px-3 py-1.5 rounded-sm">
              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center text-[10px] font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-sans font-medium text-[#1A1A1A] truncate max-w-[140px]">
                {user.name || user.email.split('@')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Çıkış Yap"
              className="px-3 py-1.5 border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#1A1A1A] text-[#F5F2ED] text-xs font-sans uppercase tracking-widest font-bold hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Giriş / Kayıt</span>
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </>
  );
}
