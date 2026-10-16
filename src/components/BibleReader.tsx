import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, BookOpen, Hash, Search, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { NoteModal } from './NoteModal';

type Livro = Database['public']['Tables']['livros']['Row'];
type Versiculo = Database['public']['Tables']['versiculos']['Row'];

export function BibleReader() {
  // Estados de Dados
  const [livros, setLivros] = useState<Livro[]>([]);
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  
  // Estados de Seleção
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState<number>(1);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState<Versiculo | null>(null);
  
  // Estados de Interface
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carregar lista de livros ao montar o componente
  useEffect(() => {
    carregarLivros();
  }, []);

  // Carregar versículos sempre que o livro ou capítulo mudar
  useEffect(() => {
    if (livroSelecionado) {
      carregarVersiculos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [livroSelecionado, capituloSelecionado]);

  async function carregarLivros() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .order('id');
      if (error) throw error;
      setLivros(data || []);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    } finally {
      setLoading(false);
    }
  }

  async function carregarVersiculos() {
    if (!livroSelecionado) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('versiculos')
        .select('*')
        .eq('id_livro', livroSelecionado.id)
        .eq('capitulo', capituloSelecionado)
        .order('versiculo');
      if (error) throw error;
      setVersiculos(data || []);
    } catch (error) {
      console.error('Erro ao buscar versículos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleVersiculoClick = (v: Versiculo) => {
    setVersiculoSelecionado(v);
    setModalOpen(true);
  };

  // --- VIEW: LOADING INICIAL ---
  if (loading && livros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Abrindo as Escrituras...</p>
      </div>
    );
  }

  // --- VIEW: SELEÇÃO DE LIVROS ---
  if (!livroSelecionado) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Biblioteca <span className="text-amber-500">Bíblica</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Escolha um livro para estudar agora.</p>
        </header>

        <div className="grid gap-12">
          {[
            { id: 'VT', label: 'Velho Testamento' },
            { id: 'NT', label: 'Novo Testamento' }
          ].map((secao) => {
            const livrosFiltrados = livros.filter(l => l.testamento === secao.id);
            if (livrosFiltrados.length === 0) return null;

            return (
              <section key={secao.id}>
                <div className="flex items-center space-x-4 mb-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 whitespace-nowrap">
                    {secao.label}
                  </h3>
                  <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {livrosFiltrados.map((livro) => (
                    <button
                      key={livro.id}
                      onClick={() => { setLivroSelecionado(livro); setCapituloSelecionado(1); }}
                      className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 text-left"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                          <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{livro.grupo}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-amber-600 transition-colors">
                        {livro.livro}
                      </h4>
                      <div className="flex items-center mt-1 text-sm text-slate-500">
                        <Hash className="w-3 h-3 mr-1 opacity-50" />
                        {livro.capitulos} capítulos
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VIEW: LEITURA DO CAPÍTULO ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Navegação Superior Fixa */}
      <nav className="sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 py-4">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setLivroSelecionado(null)}
            className="flex items-center text-slate-500 hover:text-amber-600 font-semibold transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Biblioteca</span>
          </button>
          
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
              {livroSelecionado.livro}
            </h2>
            <div className="flex items-center justify-end text-amber-600 font-bold text-sm">
              <Bookmark className="w-3 h-3 mr-1 fill-current" />
              Capítulo {capituloSelecionado}
            </div>
          </div>
        </div>

        {/* Seletor de Capítulos de Acesso Rápido */}
        <div 
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: livroSelecionado.capitulos }, (_, i) => i + 1).map((cap) => (
            <button
              key={cap}
              onClick={() => setCapituloSelecionado(cap)}
              className={`flex-shrink-0 min-w-[46px] h-[46px] rounded-xl font-black text-sm transition-all duration-300 ${
                capituloSelecionado === cap
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </nav>

      {/* Área do Texto Bíblico */}
      <main className="mt-10 pb-32">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-8" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {versiculos.map((v) => (
              <div
                key={v.id}
                onClick={() => handleVersiculoClick(v)}
                className="group relative flex items-start space-x-4 p-4 -mx-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:shadow-sm"
              >
                <span className="flex-shrink-0 w-6 pt-1.5 text-right text-xs font-black text-amber-500/40 group-hover:text-amber-500 transition-colors">
                  {v.versiculo}
                </span>
                <p className="flex-1 text-slate-800 dark:text-slate-200 text-[1.15rem] leading-[1.85] font-serif font-medium antialiased">
                  {v.texto}
                </p>
                <div className="opacity-0 group-hover:opacity-100 self-center transition-all translate-x-2 group-hover:translate-x-0">
                  <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Anotações */}
      {modalOpen && versiculoSelecionado && livroSelecionado && (
        <NoteModal
          versiculo={versiculoSelecionado}
          livro={livroSelecionado}
          onClose={() => {
            setModalOpen(false);
            setVersiculoSelecionado(null);
          }}
        />
      )}
    </div>
  );
}