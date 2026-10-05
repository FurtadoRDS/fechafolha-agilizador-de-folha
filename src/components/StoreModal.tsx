import React, { useState, useEffect } from 'react';
import { X, Store as StoreIcon, AlertCircle, Check } from 'lucide-react';
import { Store } from '../types/closing';
import { parseNumberInput } from '../utils/formatters';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, totalSales: number, period?: string) => void;
  onDelete?: (storeId: string) => void;
  storeToEdit?: Store | null;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  storeToEdit,
}) => {
  const [name, setName] = useState('');
  const [totalSales, setTotalSales] = useState('');
  const [period, setPeriod] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  useEffect(() => {
    if (storeToEdit) {
      setName(storeToEdit.name);
      setTotalSales(storeToEdit.totalSales ? String(storeToEdit.totalSales) : '');
      setPeriod(storeToEdit.period || '');
    } else {
      setName('');
      setTotalSales('');
      setPeriod('');
    }
    setError('');
    setShowDeleteConfirm(false);
  }, [storeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da loja.');
      return;
    }

    const salesNum = parseNumberInput(totalSales);
    setIsSavedFeedback(true);
    setTimeout(() => {
      onSave(name.trim(), salesNum, period.trim());
      setIsSavedFeedback(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative rounded-2xl bg-[#0D0F17] shadow-2xl border border-white/10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top ambient highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/6 bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer">
                {storeToEdit ? 'Configurações da Loja' : 'Cadastrar Nova Loja'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {storeToEdit ? 'Atualize as metas e informações' : 'Adicione a unidade para o fechamento'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/6 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Nome da Loja <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Matriz Centro, Loja Shopping, Filial 1..."
              className="w-full px-3.5 py-2.5 text-sm bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/14 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Total de Vendas da Loja (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={totalSales}
                onChange={(e) => setTotalSales(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/14 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Faturamento bruto total registrado por esta loja no mês.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Mês / Período de Referência (Opcional)
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Ex: Outubro / 2026"
              className="w-full px-3.5 py-2.5 text-sm bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/14 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {storeToEdit && onDelete && (
            <div className="pt-2 border-t border-white/6">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Excluir esta loja permanentemente...
                </button>
              ) : (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                  <p className="text-xs text-rose-300 font-medium">
                    Tem certeza? Todos os {storeToEdit.sellers.length} vendedores desta loja serão removidos.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(storeToEdit.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
                    >
                      Confirmar Exclusão
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 bg-white/5 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
                isSavedFeedback
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                  : 'text-slate-950 bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:translate-y-0'
              }`}
            >
              {isSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>{storeToEdit ? 'Salvar Alterações' : 'Cadastrar Loja'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
