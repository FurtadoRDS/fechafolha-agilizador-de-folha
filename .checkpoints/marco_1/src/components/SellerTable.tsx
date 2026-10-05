import React, { useState } from 'react';
import { Seller } from '../types/closing';
import { formatBRL, formatPercent } from '../utils/formatters';
import { Trash2, Edit2, Search, Users, AlertCircle, FileText } from 'lucide-react';

interface SellerTableProps {
  sellers: Seller[];
  onEditSeller: (seller: Seller) => void;
  onRemoveSeller: (sellerId: string) => void;
  isNotesColumnEnabled?: boolean;
  onToggleNotesColumn?: () => void;
}

export const SellerTable: React.FC<SellerTableProps> = ({
  sellers,
  onEditSeller,
  onRemoveSeller,
  isNotesColumnEnabled = false,
  onToggleNotesColumn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);

  const filteredSellers = sellers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase().trim()))
  );

  // Totais calculados
  const totalSellersSales = sellers.reduce((acc, s) => acc + (s.salesAmount || 0), 0);
  const totalBaseSalary = sellers.reduce((acc, s) => acc + (s.baseSalary || 0), 0);
  const totalCommissions = sellers.reduce((acc, s) => acc + (s.commissionAmount || 0), 0);
  const grandTotalSalary = sellers.reduce((acc, s) => acc + (s.totalSalary || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Funcionários da Loja
          </h2>
          <span className="text-xs font-mono text-slate-500">
            ({sellers.length} {sellers.length === 1 ? 'cadastrado' : 'cadastrados'})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle para Coluna de Observação */}
          {onToggleNotesColumn && (
            <button
              type="button"
              onClick={onToggleNotesColumn}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                isNotesColumnEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={
                isNotesColumnEnabled
                  ? 'Coluna Observação HABILITADA: incluída nesta tabela e no arquivo Excel (.xlsx). Clique para desabilitar.'
                  : 'Coluna Observação DESABILITADA: oculta na tabela e no Excel (.xlsx). Clique para habilitar.'
              }
            >
              <FileText className={`w-3.5 h-3.5 ${isNotesColumnEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Coluna Observação</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isNotesColumnEnabled
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isNotesColumnEnabled ? 'Ativada' : 'Desativada'}
              </span>
            </button>
          )}

          {/* Search */}
          {sellers.length > 3 && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar funcionário..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table / Empty State */}
      {sellers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Nenhum funcionário cadastrado nesta loja
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Utilize o formulário acima para registrar as vendas, salário base e comissão de cada funcionário.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nome do Funcionário</th>
                <th className="py-3 px-4 text-right">Vendas do Funcionário (R$)</th>
                <th className="py-3 px-4 text-right">Salário Base (R$)</th>
                <th className="py-3 px-4 text-right">Comissão Calculada (R$)</th>
                <th className="py-3 px-4 text-right bg-emerald-50/50 text-emerald-950 font-bold">
                  A Receber no Mês (Base + Com.)
                </th>
                {isNotesColumnEnabled && (
                  <th className="py-3 px-4 text-left">Observação</th>
                )}
                <th className="py-3 px-4 text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Nome */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {seller.name}
                  </td>

                  {/* Vendas */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {formatBRL(seller.salesAmount)}
                  </td>

                  {/* Salário Base */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {formatBRL(seller.baseSalary)}
                  </td>

                  {/* Comissão */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <div className="text-indigo-700 font-medium">
                      {formatBRL(seller.commissionAmount)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {seller.commissionType === 'percentage'
                        ? `${formatPercent(seller.commissionRate)} s/ vendas`
                        : 'Valor fixo'}
                    </div>
                  </td>

                  {/* Salário Total */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 bg-slate-50/40">
                    {formatBRL(seller.totalSalary)}
                  </td>

                  {/* Observação (quando habilitada) */}
                  {isNotesColumnEnabled && (
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {seller.notes ? (
                        <span className="italic">{seller.notes}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  )}

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditSeller(seller)}
                        title="Editar funcionário"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSellerToDelete(seller)}
                        title="Remover funcionário"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSellers.length === 0 && (
                <tr>
                  <td
                    colSpan={isNotesColumnEnabled ? 7 : 6}
                    className="py-8 text-center text-xs text-slate-500"
                  >
                    Nenhum funcionário encontrado com o termo "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>

            {/* Linha de SOMA TOTAL da tabela */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100/80 font-semibold text-xs text-slate-900">
                <td className="py-3.5 px-4 uppercase tracking-wider font-bold">
                  SOMA TOTAL ({sellers.length} {sellers.length === 1 ? 'func.' : 'func.'})
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                  {formatBRL(totalSellersSales)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                  {formatBRL(totalBaseSalary)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-indigo-700">
                  {formatBRL(totalCommissions)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 bg-slate-200/50">
                  {formatBRL(grandTotalSalary)}
                </td>
                {isNotesColumnEnabled && (
                  <td className="py-3.5 px-4 text-slate-400 font-normal text-center">-</td>
                )}
                <td className="py-3.5 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {sellerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Remover Funcionário?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tem certeza que deseja remover <strong>{sellerToDelete.name}</strong> deste fechamento?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSellerToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveSeller(sellerToDelete.id);
                  setSellerToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
