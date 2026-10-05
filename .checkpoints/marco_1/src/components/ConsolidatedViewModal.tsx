import React from 'react';
import { Store } from '../types/closing';
import { formatBRL } from '../utils/formatters';
import { X, FileSpreadsheet, Building2 } from 'lucide-react';

interface ConsolidatedViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
  onExportExcel: () => void;
  onSelectStore: (storeId: string) => void;
}

export const ConsolidatedViewModal: React.FC<ConsolidatedViewModalProps> = ({
  isOpen,
  onClose,
  stores,
  onExportExcel,
  onSelectStore,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Consolidado Geral de Vendas e Salários da Rede
              </h3>
              <p className="text-xs text-slate-500">
                Resumo comparativo de todas as {stores.length} lojas registradas
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

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Loja</th>
                  <th className="py-3 px-4 text-right">Vendas da Loja</th>
                  <th className="py-3 px-4 text-right">Vendas da Equipe</th>
                  <th className="py-3 px-4 text-center">Funcionários</th>
                  <th className="py-3 px-4 text-right">Salários Base</th>
                  <th className="py-3 px-4 text-right">Comissões</th>
                  <th className="py-3 px-4 text-right">Total a Pagar no Mês</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {stores.map((store) => {
                  const sellers = store.sellers || [];
                  const storeSales = store.totalSales || 0;
                  const storeSellersSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
                  const storeBase = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
                  const storeComm = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
                  const storePayroll = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0);

                  return (
                    <tr key={store.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {store.name}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {formatBRL(storeSales)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {formatBRL(storeSellersSales)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                        {sellers.length}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {formatBRL(storeBase)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-indigo-700">
                        {formatBRL(storeComm)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-800 bg-emerald-50/40">
                        {formatBRL(storePayroll)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectStore(store.id);
                            onClose();
                          }}
                          className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Abrir Loja
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-xs text-slate-900">
                  <td className="py-3 px-4 uppercase tracking-wider">
                    TOTAL DA REDE
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkStoreSales)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkSellersSales)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">
                    {networkSellersCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {formatBRL(networkBaseSalaries)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-indigo-700">
                    {formatBRL(networkCommissions)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-800 bg-emerald-100/50">
                    {formatBRL(networkPayroll)}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Exporta planilha completa com abas individuais para cada loja e aba de resumo geral.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                onExportExcel();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel Completo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
