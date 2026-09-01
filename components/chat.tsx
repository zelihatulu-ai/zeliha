'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Merhaba çocuk. Ben Mustafa Kemal. Bana Kurtuluş Savaşımız, yani 1919 ile 1923 yılları arasında verdiğimiz o büyük mücadele hakkında ne sormak istersin?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // API mesaj formatını hazırla (Gemini API formatına uygun parts dizisi)
      const apiMessages = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }]
      })).concat({ role: 'user', parts: [{ text: userMessage }] });

      // İstemci tarafında hiçbir AI SDK'sı veya gizli anahtar kullanılmaz
      // Sadece sunucu tarafındaki /api/chat uç noktasına istek atılır
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sunucudan geçersiz yanıt alındı.');
      }

      setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
    } catch (error: unknown) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bağlantıda bir sorun oluştu.';
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'model', 
          content: `⚠️ **Hata:** ${errorMessage}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-8 pb-4 pr-2">
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'model' ? (
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center text-[#F5F2ED] font-bold text-lg sm:text-xl italic">MK</div>
                <div className="max-w-[85%] sm:max-w-[80%]">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest font-sans opacity-50 mb-2">Mustafa Kemal Atatürk</p>
                  <div className="text-lg sm:text-2xl leading-snug italic font-medium prose prose-stone prose-p:leading-snug prose-headings:font-serif prose-a:text-[#8B0000] max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 sm:gap-6 justify-end text-right">
                <div className="max-w-[85%] sm:max-w-[70%]">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest font-sans opacity-50 mb-2">Öğrenci</p>
                  <div className="bg-[#1A1A1A]/5 p-3 sm:p-4 rounded-sm border border-[#1A1A1A]/10">
                    <p className="font-sans text-sm sm:text-base leading-relaxed">{message.content}</p>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 border-2 border-[#1A1A1A] flex items-center justify-center font-sans font-bold text-[10px] sm:text-xs">
                  S-{index.toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center text-[#F5F2ED] font-bold text-lg sm:text-xl italic">MK</div>
            <div className="max-w-[80%]">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest font-sans opacity-50 mb-2">Mustafa Kemal Atatürk</p>
              <div className="flex items-center gap-3 text-[#1A1A1A]/50 py-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm italic font-medium animate-pulse">Atatürk düşünüyor...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="mt-auto pt-6 sm:pt-8 shrink-0 pb-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1A1A]/10 to-[#1A1A1A]/5 blur opacity-20"></div>
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center border border-[#1A1A1A] bg-[#F5F2ED] px-3 sm:px-4 py-2 sm:py-3 gap-3 sm:gap-0">
            <span className="text-xs font-sans opacity-40 mr-4 whitespace-nowrap hidden sm:inline">SORU SORUN:</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="İstiklal Mücadelesi hakkında merak ettiklerinizi buraya yazın..."
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none font-sans italic text-sm placeholder:opacity-40 min-h-[40px] sm:min-h-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="sm:ml-4 px-6 py-3 sm:py-1.5 bg-[#1A1A1A] text-[#F5F2ED] text-xs uppercase tracking-widest font-sans hover:bg-[#333] disabled:opacity-50 transition-colors w-full sm:w-auto text-center"
            >
              Gönder
            </button>
          </form>
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-sans opacity-40 uppercase tracking-[0.2em] sm:tracking-[0.3em] px-1">
          <span className="truncate pr-2">Eğitim Materyali: Kurtuluş Savaşı Tarihi</span>
          <span className="shrink-0">Sayfa 01/24</span>
        </div>
      </footer>
    </div>
  );
}
