import React from 'react';
import { Store } from '../types/closing';
import { FileSpreadsheet, Plus, Store as StoreIcon, ChevronDown, Download } from 'lucide-react';

interface HeaderProps {
  stores: Store[];
  activeStoreId: string | null;
  onSelectStore: (id: string) => void;
  onOpenNewStoreModal: () => void;
  onExportAllExcel: () => void;
  onExportCurrentStoreExcel: () => void;
  onOpenStoreSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stores,
  activeStoreId,
  onSelectStore,
  onOpenNewStoreModal,
  onExportAllExcel,
  onExportCurrentStoreExcel,
  onOpenStoreSettings,
}) => {
  const activeStore = stores.find((s) => s.id === activeStoreId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <StoreIcon className="w-4 h-4" />
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>ÓticaFolha</span>
              <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.2">
                Folha & Comissões
              </span>
            </a>
          </div>

          {/* Zone 2: Store Selector and Context Switching */}
          <div className="flex items-center gap-2">
            {stores.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 hidden sm:inline">Loja:</span>
                <div className="relative inline-block">
                  <select
                    value={activeStoreId || ''}
                    onChange={(e) => onSelectStore(e.target.value)}
                    className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.sellers.length} {s.sellers.length === 1 ? 'vendedor' : 'vendedores'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={onOpenStoreSettings}
                  title="Configurações da Loja Selecionada"
                  className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Editar Loja
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenNewStoreModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>Nova Loja</span>
            </button>
          </div>

          {/* Zone 3: Primary Action - Export to Excel */}
          <div className="flex items-center gap-2 shrink-0">
            {stores.length > 1 && (
              <button
                type="button"
                onClick={onExportCurrentStoreExcel}
                title="Exportar apenas a planilha desta loja atual"
                disabled={!activeStore}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Esta Loja</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportAllExcel}
              disabled={stores.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>Exportar Fechamento para Excel</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
