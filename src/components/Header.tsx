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
  Edit2,
  Home
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
  onExportAllExcel: (mode?: ExportDeviceMode) => void; // Mantido na interface para não quebrar o App.tsx
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
  onExportCurrentStoreExcel,
  onOpenStoreSettings,
}) => {
  const activeStore = stores.find((s) => s.id === activeStoreId);
  const [isExportingCurrent, setIsExportingCurrent] = useState(false);

  const handleExportCurrentWithFeedback = (mode: ExportDeviceMode) => {
    if (!onExportCurrentStoreExcel) return;
    setIsExportingCurrent(true);
    onExportCurrentStoreExcel(mode);
    setTimeout(() => setIsExportingCurrent(false), 1000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/70 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zona 1: Logo & Navegação Principal */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Logo */}
            <button
              type="button"
              onClick={onNavigateHome}
              title="Ir para o Início"
              className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-emerald-400 shadow-sm group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-300">
                <StoreIcon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-300">
                  FechaFolha
                </span>
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5">
                  PRO
                </span>
              </div>
            </button>

            {/* Divisor subtil */}
            {stores.length > 0 && (
              <div className="hidden md:block w-px h-5 bg-white/10"></div>
            )}

            {/* Ações Rápidas de Navegação */}
            {stores.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {onNavigateHome && (
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isHomeScreen
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Início"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenNewStoreModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors rounded-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Loja</span>
                </button>
              </div>
            )}
          </div>

          {/* Zona 2: Contexto da Loja Atual (Centro) */}
          {!isHomeScreen && stores.length > 0 && activeStore && (
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl p-1 shadow-sm">
                <div className="relative">
                  <select
                    value={activeStoreId || ''}
                    onChange={(e) => onSelectStore(e.target.value)}
                    className="appearance-none bg-transparent text-slate-200 text-xs font-semibold py-1.5 pl-3 pr-8 cursor-pointer focus:outline-none transition-all"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0D0F17] text-slate-200">
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button
                  type="button"
                  onClick={onOpenStoreSettings}
                  title="Editar Loja"
                  className="p-1.5 px-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Editar</span>
                </button>
              </div>
            </div>
          )}

          {/* Zona 3: Ações Globais e Exportação (Direita) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Seletor de Modo Celular/Desktop */}
            <div className="flex items-center bg-white/[0.03] p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => onChangeDeviceMode('mobile')}
                title="Modo Celular: ideal para WhatsApp"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Celular</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeDeviceMode('desktop')}
                title="Modo Desktop: formato expandido"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* Botão Principal de Exportação SOMENTE da Loja Atual */}
            {!isHomeScreen && activeStore && (
              <button
                type="button"
                onClick={() => handleExportCurrentWithFeedback(deviceMode)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(52,211,153,0.3)] active:translate-y-0 ${
                  isExportingCurrent ? 'scale-95' : ''
                }`}
              >
                {isExportingCurrent ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950 animate-bounce" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 text-slate-950" />
                    <span className="hidden sm:inline">Exportar Loja</span>
                    <span className="sm:hidden">Exportar</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};