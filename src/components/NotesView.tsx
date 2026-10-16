import { useState, useEffect } from 'react';
import { Trash2, Edit2, BookOpen, Calendar, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/database.types';
import toast, { Toaster } from 'react-hot-toast';

type Anotacao = Database['public']['Tables']['anotacoes']['Row'] & {
  livros: {
    livro: string;
    abbrev: string;
  };
};

export function NotesView() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) carregarAnotacoes();
  }, [user]);

  const carregarAnotacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('anotacoes')
        .select(`*, livros (livro, abbrev)`)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnotacoes(data || []);
    } catch (error) {
      toast.error('Falha ao sincronizar notas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('anotacoes').delete().eq('id', id);
      if (error) throw error;

      setAnotacoes(anotacoes.filter(a => a.id !== id));
      toast.success('Anotação removida', {
        icon: '🗑️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } catch (error) {
      toast.error('Erro ao excluir');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      const { error } = await supabase
        .from('anotacoes')
        .update({ texto_da_nota: editText.trim() })
        .eq('id', id);

      if (error) throw error;

      setAnotacoes(anotacoes.map(a => 
        a.id === id ? { ...a, texto_da_nota: editText.trim() } : a
      ));
      setEditingId(null);
      toast.success('Nota atualizada!');
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Organizando seus estudos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <Toaster position="bottom-right" />
      
      {/* Header Profissional */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Meu Diário <span className="text-amber-500">Espiritual</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Reflexões e estudos acumulados na sua jornada.</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800/50">
          <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">
            {anotacoes.length} {anotacoes.length === 1 ? 'Registro' : 'Registros'}
          </span>
        </div>
      </header>

      {anotacoes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">O silêncio é uma tela em branco</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Suas anotações aparecerão aqui assim que você começar a marcar versículos na Bíblia.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {anotacoes.map((anotacao) => (
            <div
              key={anotacao.id}
              className="group bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider shadow-lg shadow-amber-500/20 uppercase">
                    {anotacao.livros.livro} {anotacao.capitulo}:{anotacao.versiculo}
                  </div>
                  <div className="hidden sm:flex items-center text-slate-400 text-xs space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(anotacao.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {editingId === anotacao.id ? (
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(anotacao.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-xs font-bold transition-colors">Salvar</button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1 rounded-lg text-xs font-bold transition-colors">Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(anotacao.id); setEditText(anotacao.texto_da_nota); }} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(anotacao.id)} className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === anotacao.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-amber-500/20 rounded-2xl focus:border-amber-500 outline-none text-slate-800 dark:text-slate-200 font-serif leading-relaxed resize-none transition-all"
                  rows={4}
                  autoFocus
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 text-lg font-serif leading-[1.8] italic border-l-4 border-amber-500/10 pl-4">
                  "{anotacao.texto_da_nota}"
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="w-3 h-3 mr-2" />
                Última atualização: {new Date(anotacao.updated_at || anotacao.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">Excluir Nota?</h3>
            <p className="text-slate-500 text-center mb-8">Esta ação é permanente e não poderá ser desfeita.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-3 rounded-2xl font-bold bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}