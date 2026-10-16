import { ReactNode } from 'react';
import { BookOpen, BookMarked, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentView: 'reading' | 'notes';
  onViewChange: (view: 'reading' | 'notes') => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300">
      {/* Header com Glassmorphism */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback caso a imagem não carregue
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-amber-500');
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                Bíblia <span className="text-amber-500">Sagrada</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">PWA Digital</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-90"
              title="Alternar tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => signOut()}
              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-all active:scale-90"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 container mx-auto px-4 py-6 mb-20">
        {children}
      </main>

      {/* Navegação Inferior Dock-style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] flex justify-around p-2">
            <button
              onClick={() => onViewChange('reading')}
              className={`flex-1 py-3 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                currentView === 'reading'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className={`w-6 h-6 transition-transform ${currentView === 'reading' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">Leitura</span>
            </button>

            <button
              onClick={() => onViewChange('notes')}
              className={`flex-1 py-3 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                currentView === 'notes'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookMarked className={`w-6 h-6 transition-transform ${currentView === 'notes' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">Anotações</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}