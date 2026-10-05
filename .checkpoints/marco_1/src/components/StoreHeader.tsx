import React from 'react';
import { Store } from '../types/closing';
import { formatBRL, formatPercent } from '../utils/formatters';
import { Edit2, TrendingUp, DollarSign, Wallet, Percent } from 'lucide-react';

interface StoreHeaderProps {
  store: Store;
  onEditStore: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ store, onEditStore }) => {
  const sellers = store.sellers || [];

  const sellersCount = sellers.length;
  const grossTeamSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
  const totalBaseSalaries = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
  const totalCommissions = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
  const totalPayrollToPay = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0); // Salário Base + Comissões

  const salesCoveragePercent =
    store.totalSales > 0 ? (grossTeamSales / store.totalSales) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-6">
      {/* Store Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {store.name}
            </h1>
            <button
              onClick={onEditStore}
              title="Editar nome ou vendas da loja"
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Rede de Óticas</span>
            <span aria-hidden="true">·</span>
            <span>{sellersCount} {sellersCount === 1 ? 'funcionário cadastrado' : 'funcionários cadastrados'}</span>
            {store.period && (
              <>
                <span aria-hidden="true">·</span>
                <span>Período: {store.period}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total de Vendas da Loja
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {formatBRL(store.totalSales)}
            </span>
          </div>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
        
        {/* Card 1: Vendas da Equipe */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Vendas da Equipe</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-slate-900">
            {formatBRL(grossTeamSales)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {store.totalSales > 0 ? (
              <span>{formatPercent(salesCoveragePercent)} das vendas da loja</span>
            ) : (
              <span>Soma dos funcionários</span>
            )}
          </div>
        </div>

        {/* Card 2: Salários Base */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Total Salários Base</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-slate-900">
            {formatBRL(totalBaseSalaries)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Fixo ({sellersCount} {sellersCount === 1 ? 'funcionário' : 'funcionários'})
          </div>
        </div>

        {/* Card 3: Comissões */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Total Comissões</span>
            <Percent className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-indigo-700">
            {formatBRL(totalCommissions)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Calculado s/ vendas dos funcionários
          </div>
        </div>

        {/* Card 4: TOTAL A PAGAR ESTE MÊS */}
        <div className="p-4 rounded-lg bg-emerald-50/80 border border-emerald-200/90">
          <div className="flex items-center justify-between text-emerald-950 mb-1.5">
            <span className="text-xs font-bold">TOTAL A PAGAR NO MÊS</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-emerald-800">
            {formatBRL(totalPayrollToPay)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Salário Base + Comissões da Equipe
          </div>
        </div>

      </div>
    </div>
  );
};
