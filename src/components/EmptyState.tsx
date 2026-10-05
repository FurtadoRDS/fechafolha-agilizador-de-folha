import React, { useState } from 'react';
import { Store as StoreIcon, Plus, FileSpreadsheet, ShieldCheck, Database, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import { parseNumberInput, formatBRL } from '../utils/formatters';
import { Store } from '../types/closing';

interface EmptyStateProps {
  onAddFirstStore: (name: string, totalSales: number, period?: string) => void;
  existingStoresCount?: number;
  activeStoreName?: string;
  onBackToDashboard?: () => void;
  stores?: Store[];
  onSelectStore?: (id: string) => void;
  onDeleteStore?: (store: Store) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddFirstStore,
  existingStoresCount = 0,
  activeStoreName,
  onBackToDashboard,
  stores = [],
  onSelectStore,
  onDeleteStore,
}) => {
  const [name, setName] = useState('');
  const [totalSales, setTotalSales] = useState('');
  const [period, setPeriod] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da loja.');
      return;
    }

    const salesNum = parseNumberInput(totalSales);
    onAddFirstStore(name.trim(), salesNum, period.trim());
    setName('');
    setTotalSales('');
    setPeriod('');
  };

  return (
    <div className="relative max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* 1. Background com Profundidade (Glow Difuso Profissional) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Barra de Retorno quando já existem lojas cadastradas */}
      {existingStoresCount > 0 && onBackToDashboard && (
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-8 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>
              Você tem <strong>{existingStoresCount}</strong> {existingStoresCount === 1 ? 'loja cadastrada' : 'lojas cadastradas'} na rede
            </span>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>Voltar para {activeStoreName ? `"${activeStoreName}"` : 'Fechamento'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Títulos e Tipografia */}
      <div className="relative text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)] mb-5">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Fechamento de Salários e Comissões
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-3 leading-relaxed">
          Plataforma de alta precisão para fechamento financeiro de lojas, cálculo instantâneo de comissões e exportação em Excel para celular e desktop.
        </p>
      </div>

      {/* 3. Card Principal (Glassmorphism sutil) */}
      <div className="relative bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden">
        {/* Top ambient highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            {existingStoresCount > 0 ? 'Cadastrar Nova Loja na Rede' : 'Cadastrar a Primeira Loja da Rede'}
          </h2>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-slate-400 mb-2">
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
              className="w-full px-3.5 py-2.5 text-sm bg-black/20 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-400 mb-2">
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
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-black/20 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-400 mb-2">
                Mês / Período (Opcional)
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ex: Outubro / 2026"
                className="w-full px-3.5 py-2.5 text-sm bg-black/20 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* 4. Botão Principal (Premium Call-to-Action) */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>
                {existingStoresCount > 0 ? 'Criar Loja e Começar Fechamento' : 'Começar Fechamento desta Loja'}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Database className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-200">100% Local</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Dados salvos com segurança no navegador</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-200">Exportação Excel</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Layout duplo: Celular & Desktop</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-200">Múltiplas Lojas</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Consolide toda a rede em um clique</p>
          </div>
        </div>
      </div>

      {/* Seção de Lojas Cadastradas na Rede (quando já existem lojas) */}
      {stores && stores.length > 0 && (
        <div className="mt-8 relative bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-7 overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <StoreIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Lojas Cadastradas na Rede ({stores.length})
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Gerencie ou acesse o fechamento das unidades
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {stores.map((store) => {
              const sellersCount = store.sellers?.length || 0;
              return (
                <div
                  key={store.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                      {store.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {store.name}
                        </span>
                        {store.period && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                            {store.period}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                        <span>
                          Vendas: <strong className="text-slate-200 tabular-nums">{formatBRL(store.totalSales)}</strong>
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>
                          {sellersCount} {sellersCount === 1 ? 'colaborador' : 'colaboradores'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {onSelectStore && (
                      <button
                        type="button"
                        onClick={() => onSelectStore(store.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Fechamento</span>
                      </button>
                    )}
                    {onDeleteStore && (
                      <button
                        type="button"
                        onClick={() => onDeleteStore(store)}
                        title={`Apagar loja "${store.name}"`}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
