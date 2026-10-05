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
    <div className="relative rounded-2xl bg-[#0D0F17]/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="p-5 border-b border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer">
            Quadro de Funcionários & Comissões
          </h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            ({sellers.length} {sellers.length === 1 ? 'lançado' : 'lançados'})
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
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/6 hover:text-white'
              }`}
              title={
                isNotesColumnEnabled
                  ? 'Coluna Observação HABILITADA: incluída nesta tabela e no arquivo Excel (.xlsx). Clique para desabilitar.'
                  : 'Coluna Observação DESABILITADA: oculta na tabela e no Excel (.xlsx). Clique para habilitar.'
              }
            >
              <FileText className={`w-3.5 h-3.5 ${isNotesColumnEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Coluna Observação</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                  isNotesColumnEnabled
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {isNotesColumnEnabled ? 'Ativa' : 'Oculta'}
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
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white/3 border border-white/8 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table / Empty State */}
      {sellers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-slate-800/40 p-4 rounded-full mb-4 ring-1 ring-white/5 flex items-center justify-center text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-slate-300 font-medium mb-1 font-sans">
            Nenhum funcionário lançado nesta loja
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-sans">
            Utilize o formulário acima para registrar as vendas, salário base e comissão de cada funcionário.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8 bg-white/2 text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Nome do Funcionário</th>
                <th className="py-3 px-4 text-right">Vendas (R$)</th>
                <th className="py-3 px-4 text-right">Salário Base (R$)</th>
                <th className="py-3 px-4 text-right">Comissão Calculada</th>
                <th className="py-3 px-4 text-right bg-emerald-500/4 text-emerald-300 font-bold border-l border-r border-emerald-500/10">
                  Total a Receber (Base + Com.)
                </th>
                {isNotesColumnEnabled && (
                  <th className="py-3 px-4 text-left">Observação</th>
                )}
                <th className="py-3 px-4 text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4 text-xs">
              {filteredSellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="hover:bg-white/4 transition-colors duration-200 group"
                >
                  {/* Nome */}
                  <td className="py-3.5 px-4 font-medium text-slate-200 group-hover:text-white transition-colors font-sans">
                    {seller.name}
                  </td>

                  {/* Vendas */}
                  <td className="py-3.5 px-4 text-right font-sans tabular-nums text-slate-300">
                    {formatBRL(seller.salesAmount)}
                  </td>

                  {/* Salário Base */}
                  <td className="py-3.5 px-4 text-right font-sans tabular-nums text-slate-300">
                    {formatBRL(seller.baseSalary)}
                  </td>

                  {/* Comissão */}
                  <td className="py-3.5 px-4 text-right font-sans tabular-nums">
                    <div className="text-emerald-400 font-medium">
                      {formatBRL(seller.commissionAmount)}
                    </div>
                    <div className="text-[10px] font-sans text-slate-500">
                      {seller.commissionType === 'percentage'
                        ? `${formatPercent(seller.commissionRate)} s/ vendas`
                        : 'Fixo'}
                    </div>
                  </td>

                  {/* Salário Total */}
                  <td className="py-3.5 px-4 text-right font-sans tabular-nums font-bold text-white bg-emerald-500/3 border-l border-r border-emerald-500/10">
                    <span className="text-emerald-300 font-bold text-sm">
                      {formatBRL(seller.totalSalary)}
                    </span>
                  </td>

                  {/* Observação (quando habilitada) */}
                  {isNotesColumnEnabled && (
                    <td className="py-3.5 px-4 text-slate-400 text-xs font-sans">
                      {seller.notes ? (
                        <span className="italic text-slate-300">{seller.notes}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  )}

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEditSeller(seller)}
                        title="Editar funcionário"
                        className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSellerToDelete(seller)}
                        title="Remover funcionário"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
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
                    className="py-8 text-center text-xs text-slate-500 font-sans"
                  >
                    Nenhum funcionário encontrado com o termo "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>

            {/* Linha de SOMA TOTAL da tabela */}
            <tfoot>
              <tr className="border-t border-white/10 bg-white/3 font-semibold text-xs text-white">
                <td className="py-3.5 px-4 uppercase tracking-wider font-sans font-bold text-slate-300">
                  SOMA TOTAL ({sellers.length} {sellers.length === 1 ? 'func.' : 'func.'})
                </td>
                <td className="py-3.5 px-4 text-right font-sans tabular-nums font-bold text-slate-200">
                  {formatBRL(totalSellersSales)}
                </td>
                <td className="py-3.5 px-4 text-right font-sans tabular-nums font-bold text-slate-200">
                  {formatBRL(totalBaseSalary)}
                </td>
                <td className="py-3.5 px-4 text-right font-sans tabular-nums font-bold text-emerald-400">
                  {formatBRL(totalCommissions)}
                </td>
                <td className="py-3.5 px-4 text-right font-sans tabular-nums font-bold text-emerald-300 bg-emerald-500/8 border-l border-r border-emerald-500/20">
                  <span className="text-base font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-sans">
                    {formatBRL(grandTotalSalary)}
                  </span>
                </td>
                {isNotesColumnEnabled && (
                  <td className="py-3.5 px-4 text-slate-500 font-normal text-center font-sans">-</td>
                )}
                <td className="py-3.5 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {sellerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0D0F17] rounded-2xl shadow-2xl border border-white/12 w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Remover Funcionário?
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Tem certeza que deseja remover <strong>{sellerToDelete.name}</strong> deste fechamento?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/6">
              <button
                type="button"
                onClick={() => setSellerToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveSeller(sellerToDelete.id);
                  setSellerToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
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

