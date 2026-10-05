import React, { useState } from 'react';
import { Store, ExportDeviceMode } from '../types/closing';
import {
  FileSpreadsheet,
  Plus,
  Store as StoreIcon,
  ChevronDown,
  Smartphone,
  Monitor,
  Check,
  Home,
} from 'lucide-react';

interface HeaderProps {
  stores: Store[];
  activeStoreId: string | null;
  deviceMode: ExportDeviceMode;
  isHomeScreen?: boolean;
  onNavigateHome?: () => void;
  onChangeDeviceMode: (mode: ExportDeviceMode) => void;
  onSelectStore: (id: string) => void;
  onOpenNewStoreModal: () => void;
  onExportAllExcel: (mode?: ExportDeviceMode) => void;
  onExportCurrentStoreExcel: (mode?: ExportDeviceMode) => void;
  onOpenStoreSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stores,
  activeStoreId,
  deviceMode,
  isHomeScreen = false,
  onNavigateHome,
  onChangeDeviceMode,
  onSelectStore,
  onOpenNewStoreModal,
  onExportAllExcel,
  onExportCurrentStoreExcel,
  onOpenStoreSettings,
}) => {
  const activeStore = stores.find((s) => s.id === activeStoreId);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportWithFeedback = (mode?: ExportDeviceMode) => {
    setIsExporting(true);
    onExportAllExcel(mode);
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/85 backdrop-blur-md border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark (Linear Style) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateHome}
              title="Voltar para a tela inicial / Criar Loja"
              className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                <StoreIcon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 font-bold group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300">
                  FechaFolha
                </span>
                <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5">
                  PRO
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation, Store Selector and Context Switching */}
          <div className="flex items-center gap-2">
            {/* Botão de Tela Inicial (Criar Loja) */}
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                title="Voltar para a tela inicial (aba de cadastrar loja)"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
                  isHomeScreen
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Início (Criar Loja)</span>
              </button>
            )}

            {stores.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">Unidade:</span>
                <div className="relative inline-block">
                  <select
                    value={!isHomeScreen && activeStoreId ? activeStoreId : ''}
                    onChange={(e) => onSelectStore(e.target.value)}
                    className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-lg border border-white/[0.08] hover:border-white/[0.16] cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
                  >
                    {isHomeScreen && <option value="" disabled className="bg-[#0D0F17] text-slate-400">Selecione uma loja...</option>}
                    {stores.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0D0F17] text-slate-200">
                        {s.name} ({s.sellers.length} {s.sellers.length === 1 ? 'vendedor' : 'vendedores'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={onOpenStoreSettings}
                  title="Configurações da Loja Selecionada"
                  className="px-2.5 py-2 text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors rounded-lg whitespace-nowrap cursor-pointer hover:-translate-y-0.5"
                >
                  Editar Loja
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenNewStoreModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors rounded-lg whitespace-nowrap cursor-pointer hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nova Loja</span>
            </button>
          </div>

          {/* Zone 3: Primary Actions - Export to Excel with Mobile/Desktop Selector */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Export for Current Active Store */}
            {activeStore && (
              <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5">
                  Esta Loja:
                </span>
                <button
                  type="button"
                  onClick={() => onExportCurrentStoreExcel('mobile')}
                  title={`Exportar planilha compacta de ${activeStore.name} para celular`}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-emerald-300 rounded transition-colors cursor-pointer hover:-translate-y-0.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Celular</span>
                </button>
                <button
                  type="button"
                  onClick={() => onExportCurrentStoreExcel('desktop')}
                  title={`Exportar planilha completa de ${activeStore.name} para computador`}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-cyan-300 rounded transition-colors cursor-pointer hover:-translate-y-0.5"
                >
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Desktop</span>
                </button>
              </div>
            )}

            {/* Global Device Mode Switcher */}
            <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => onChangeDeviceMode('mobile')}
                title="Modo Celular: planilha compacta sem rolagem lateral, ideal para WhatsApp e celular"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Celular</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeDeviceMode('desktop')}
                title="Modo Desktop: formato tradicional horizontal completo para computador"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* Primary Action Button: Export Rede */}
            <button
              type="button"
              onClick={() => handleExportWithFeedback(deviceMode)}
              disabled={stores.length === 0}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:translate-y-0 ${
                isExporting ? 'scale-95 ring-2 ring-emerald-400' : ''
              }`}
            >
              {isExporting ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 animate-bounce" />
                  <span>Gerando Planilha...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-slate-950" />
                  <span>
                    Exportar Rede ({deviceMode === 'mobile' ? 'Celular' : 'Desktop'})
                  </span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

