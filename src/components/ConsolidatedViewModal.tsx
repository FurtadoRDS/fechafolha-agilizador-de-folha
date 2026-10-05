import React from 'react';
import { Store, ExportDeviceMode } from '../types/closing';
import { formatBRL } from '../utils/formatters';
import { X, FileSpreadsheet, Building2, Smartphone, Monitor, Trash2 } from 'lucide-react';

interface ConsolidatedViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
  deviceMode?: ExportDeviceMode;
  onExportExcel: (mode?: ExportDeviceMode) => void;
  onSelectStore: (storeId: string) => void;
  onDeleteStore?: (store: Store) => void;
}

export const ConsolidatedViewModal: React.FC<ConsolidatedViewModalProps> = ({
  isOpen,
  onClose,
  stores,
  deviceMode = 'mobile',
  onExportExcel,
  onSelectStore,
  onDeleteStore,
}) => {
  if (!isOpen) return null;

  const networkStoreSales = stores.reduce((sum, s) => sum + (s.totalSales || 0), 0);
  const networkSellersSales = stores.reduce(
    (sum, s) => sum + (s.sellers || []).reduce((inner, sel) => inner + (sel.salesAmount || 0), 0),
    0
  );
  const networkSellersCount = stores.reduce((sum, s) => sum + (s.sellers || []).length, 0);
  const networkBaseSalaries = stores.reduce(
    (sum, s) => sum + (s.sellers || []).reduce((inner, sel) => inner + (sel.baseSalary || 0), 0),
    0
  );
  const networkCommissions = stores.reduce(
    (sum, s) => sum + (s.sellers || []).reduce((inner, sel) => inner + (sel.commissionAmount || 0), 0),
    0
  );
  const networkPayroll = stores.reduce((sum, s) => {
    const sPayroll = (s.sellers || []).reduce((inner, sel) => inner + (sel.totalSalary || 0), 0);
    return sum + sPayroll;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative rounded-2xl bg-[#0D0F17] shadow-2xl border border-white/10 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top ambient highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/6 bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer">
                Consolidado Geral de Vendas e Salários da Rede
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Resumo comparativo de todas as {stores.length} lojas registradas
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

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-white/10 rounded-xl overflow-hidden shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/3 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                  <th className="py-3 px-4">Loja</th>
                  <th className="py-3 px-4 text-right">Vendas da Loja</th>
                  <th className="py-3 px-4 text-right">Vendas da Equipe</th>
                  <th className="py-3 px-4 text-center">Funcionários</th>
                  <th className="py-3 px-4 text-right">Salários Base</th>
                  <th className="py-3 px-4 text-right">Comissões</th>
                  <th className="py-3 px-4 text-right bg-emerald-500/4 text-emerald-300 border-l border-r border-emerald-500/10">
                    Total a Pagar no Mês
                  </th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4 text-xs">
                {stores.map((store) => {
                  const sellers = store.sellers || [];
                  const storeSales = store.totalSales || 0;
                  const storeSellersSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
                  const storeBase = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
                  const storeComm = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
                  const storePayroll = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0);

                  return (
                    <tr key={store.id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="py-3.5 px-4 font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {store.name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {formatBRL(storeSales)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {formatBRL(storeSellersSales)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-400">
                        {sellers.length}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {formatBRL(storeBase)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-indigo-400">
                        {formatBRL(storeComm)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-300 bg-emerald-500/3 border-l border-r border-emerald-500/10">
                        {formatBRL(storePayroll)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectStore(store.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
                          >
                            Abrir Loja
                          </button>
                          {onDeleteStore && (
                            <button
                              type="button"
                              onClick={() => onDeleteStore(store)}
                              title={`Apagar loja "${store.name}"`}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/15 bg-white/4 font-bold text-xs text-white">
                  <td className="py-3.5 px-4 uppercase tracking-wider font-mono font-bold text-slate-300">
                    TOTAL DA REDE
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkStoreSales)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkSellersSales)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-300">
                    {networkSellersCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkBaseSalaries)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-indigo-300">
                    {formatBRL(networkCommissions)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-300 bg-emerald-500/8 border-l border-r border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="text-base font-bold text-emerald-300">
                      {formatBRL(networkPayroll)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4.5 border-t border-white/6 bg-white/2">
          <span className="text-xs text-slate-400 font-mono">
            Exporta abas individuais para cada loja e aba de resumo geral.
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                onExportExcel('mobile');
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              title="Exportar versão otimizada para celular / WhatsApp"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-950" />
              <span>Exportar p/ Celular (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onExportExcel('desktop');
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              title="Exportar versão tradicional para computador"
            >
              <Monitor className="w-3.5 h-3.5 text-slate-950" />
              <span>Exportar Desktop (.xlsx)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
