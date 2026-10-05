import React, { useState, useRef } from 'react';
import { CommissionType, Seller } from '../types/closing';
import { formatBRL, parseNumberInput } from '../utils/formatters';
import { UserPlus, Calculator, FileText } from 'lucide-react';

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

    // Se o usuário digitou uma observação e a coluna geral ainda não está habilitada,
    // ativa a coluna para garantir que apareça na planilha
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

    // Limpar o formulário imediatamente para digitar o próximo
    setName('');
    setSalesAmount('');
    setBaseSalary('');
    setCommissionRate('');
    setNotes('');
    setErrorMessage('');

    // Retorna o foco para o primeiro campo de texto
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Adicionar Vendedor</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preencha os dados do funcionário. O formulário será limpo automaticamente após salvar.
          </p>
        </div>

        {/* Live Calculation Badge */}
        {(parsedSales > 0 || parsedBase > 0 || calculatedCommission > 0) && (
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 font-mono tabular-nums">
            <Calculator className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="text-slate-600">
              Comissão:{' '}
              <strong className="text-indigo-700 font-semibold">
                {formatBRL(calculatedCommission)}
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Salário Total:{' '}
              <strong className="text-slate-900 font-bold">
                {formatBRL(calculatedTotalSalary)}
              </strong>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Nome do Vendedor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome do Vendedor <span className="text-red-500">*</span>
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
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* 2. Total de Vendas do Vendedor (R$) */}
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
                placeholder="0,00"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 3. Salário Base do Vendedor (R$) */}
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
                placeholder="0,00"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 4. Comissão pelas Vendas (% ou R$) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Comissão
              </label>
              
              {/* Type Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                <button
                  type="button"
                  onClick={() => setCommissionType('percentage')}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                    commissionType === 'percentage'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Calcular porcentagem sobre as vendas do vendedor"
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
                  title="Valor em Reais fixo"
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
                placeholder={commissionType === 'percentage' ? 'Ex: 2.5' : 'Ex: 500,00'}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
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
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1 px-2.5 rounded-md hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Adicionar Observação deste Vendedor</span>
            </button>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Observação do Vendedor</span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">(opcional)</span>
                </label>
                <div className="flex items-center gap-2">
                  {!isNotesColumnEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotesField(false);
                        setNotes('');
                      }}
                      className="text-[11px] text-slate-400 hover:text-red-600 transition-colors"
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
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                {isNotesColumnEnabled
                  ? 'A coluna Observação está ATIVADA e aparecerá na planilha Excel e na tabela.'
                  : 'A coluna Observação está DESATIVADA. Ao adicionar uma observação ou marcar o checkbox abaixo, ela será incluída no Excel.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Button & Column Toggle Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {onToggleNotesColumn && (
              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNotesColumnEnabled}
                  onChange={onToggleNotesColumn}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span>
                  Habilitar coluna <strong>Observação</strong> na tabela e no Excel (.xlsx)
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isNotesColumnEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isNotesColumnEnabled ? 'Ativada' : 'Desativada'}
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Vendedor</span>
          </button>
        </div>
      </form>
    </div>
  );
};
