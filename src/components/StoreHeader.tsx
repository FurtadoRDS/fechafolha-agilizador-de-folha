import React, { useState } from 'react';
import { Store, ExportDeviceMode } from '../types/closing';
import { formatBRL, formatPercent } from '../utils/formatters';
import { Edit2, TrendingUp, DollarSign, Wallet, Percent, Smartphone, Monitor, Check, Trash2, Home } from 'lucide-react';

interface StoreHeaderProps {
  store: Store;
  onEditStore: () => void;
  onDeleteStore?: () => void;
  onNavigateHome?: () => void;
  onExportStoreExcel?: (mode: ExportDeviceMode) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  store,
  onEditStore,
  onDeleteStore,
  onNavigateHome,
  onExportStoreExcel,
}) => {
  const sellers = store.sellers || [];
  const [downloadingMode, setDownloadingMode] = useState<ExportDeviceMode | null>(null);

  const sellersCount = sellers.length;
  const grossTeamSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
  const totalBaseSalaries = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
  const totalCommissions = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
  const totalPayrollToPay = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0); // Salário Base + Comissões

  const salesCoveragePercent =
    store.totalSales > 0 ? (grossTeamSales / store.totalSales) * 100 : 0;

  const handleExportWithFeedback = (mode: ExportDeviceMode) => {
    if (!onExportStoreExcel) return;
    setDownloadingMode(mode);
    onExportStoreExcel(mode);
    setTimeout(() => {
      setDownloadingMode(null);
    }, 1000);
  };

  return (
    <div className="relative rounded-2xl bg-[#0D0F17]/80 backdrop-blur-md border border-white/10 p-6 mb-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 overflow-hidden">
      {/* Subtle Linear top border glow highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      {/* Store Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer">
              {store.name}
            </h1>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                title="Voltar para a tela inicial (aba de criar loja)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Início / Criar Loja</span>
              </button>
            )}

            <button
              type="button"
              onClick={onEditStore}
              title="Editar nome ou vendas da loja"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Editar</span>
            </button>

            {onDeleteStore && (
              <button
                type="button"
                onClick={onDeleteStore}
                title={`Apagar loja "${store.name}"`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Excluir Loja</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 font-sans">
            <span className="text-emerald-400 font-semibold">Unidade Ativa</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{sellersCount} {sellersCount === 1 ? 'funcionário' : 'funcionários'}</span>
            {store.period && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">Período: {store.period}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side: Vendas da Loja + Botões de Exportação Exclusiva da Loja */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-left lg:text-right bg-white/3 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
            <span className="block text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">
              Vendas Registradas da Loja
            </span>
            <span className="text-xl font-bold font-sans tabular-nums text-white">
              {formatBRL(store.totalSales)}
            </span>
          </div>

          {onExportStoreExcel && (
            <div className="flex items-center gap-1.5 bg-white/3 p-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] font-sans font-semibold uppercase text-slate-400 px-1 hidden sm:inline">
                Planilha da Loja:
              </span>
              <button
                type="button"
                onClick={() => handleExportWithFeedback('mobile')}
                title="Baixar planilha compacta desta loja (otimizada para tela de celular / WhatsApp)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:translate-y-0"
              >
                {downloadingMode === 'mobile' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Celular</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportWithFeedback('desktop')}
                title="Baixar planilha completa desta loja (formato expandido para desktop / computador)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:translate-y-0"
              >
                {downloadingMode === 'desktop' ? (
                  <Check className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>Desktop</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Financial KPI Summary Cards (4 Dashboard Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
        
        {/* Card 1: Vendas da Equipe */}
        <div className="group relative bg-white/2 border border-white/5 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:bg-white/4 transition-colors duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-sans">
              Vendas da Equipe
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/4 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-sans tabular-nums text-white">
            {formatBRL(grossTeamSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans tabular-nums">
            {store.totalSales > 0 ? (
              <span>{formatPercent(salesCoveragePercent)} das vendas da loja</span>
            ) : (
              <span>Soma dos vendedores</span>
            )}
          </div>
        </div>

        {/* Card 2: Salários Base */}
        <div className="group relative bg-white/2 border border-white/5 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:bg-white/4 transition-colors duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-sans">
              Total Salários Base
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/4 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-sans tabular-nums text-white">
            {formatBRL(totalBaseSalaries)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Fixo ({sellersCount} {sellersCount === 1 ? 'colaborador' : 'colaboradores'})
          </div>
        </div>

        {/* Card 3: Comissões */}
        <div className="group relative bg-white/2 border border-white/5 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:bg-white/4 transition-colors duration-300">
          <div className="flex items-center justify-between text-indigo-300 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-sans">
              Total Comissões
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-sans tabular-nums text-indigo-300">
            {formatBRL(totalCommissions)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Calculado s/ metas individuais
          </div>
        </div>

        {/* Card 4: TOTAL A PAGAR NO MÊS (Highlight com brilho verde/ciano suave) */}
        <div className="group relative overflow-hidden bg-white/2 border border-emerald-500/20 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:bg-white/4 transition-colors duration-300">
          {/* Sutil brilho de fundo esmeralda/ciano */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 font-sans">
              A Pagar no Mês
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-sans tabular-nums text-emerald-400">
            {formatBRL(totalPayrollToPay)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Salário Base + Comissões
          </div>
        </div>

      </div>
    </div>
  );
};

