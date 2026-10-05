/**
 * Utilitários de formatação e parsing para moeda brasileira (BRL) e números
 */

export const formatBRL = (value: number | undefined | null): string => {
  const numeric = typeof value === 'number' && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

export const formatNumberBR = (
  value: number | undefined | null,
  decimals = 2
): string => {
  const numeric = typeof value === 'number' && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numeric);
};

export const formatPercent = (value: number | undefined | null): string => {
  const numeric = typeof value === 'number' && !isNaN(value) ? value : 0;
  return `${numeric.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
};

/**
 * Converte entradas de texto (como "1.500,50", "1500,50", "1500.50", "R$ 1.500,00")
 * em um número float utilizável em cálculos.
 */
export const parseNumberInput = (input: string | number | undefined | null): number => {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;

  // Remove caracteres que não sejam dígitos, vírgula, ponto ou sinal de menos
  const cleaned = input
    .toString()
    .replace(/[^\d.,-]/g, '')
    .trim();

  if (!cleaned) return 0;

  // Se houver vírgula e ponto:
  // Ex: "1.234,56" -> o ponto é milhar e a vírgula é decimal
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    if (lastComma > lastDot) {
      // Padrão brasileiro: 1.250,50
      const standard = cleaned.replace(/\./g, '').replace(',', '.');
      const val = parseFloat(standard);
      return isNaN(val) ? 0 : val;
    } else {
      // Padrão americano: 1,250.50
      const standard = cleaned.replace(/,/g, '');
      const val = parseFloat(standard);
      return isNaN(val) ? 0 : val;
    }
  }

  // Se tem apenas vírgula: "1500,50" -> substitui por ponto
  if (cleaned.includes(',')) {
    const standard = cleaned.replace(',', '.');
    const val = parseFloat(standard);
    return isNaN(val) ? 0 : val;
  }

  // Se tem apenas ponto: pode ser decimal "1500.50"
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
};
