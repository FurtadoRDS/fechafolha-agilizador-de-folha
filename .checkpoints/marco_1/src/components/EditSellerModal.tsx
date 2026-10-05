import React, { useState, useEffect } from 'react';
import { CommissionType, Seller } from '../types/closing';
import { formatBRL, parseNumberInput } from '../utils/formatters';
import { X, Calculator } from 'lucide-react';

interface EditSellerModalProps {
  isOpen: boolean;
  seller: Seller | null;
  onClose: () => void;
  onSave: (updatedData: Partial<Seller>) => void;
}

export const EditSellerModal: React.FC<EditSellerModalProps> = ({
  isOpen,
  seller,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [salesAmount, setSalesAmount] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [commissionType, setCommissionType] = useState<CommissionType>('percentage');
  const [commissionRate, setCommissionRate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (seller) {
      setName(seller.name);
      setSalesAmount(seller.salesAmount ? String(seller.salesAmount) : '');
      setBaseSalary(seller.baseSalary ? String(seller.baseSalary) : '');
      setCommissionType(seller.commissionType || 'percentage');
      setCommissionRate(seller.commissionRate ? String(seller.commissionRate) : '');
      setNotes(seller.notes || '');
      setError('');
    }
  }, [seller, isOpen]);

  if (!isOpen || !seller) return null;

  const parsedSales = parseNumberInput(salesAmount);
  const parsedBase = parseNumberInput(baseSalary);
  const parsedRate = parseNumberInput(commissionRate);

  const calculatedCommission =
    commissionType === 'percentage'
      ? (parsedSales * parsedRate) / 100
      : parsedRate;

  const calculatedTotalSalary = parsedBase + calculatedCommission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do vendedor é obrigatório.');
      return;
    }

    onSave({
      name: name.trim(),
      salesAmount: parsedSales,
      baseSalary: parsedBase,
      commissionType,
      commissionRate: parsedRate,
      commissionAmount: calculatedCommission,
      totalSalary: calculatedTotalSalary,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Editar Vendedor</h3>
            <p className="text-xs text-slate-500">Altere os valores e recalcule o fechamento</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome do Vendedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Vendas do Vendedor (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={salesAmount}
                  onChange={(e) => setSalesAmount(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Salário Base (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Comissão
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                <button
                  type="button"
                  onClick={() => setCommissionType('percentage')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                    commissionType === 'percentage'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  % Porcentagem
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionType('fixed')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                    commissionType === 'fixed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  R$ Fixo
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                {commissionType === 'percentage' ? '%' : 'R$'}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Observação (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Meta batida, Contrato novo, Férias proporcionais..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Result Preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <span>Comissão: <strong>{formatBRL(calculatedCommission)}</strong></span>
            </div>
            <div className="text-slate-900">
              Salário Total: <strong className="text-indigo-700">{formatBRL(calculatedTotalSalary)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
