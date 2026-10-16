import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/database.types';

type Livro = Database['public']['Tables']['livros']['Row'];
type Versiculo = Database['public']['Tables']['versiculos']['Row'];

interface NoteModalProps {
  versiculo: Versiculo;
  livro: Livro;
  onClose: () => void;
}

export function NoteModal({ versiculo, livro, onClose }: NoteModalProps) {
  const [nota, setNota] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user || !nota.trim()) return;

    try {
      setSaving(true);
      setError('');

      const { error: saveError } = await supabase
        .from('anotacoes')
        .insert({
          user_id: user.id,
          id_livro: livro.id,
          capitulo: versiculo.capitulo,
          versiculo: versiculo.versiculo,
          texto_da_nota: nota.trim(),
        });

      if (saveError) throw saveError;

      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar anotação');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Adicionar Anotação
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-400 mb-2">
              {livro.livro} {versiculo.capitulo}:{versiculo.versiculo}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {versiculo.texto}
            </p>
          </div>

          <div>
            <label htmlFor="nota" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sua Anotação
            </label>
            <textarea
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
              placeholder="Escreva suas reflexões sobre este versículo..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !nota.trim()}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
