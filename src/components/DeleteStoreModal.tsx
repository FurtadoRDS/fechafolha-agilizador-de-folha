import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Store } from '../types/closing';
import { formatBRL } from '../utils/formatters';

interface DeleteStoreModalProps {
  isOpen: boolean;
  store: Store | null;
  onClose: () => void;
  onConfirmDelete: (storeId: string) => void;
}

export const DeleteStoreModal: React.FC<DeleteStoreModalProps> = ({
  isOpen,
  store,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !store) return null;

  const sellersCount = store.sellers?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative rounded-2xl bg-[#0D0F17] shadow-2xl border border-white/10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top ambient highlight (Rose/Danger glow) */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-rose-500/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/6 bg-white/2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Excluir Loja
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Esta ação é irreversível
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

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2.5">
            <div className="flex items-start gap-2.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">
                Você tem certeza que deseja apagar permanentemente a loja <span className="text-white underline font-bold">{store.name}</span>?
              </p>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-relaxed font-mono">
              Todos os dados vinculados a esta unidade, incluindo as vendas ({formatBRL(store.totalSales)}) e os {sellersCount} {sellersCount === 1 ? 'funcionário cadastrado' : 'funcionários cadastrados'}, serão excluídos do navegador.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-white/2 border border-white/6 rounded-xl p-3 flex items-center justify-between">
            <span>Vendas registradas:</span>
            <span className="text-white font-bold tabular-nums">{formatBRL(store.totalSales)}</span>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-white/2 border border-white/6 rounded-xl p-3 flex items-center justify-between">
            <span>Equipe cadastrada:</span>
            <span className="text-white font-bold">{sellersCount} {sellersCount === 1 ? 'colaborador' : 'colaboradores'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDelete(store.id);
                onClose();
              }}
              className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-linear-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sim, Excluir Loja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
