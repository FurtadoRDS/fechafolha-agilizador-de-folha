import React, { useState, useEffect } from 'react';
import { CommissionType, Seller } from '../types/closing';
import { formatBRL, parseNumberInput } from '../utils/formatters';
import { X, Calculator, UserCheck, Check, AlertCircle } from 'lucide-react';

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
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

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

    setIsSavedFeedback(true);
    setTimeout(() => {
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
      setIsSavedFeedback(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative rounded-2xl bg-[#0D0F17] shadow-2xl border border-white/10 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top ambient highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/6 bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer">
                Editar Funcionário
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Altere os valores e recalcule o fechamento
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl font-sans">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
              Nome do Funcionário <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
                Vendas do Funcionário (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-slate-500">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={salesAmount}
                  onChange={(e) => setSalesAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
                Salário Base (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-slate-500">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
              Comissão
            </label>

            <div className="relative mb-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-slate-500">
                {commissionType === 'percentage' ? '%' : 'R$'}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Type Switcher */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setCommissionType('percentage')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all cursor-pointer font-sans ${
                    commissionType === 'percentage'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  % Porcentagem
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionType('fixed')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all cursor-pointer font-sans ${
                    commissionType === 'fixed'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  R$ Fixo
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
              Observação (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Meta batida, Contrato novo, Férias proporcionais..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-sans"
            />
          </div>

          {/* Result Preview */}
          <div className="p-3.5 bg-white/2 border border-white/10 rounded-xl flex items-center justify-between text-xs font-sans tabular-nums shadow-inner">
            <div className="flex items-center gap-1.5 text-slate-400 font-sans">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>
                Comissão:{' '}
                <strong className="text-emerald-400 font-bold tabular-nums font-sans">
                  {formatBRL(calculatedCommission)}
                </strong>
              </span>
            </div>
            <div className="text-slate-300 font-sans">
              Salário Total:{' '}
              <strong className="text-white font-extrabold text-sm tabular-nums font-sans">
                {formatBRL(calculatedTotalSalary)}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-lg px-6 py-2.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer font-sans"
            >
              {isSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Atualizado!</span>
                </>
              ) : (
                <span>Salvar Alterações</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};