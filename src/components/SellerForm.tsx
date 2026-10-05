import React, { useState, useRef } from 'react';
import { CommissionType, Seller } from '../types/closing';
import { formatBRL, parseNumberInput } from '../utils/formatters';
import { UserPlus, Calculator, FileText, Check } from 'lucide-react';

interface SellerFormProps {
  onAddSeller: (seller: Omit<Seller, 'id' | 'createdAt'>) => void;
  isNotesColumnEnabled?: boolean;
  onToggleNotesColumn?: () => void;
}

export const SellerForm: React.FC<SellerFormProps> = ({
  onAddSeller,
  isNotesColumnEnabled = false,
  onToggleNotesColumn,
}) => {
  const [name, setName] = useState('');
  const [salesAmount, setSalesAmount] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [commissionType, setCommissionType] = useState<CommissionType>('percentage');
  const [commissionRate, setCommissionRate] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Valores numéricos calculados em tempo real para prévia
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
      setErrorMessage('Informe o nome do vendedor.');
      nameInputRef.current?.focus();
      return;
    }

    const sellerNotes = (isNotesColumnEnabled || showNotesField) && notes.trim() ? notes.trim() : undefined;

    if (sellerNotes && !isNotesColumnEnabled && onToggleNotesColumn) {
      onToggleNotesColumn();
    }

    onAddSeller({
      name: name.trim(),
      salesAmount: parsedSales,
      baseSalary: parsedBase,
      commissionType,
      commissionRate: parsedRate,
      commissionAmount: calculatedCommission,
      totalSalary: calculatedTotalSalary,
      notes: sellerNotes,
    });

    // Feedback tátil de sucesso
    setIsSuccessAnimated(true);
    setTimeout(() => {
      setIsSuccessAnimated(false);
    }, 1000);

    // Limpar o formulário
    setName('');
    setSalesAmount('');
    setBaseSalary('');
    setCommissionRate('');
    setNotes('');
    setErrorMessage('');

    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="relative rounded-2xl bg-[#12141C] border border-white/10 p-6 mb-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2 font-sans">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-text-shimmer font-bold font-sans">
              Lançar Funcionário / Fechamento de Vendas
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Preencha os valores. O cálculo é instantâneo e o formulário limpa após salvar.
          </p>
        </div>

        {/* Live Calculation Badge */}
        {(parsedSales > 0 || parsedBase > 0 || calculatedCommission > 0) && (
          <div className="flex items-center gap-2.5 text-xs bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-1.5 font-sans tabular-nums shadow-sm animate-in fade-in duration-300">
            <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400 font-sans">
              Comissão:{' '}
              <strong className="text-emerald-400 font-semibold tabular-nums font-sans">
                {formatBRL(calculatedCommission)}
              </strong>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-400 font-sans">
              A Receber:{' '}
              <strong className="text-white font-bold tabular-nums font-sans">
                {formatBRL(calculatedTotalSalary)}
              </strong>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl font-sans">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Nome do Vendedor */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
              Nome do Vendedor <span className="text-rose-400">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: Carlos Oliveira"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-sans"
            />
          </div>

          {/* 2. Total de Vendas do Vendedor (R$) */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 block font-sans">
              Vendas do Vendedor (R$)
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
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* 3. Salário Base do Vendedor (R$) */}
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
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* 4. Comissão pelas Vendas (% ou R$) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block font-sans">
                Comissão
              </label>
              
              {/* Type Switcher */}
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setCommissionType('percentage')}
                  className={`px-2 py-0.5 text-[11px] font-sans rounded transition-colors cursor-pointer ${
                    commissionType === 'percentage'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Calcular porcentagem sobre as vendas do vendedor"
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionType('fixed')}
                  className={`px-2 py-0.5 text-[11px] font-sans rounded transition-colors cursor-pointer ${
                    commissionType === 'fixed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Valor em Reais fixo"
                >
                  R$
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-slate-500">
                {commissionType === 'percentage' ? '%' : 'R$'}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder={commissionType === 'percentage' ? 'Ex: 2.5' : 'Ex: 500,00'}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-sans tabular-nums bg-black/30 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

        </div>

        {/* Campo de Observação Opcional com Toggle */}
        <div className="pt-1">
          {!isNotesColumnEnabled && !showNotesField ? (
            <button
              type="button"
              onClick={() => setShowNotesField(true)}
              className="inline-flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 px-3 py-1.5 transition-colors cursor-pointer hover:-translate-y-0.5 font-sans"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Adicionar Observação deste Vendedor</span>
            </button>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 font-sans">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Observação do Vendedor</span>
                  <span className="text-[11px] font-normal text-slate-500 lowercase font-sans">(opcional)</span>
                </label>
                <div className="flex items-center gap-2">
                  {!isNotesColumnEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotesField(false);
                        setNotes('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer font-sans"
                    >
                      Ocultar campo
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Meta batida, Contrato novo, Férias proporcionais, Premiação especial..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-sans"
              />
              <p className="text-[11px] text-slate-400 font-sans">
                {isNotesColumnEnabled
                  ? 'A coluna Observação está ATIVADA e aparecerá na planilha Excel e na tabela.'
                  : 'A coluna Observação está DESATIVADA. Ao adicionar uma observação ou marcar a opção abaixo, ela será incluída no Excel.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Button & Column Toggle Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            {onToggleNotesColumn && (
              <label className="flex items-center gap-2.5 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 px-3.5 py-2 transition-colors cursor-pointer select-none font-sans">
                <input
                  type="checkbox"
                  checked={isNotesColumnEnabled}
                  onChange={onToggleNotesColumn}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/40 cursor-pointer accent-emerald-500"
                />
                <span>
                  Habilitar coluna <strong>Observação</strong> na tabela e no Excel (.xlsx)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-sans font-bold uppercase tracking-wider ${
                    isNotesColumnEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                  }`}
                >
                  {isNotesColumnEnabled ? 'Ativada' : 'Desativada'}
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-lg px-6 py-2.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer font-sans"
          >
            {isSuccessAnimated ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Adicionar Vendedor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

