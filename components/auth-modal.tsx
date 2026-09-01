'use client';

import { useState } from 'react';
import { X, Loader2, User as UserIcon, Lock, Mail } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; name?: string | null }) => void;
};

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = tab === 'login' ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'İşlem gerçekleştirilemedi.');
      }

      onSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-[#F5F2ED] border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-2xl">
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık ve Sekmeler */}
        <div className="mb-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans opacity-50 block mb-1">
            MİLLÎ MÜCADELE ARŞİVİ
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight text-[#1A1A1A]">
            {tab === 'login' ? 'Öğrenci Girişi' : 'Yeni Kayıt'}
          </h2>
        </div>

        {/* Tab Değiştirici */}
        <div className="flex border border-[#1A1A1A] mb-6 p-0.5 bg-[#EFEBE5]">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-all ${
              tab === 'login'
                ? 'bg-[#1A1A1A] text-[#F5F2ED]'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-all ${
              tab === 'register'
                ? 'bg-[#1A1A1A] text-[#F5F2ED]'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            Hesap Oluştur
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/10 border border-red-800 text-red-900 text-xs font-sans">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-sans opacity-60 mb-1">
                Ad Soyad
              </label>
              <div className="relative flex items-center border border-[#1A1A1A] bg-white/70">
                <UserIcon className="w-4 h-4 ml-3 opacity-40 text-[#1A1A1A]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn. Zeliha Tulu"
                  className="w-full px-3 py-2.5 text-sm font-sans bg-transparent outline-none text-[#1A1A1A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-sans opacity-60 mb-1">
              E-Posta Adresi
            </label>
            <div className="relative flex items-center border border-[#1A1A1A] bg-white/70">
              <Mail className="w-4 h-4 ml-3 opacity-40 text-[#1A1A1A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ogrenci@okul.edu.tr"
                className="w-full px-3 py-2.5 text-sm font-sans bg-transparent outline-none text-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-sans opacity-60 mb-1">
              Şifre
            </label>
            <div className="relative flex items-center border border-[#1A1A1A] bg-white/70">
              <Lock className="w-4 h-4 ml-3 opacity-40 text-[#1A1A1A]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full px-3 py-2.5 text-sm font-sans bg-transparent outline-none text-[#1A1A1A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1A1A1A] text-[#F5F2ED] font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {tab === 'login' ? 'Giriş Yap' : 'Kaydı Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
}
