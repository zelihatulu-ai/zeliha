import { Chat } from '@/components/chat';

export default function Page() {
  return (
    <div className="h-screen w-full bg-[#F5F2ED] flex flex-col overflow-hidden text-[#1A1A1A]">
      <header className="border-b border-[#1A1A1A]/20 p-4 sm:p-8 flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-0 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] font-sans opacity-60">Tarih Serisi: Bölüm I</span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter leading-none mt-2 font-serif uppercase">ATATÜRK İLE RÖPORTAJ</h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm italic font-sans">Millî Mücadele ve Bağımsızlık Yolu</p>
          <p className="text-xs font-sans opacity-40 mt-1">Samsun, 19 Mayıs 1919</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        <aside className="hidden lg:block col-span-3 border-r border-[#1A1A1A]/10 p-8 bg-[#EFEBE5] overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-[#1A1A1A] pb-2 mb-4">KRONOLOJİ</h3>
              <ul className="text-[13px] space-y-4 font-sans leading-relaxed">
                <li><strong className="block">19 Mayıs 1919</strong> Samsun'a çıkış ve bağımsızlık meşalesinin yakılması.</li>
                <li><strong className="block">22 Haziran 1919</strong> Amasya Genelgesi: "Vatanın bütünlüğü tehlikededir."</li>
                <li><strong className="block">23 Temmuz 1919</strong> Erzurum Kongresi'nin toplanması.</li>
              </ul>
            </div>
            <div className="pt-8">
              <div className="aspect-[3/4] border border-[#1A1A1A]/20 p-2">
                <div className="w-full h-full bg-[#D9D4CD] flex items-center justify-center grayscale contrast-125">
                  <span className="text-[10px] uppercase opacity-40 text-center px-2">Arşiv Fotoğrafı: Bandırma</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 flex flex-col p-4 sm:p-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] overflow-hidden">
          <Chat />
        </section>
      </main>
    </div>
  );
}
