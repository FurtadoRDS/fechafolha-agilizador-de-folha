import React, { useState } from 'react';
import { Store as StoreIcon, Plus, FileSpreadsheet, ShieldCheck, Database } from 'lucide-react';
import { parseNumberInput } from '../utils/formatters';

interface EmptyStateProps {
  onAddFirstStore: (name: string, totalSales: number, period?: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddFirstStore }) => {
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
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md mb-4">
          <StoreIcon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Fechamento de Salários e Comissões
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Gerencie o fechamento financeiro da sua rede de óticas com cálculo automático de comissões e exportação profissional para Excel.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
          <Plus className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Cadastrar a Primeira Loja da Rede
          </h2>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Ex: Ótica Visão - Matriz Centro"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mês / Período (Opcional)
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ex: Outubro / 2026"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Começar Fechamento desta Loja</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <Database className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-800">100% Local</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Seus dados ficam salvos de forma segura no seu navegador</p>
          </div>
          <div className="p-3">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-800">Exportação Excel</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Planilha com abas por loja e somas totais prontas</p>
          </div>
          <div className="p-3">
            <ShieldCheck className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
            <h4 className="text-xs font-semibold text-slate-800">Múltiplas Lojas</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Alterne entre filiais e consolide a rede com um clique</p>
          </div>
        </div>
      </div>
    </div>
  );
};
