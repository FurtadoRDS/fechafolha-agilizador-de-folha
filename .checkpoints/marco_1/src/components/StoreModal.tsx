import React, { useState, useEffect } from 'react';
import { X, Store as StoreIcon, AlertCircle } from 'lucide-react';
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
    onSave(name.trim(), salesNum, period.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {storeToEdit ? 'Editar Loja' : 'Cadastrar Nova Loja'}
              </h3>
              <p className="text-xs text-slate-500">
                {storeToEdit ? 'Atualize os dados e metas da unidade' : 'Insira a unidade da rede para o fechamento'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome da Loja <span className="text-red-500">*</span>
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
              placeholder="Ex: Ótica Centro - Matriz, Loja Shopping..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Total de Vendas da Loja (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={totalSales}
                onChange={(e) => setTotalSales(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Faturamento bruto total registrado por esta loja no mês.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mês / Período de Referência (Opcional)
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Ex: Outubro / 2026"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {storeToEdit && onDelete && (
            <div className="pt-2 border-t border-slate-100">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                >
                  Excluir esta loja permanentemente
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <p className="text-xs text-red-700 font-medium">
                    Tem certeza? Todos os {storeToEdit.sellers.length} vendedores desta loja serão removidos.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(storeToEdit.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      Confirmar Exclusão
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              {storeToEdit ? 'Salvar Alterações' : 'Cadastrar Loja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
