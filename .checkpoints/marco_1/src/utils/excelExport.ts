import XLSX from 'xlsx-js-style';
import { Store } from '../types/closing';

// Paleta baseada na estilização da referência
const PALETTE = {
  navyDark: '0B192C',      // Fundo escuro do banner principal
  navyHeader: '1E293B',    // Fundo dos cabeçalhos das tabelas
  navyLight: 'F1F5F9',     // Fundo suave de linhas de destaque / subtotais
  borderGray: 'CBD5E1',
  borderLight: 'E2E8F0',
  textWhite: 'FFFFFF',
  textDark: '0F172A',
  textMuted: '475569',
  greenBold: '15803D',     // Verde para comissões e totais finais
  greenBg: 'F0FDF4',       // Fundo verde claro para total a pagar
  zebraRow: 'F8FAFC',
};

const BORDER_THIN = {
  top: { style: 'thin', color: { rgb: PALETTE.borderLight } },
  bottom: { style: 'thin', color: { rgb: PALETTE.borderLight } },
  left: { style: 'thin', color: { rgb: PALETTE.borderLight } },
  right: { style: 'thin', color: { rgb: PALETTE.borderLight } },
};

const BORDER_DOUBLE_BOTTOM = {
  top: { style: 'thin', color: { rgb: PALETTE.borderGray } },
  bottom: { style: 'double', color: { rgb: PALETTE.navyDark } },
  left: { style: 'thin', color: { rgb: PALETTE.borderGray } },
  right: { style: 'thin', color: { rgb: PALETTE.borderGray } },
};

function formatCurrencyVal(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val || 0);
}

function sanitizeSheetName(name: string, index: number, existingNames: Set<string>): string {
  let clean = name.replace(/[:\\/?*\[\]]/g, '').trim();
  if (!clean) clean = `Loja ${index + 1}`;
  if (clean.length > 28) clean = clean.substring(0, 28);

  let finalName = clean;
  let counter = 1;
  while (existingNames.has(finalName)) {
    finalName = `${clean.substring(0, 25)} (${counter})`;
    counter++;
  }
  existingNames.add(finalName);
  return finalName;
}

/**
 * Cria a planilha da loja individual com foco em:
 * 1. Vendas separadas por funcionários
 * 2. Salários base e Comissões
 * 3. Quanto cada um vai receber no mês (Salário Base + Comissão)
 * 4. Coluna de Observação adicionada dinamicamente quando habilitada
 * 5. Linha de SOMA TOTAL dos salários no rodapé
 */
function createStoreStyledSheet(store: Store): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  let currentRow = 0;

  // Verifica se a coluna de observação está habilitada nesta loja
  const includeNotes = Boolean(store.includeNotes);
  const numCols = includeNotes ? 7 : 6;
  const valueCol = numCols - 1;

  const sellers = store.sellers || [];

  // Cálculos de Funcionários e Salários
  const grossTeamSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
  const totalBaseSalaries = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
  const totalCommissions = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
  const totalPayrollToPay = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0); // Salário Base + Comissões

  const setCell = (r: number, c: number, v: string | number, style: any = {}) => {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    ws[cellRef] = {
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: style,
    };
  };

  const setMergedRow = (r: number, startCol: number, endCol: number, val: string, style: any) => {
    for (let c = startCol; c <= endCol; c++) {
      setCell(r, c, c === startCol ? val : '', style);
    }
  };

  const merges: XLSX.Range[] = [];

  // ==========================================
  // LINHA 1: BANNER PRINCIPAL (Fundo Navy Escuro, Texto Branco Centralizado)
  // ==========================================
  const titleText = `FECHAMENTO DE SALÁRIOS E VENDAS - ${store.name.toUpperCase()}`;
  setMergedRow(currentRow, 0, numCols - 1, titleText, {
    font: { name: 'Segoe UI', sz: 14, bold: true, color: { rgb: PALETTE.textWhite } },
    fill: { fgColor: { rgb: PALETTE.navyDark } },
    alignment: { horizontal: 'center', vertical: 'center' },
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: numCols - 1 } });
  currentRow++;

  // ==========================================
  // LINHA 2: SUBTÍTULO COM PERÍODO
  // ==========================================
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const subTitle = `Período: ${store.period || 'Mês de Fechamento'} | Emitido em: ${dateStr} às ${timeStr}`;
  setMergedRow(currentRow, 0, numCols - 1, subTitle, {
    font: { name: 'Segoe UI', sz: 9.5, italic: true, color: { rgb: PALETTE.textMuted } },
    fill: { fgColor: { rgb: 'F8FAFC' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'medium', color: { rgb: PALETTE.navyDark } } },
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: numCols - 1 } });
  currentRow++;

  // ==========================================
  // LINHAS 3 e 4: RESUMO DE INDICADORES DA LOJA
  // ==========================================
  // Linha 3
  setCell(currentRow, 0, 'Total Vendas da Loja:', {
    font: { name: 'Segoe UI', sz: 9, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 1, formatCurrencyVal(store.totalSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.navyDark } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });

  setCell(currentRow, 2, 'Total Salários Base:', {
    font: { name: 'Segoe UI', sz: 9, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 3, formatCurrencyVal(totalBaseSalaries), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });

  setCell(currentRow, 4, 'Total Comissões da Equipe:', {
    font: { name: 'Segoe UI', sz: 9, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 5, formatCurrencyVal(totalCommissions), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  if (includeNotes) {
    setCell(currentRow, 6, '', { fill: { fgColor: { rgb: 'FFFFFF' } }, border: BORDER_THIN });
    merges.push({ s: { r: currentRow, c: 5 }, e: { r: currentRow, c: 6 } });
  }
  currentRow++;

  // Linha 4
  setCell(currentRow, 0, 'Total Vendas da Equipe:', {
    font: { name: 'Segoe UI', sz: 9, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 1, formatCurrencyVal(grossTeamSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.navyDark } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });

  setCell(currentRow, 2, 'Equipe de Vendas:', {
    font: { name: 'Segoe UI', sz: 9, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 3, `${sellers.length} funcionários`, {
    font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });

  setCell(currentRow, 4, 'TOTAL A PAGAR NO MÊS:', {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      bottom: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      left: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      right: { style: 'thin', color: { rgb: PALETTE.greenBold } },
    },
  });
  setCell(currentRow, 5, formatCurrencyVal(totalPayrollToPay), {
    font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      bottom: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      left: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      right: { style: 'thin', color: { rgb: PALETTE.greenBold } },
    },
  });
  if (includeNotes) {
    setCell(currentRow, 6, '', {
      fill: { fgColor: { rgb: PALETTE.greenBg } },
      border: {
        top: { style: 'thin', color: { rgb: PALETTE.greenBold } },
        bottom: { style: 'thin', color: { rgb: PALETTE.greenBold } },
        left: { style: 'thin', color: { rgb: PALETTE.greenBold } },
        right: { style: 'thin', color: { rgb: PALETTE.greenBold } },
      },
    });
    merges.push({ s: { r: currentRow, c: 5 }, e: { r: currentRow, c: 6 } });
  }
  currentRow++;

  // Linha em branco separadora
  currentRow++;

  // ==========================================
  // TABELA PRINCIPAL: VENDAS, SALÁRIOS E COMISSÕES POR FUNCIONÁRIO
  // ==========================================
  const sellerHeaders = [
    'Nome do Funcionário',
    'Vendas do Funcionário (R$)',
    'Salário Base (R$)',
    'Comissão (%)',
    'Valor da Comissão (R$)',
    'TOTAL A RECEBER ESTE MÊS (R$)',
  ];

  if (includeNotes) {
    sellerHeaders.push('Observação');
  }

  sellerHeaders.forEach((h, colIdx) => {
    setCell(currentRow, colIdx, h, {
      font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textWhite } },
      fill: { fgColor: { rgb: PALETTE.navyHeader } },
      alignment: {
        horizontal: colIdx === 0 || (includeNotes && colIdx === 6) ? 'left' : colIdx === 3 ? 'center' : 'right',
        vertical: 'center',
        wrapText: true,
      },
      border: BORDER_THIN,
    });
  });
  currentRow++;

  if (sellers.length === 0) {
    setMergedRow(currentRow, 0, numCols - 1, 'Nenhum funcionário cadastrado nesta loja', {
      font: { name: 'Segoe UI', sz: 9.5, italic: true, color: { rgb: PALETTE.textMuted } },
      fill: { fgColor: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: BORDER_THIN,
    });
    merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: numCols - 1 } });
    currentRow++;
  } else {
    sellers.forEach((seller, idx) => {
      const bg = idx % 2 === 0 ? 'FFFFFF' : PALETTE.zebraRow;
      const rateLabel =
        seller.commissionType === 'percentage'
          ? `${seller.commissionRate}%`
          : 'Fixo R$';

      // 0. Nome
      setCell(currentRow, 0, seller.name, {
        font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 1. Vendas
      setCell(currentRow, 1, formatCurrencyVal(seller.salesAmount), {
        font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'right', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 2. Salário Base
      setCell(currentRow, 2, formatCurrencyVal(seller.baseSalary), {
        font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'right', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 3. Taxa Comissão
      setCell(currentRow, 3, rateLabel, {
        font: { name: 'Segoe UI', sz: 9, color: { rgb: PALETTE.textMuted } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 4. Valor Comissão
      setCell(currentRow, 4, formatCurrencyVal(seller.commissionAmount), {
        font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.greenBold } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'right', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 5. Total a Receber no Mês (Salário Base + Comissão)
      setCell(currentRow, 5, formatCurrencyVal(seller.totalSalary), {
        font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
        fill: { fgColor: { rgb: bg } },
        alignment: { horizontal: 'right', vertical: 'center' },
        border: BORDER_THIN,
      });

      // 6. Observação (quando habilitada)
      if (includeNotes) {
        setCell(currentRow, 6, seller.notes || '-', {
          font: { name: 'Segoe UI', sz: 9, italic: !!seller.notes, color: { rgb: seller.notes ? PALETTE.textDark : PALETTE.textMuted } },
          fill: { fgColor: { rgb: bg } },
          alignment: { horizontal: 'left', vertical: 'center' },
          border: BORDER_THIN,
        });
      }

      currentRow++;
    });
  }

  // Linha de SOMA TOTAL DA EQUIPE
  setCell(currentRow, 0, `SOMA TOTAL DA EQUIPE (${sellers.length} funcionários)`, {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 1, formatCurrencyVal(grossTeamSales), {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 2, formatCurrencyVal(totalBaseSalaries), {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 3, '-', {
    font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textMuted } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 4, formatCurrencyVal(totalCommissions), {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  setCell(currentRow, 5, formatCurrencyVal(totalPayrollToPay), {
    font: { name: 'Segoe UI', sz: 10.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  if (includeNotes) {
    setCell(currentRow, 6, '-', {
      font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textMuted } },
      fill: { fgColor: { rgb: PALETTE.navyLight } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: BORDER_THIN,
    });
  }
  currentRow++;

  // Linha em branco
  currentRow++;

  // ==========================================
  // QUADRO DE FECHAMENTO FINAL NO RODAPÉ
  // ==========================================
  const summaryMergeEnd = valueCol - 1;

  setMergedRow(currentRow, 0, summaryMergeEnd, 'TOTAL DE VENDAS REGISTRADAS NA LOJA', {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: summaryMergeEnd } });
  setCell(currentRow, valueCol, formatCurrencyVal(store.totalSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  currentRow++;

  setMergedRow(currentRow, 0, summaryMergeEnd, 'TOTAL DE VENDAS REALIZADAS PELA EQUIPE', {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: summaryMergeEnd } });
  setCell(currentRow, valueCol, formatCurrencyVal(grossTeamSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  currentRow++;

  setMergedRow(currentRow, 0, summaryMergeEnd, 'TOTAL DE SALÁRIOS BASE A PAGAR', {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: summaryMergeEnd } });
  setCell(currentRow, valueCol, formatCurrencyVal(totalBaseSalaries), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  currentRow++;

  setMergedRow(currentRow, 0, summaryMergeEnd, 'TOTAL DE COMISSÕES DE VENDAS A PAGAR', {
    font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_THIN,
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: summaryMergeEnd } });
  setCell(currentRow, valueCol, formatCurrencyVal(totalCommissions), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_THIN,
  });
  currentRow++;

  setMergedRow(currentRow, 0, summaryMergeEnd, '(=) TOTAL GERAL A PAGAR NESTE MÊS (Salários Base + Comissões)', {
    font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: summaryMergeEnd } });
  setCell(currentRow, valueCol, formatCurrencyVal(totalPayrollToPay), {
    font: { name: 'Segoe UI', sz: 12, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  currentRow++;

  // Definir dimensões
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: currentRow - 1, c: numCols - 1 },
  });
  ws['!merges'] = merges;

  // Larguras adequadas
  if (includeNotes) {
    ws['!cols'] = [
      { wch: 30 }, // Nome do Funcionário
      { wch: 24 }, // Vendas do Funcionário
      { wch: 20 }, // Salário Base
      { wch: 18 }, // Comissão (%)
      { wch: 22 }, // Valor da Comissão
      { wch: 26 }, // TOTAL A RECEBER NO MÊS
      { wch: 32 }, // Observação
    ];
  } else {
    ws['!cols'] = [
      { wch: 34 }, // Nome do Funcionário
      { wch: 25 }, // Vendas do Funcionário
      { wch: 22 }, // Salário Base
      { wch: 18 }, // Comissão (%)
      { wch: 24 }, // Valor da Comissão
      { wch: 30 }, // TOTAL A RECEBER NO MÊS
    ];
  }

  // Altura das linhas de destaque
  const rowHeights: XLSX.RowInfo[] = [];
  rowHeights[0] = { hpt: 32 };
  rowHeights[1] = { hpt: 20 };
  rowHeights[2] = { hpt: 22 };
  rowHeights[3] = { hpt: 22 };
  ws['!rows'] = rowHeights;

  return ws;
}

/**
 * Cria a aba de Resumo Consolidado Geral da Rede
 */
function createConsolidatedStyledSheet(stores: Store[]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  let currentRow = 0;
  const numCols = 7;

  const setCell = (r: number, c: number, v: string | number, style: any = {}) => {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    ws[cellRef] = {
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: style,
    };
  };

  const setMergedRow = (r: number, startCol: number, endCol: number, val: string, style: any) => {
    for (let c = startCol; c <= endCol; c++) {
      setCell(r, c, c === startCol ? val : '', style);
    }
  };

  const merges: XLSX.Range[] = [];

  // Banner
  setMergedRow(currentRow, 0, numCols - 1, 'RESUMO CONSOLIDADO DE VENDAS E SALÁRIOS DA REDE DE ÓTICAS', {
    font: { name: 'Segoe UI', sz: 14, bold: true, color: { rgb: PALETTE.textWhite } },
    fill: { fgColor: { rgb: PALETTE.navyDark } },
    alignment: { horizontal: 'center', vertical: 'center' },
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: numCols - 1 } });
  currentRow++;

  // Subheader
  const now = new Date();
  const subTitle = `Emissão: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')} | Total de Lojas da Rede: ${stores.length}`;
  setMergedRow(currentRow, 0, numCols - 1, subTitle, {
    font: { name: 'Segoe UI', sz: 9.5, italic: true, color: { rgb: PALETTE.textMuted } },
    fill: { fgColor: { rgb: 'F8FAFC' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'medium', color: { rgb: PALETTE.navyDark } } },
  });
  merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: numCols - 1 } });
  currentRow++;
  currentRow++;

  // Headers
  const headers = [
    'Loja / Unidade',
    'Vendas da Loja',
    'Vendas da Equipe',
    'Funcionários',
    'Total Salários Base',
    'Total Comissões',
    'TOTAL A PAGAR NO MÊS (R$)',
  ];

  headers.forEach((h, colIdx) => {
    setCell(currentRow, colIdx, h, {
      font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textWhite } },
      fill: { fgColor: { rgb: PALETTE.navyHeader } },
      alignment: {
        horizontal: colIdx === 0 ? 'left' : 'right',
        vertical: 'center',
        wrapText: true,
      },
      border: BORDER_THIN,
    });
  });
  currentRow++;

  let netStoreSales = 0;
  let netGrossTeamSales = 0;
  let netBaseAll = 0;
  let netCommAll = 0;
  let netPayrollAll = 0;

  stores.forEach((store, idx) => {
    const bg = idx % 2 === 0 ? 'FFFFFF' : PALETTE.zebraRow;
    const sellers = store.sellers || [];

    const grossSales = sellers.reduce((sum, s) => sum + (s.salesAmount || 0), 0);
    const baseSalaries = sellers.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
    const commissions = sellers.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
    const storePayroll = sellers.reduce((sum, s) => sum + (s.totalSalary || 0), 0);

    netStoreSales += store.totalSales || 0;
    netGrossTeamSales += grossSales;
    netBaseAll += baseSalaries;
    netCommAll += commissions;
    netPayrollAll += storePayroll;

    setCell(currentRow, 0, store.name, {
      font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.textDark } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 1, formatCurrencyVal(store.totalSales), {
      font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 2, formatCurrencyVal(grossSales), {
      font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 3, sellers.length, {
      font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 4, formatCurrencyVal(baseSalaries), {
      font: { name: 'Segoe UI', sz: 9.5, color: { rgb: PALETTE.textDark } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 5, formatCurrencyVal(commissions), {
      font: { name: 'Segoe UI', sz: 9.5, bold: true, color: { rgb: PALETTE.greenBold } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: BORDER_THIN,
    });
    setCell(currentRow, 6, formatCurrencyVal(storePayroll), {
      font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.greenBold } },
      fill: { fgColor: { rgb: bg } },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: BORDER_THIN,
    });
    currentRow++;
  });

  // Linha TOTAL GERAL REDE
  setCell(currentRow, 0, 'TOTAL GERAL DA REDE', {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 1, formatCurrencyVal(netStoreSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 2, formatCurrencyVal(netGrossTeamSales), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 3, stores.reduce((acc, s) => acc + (s.sellers || []).length, 0), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 4, formatCurrencyVal(netBaseAll), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.textDark } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 5, formatCurrencyVal(netCommAll), {
    font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.navyLight } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  setCell(currentRow, 6, formatCurrencyVal(netPayrollAll), {
    font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: PALETTE.greenBold } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: BORDER_DOUBLE_BOTTOM,
  });
  currentRow++;

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: currentRow - 1, c: numCols - 1 },
  });
  ws['!merges'] = merges;
  ws['!cols'] = [
    { wch: 30 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
    { wch: 22 },
    { wch: 20 },
    { wch: 26 },
  ];

  return ws;
}

/**
 * Função pública para exportar fechamento completo para Excel (.xlsx)
 */
export function exportToExcel(stores: Store[], singleStoreId?: string) {
  if (!stores || stores.length === 0) {
    alert('Não há lojas cadastradas para exportar.');
    return;
  }

  const wb = XLSX.utils.book_new();
  const existingSheetNames = new Set<string>();

  if (singleStoreId) {
    const single = stores.find((s) => s.id === singleStoreId);
    if (!single) return;

    const sheetName = sanitizeSheetName(single.name, 0, existingSheetNames);
    const ws = createStoreStyledSheet(single);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const safeFileName = single.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Fechamento_Salarios_Vendas_${safeFileName}_${dateStr}.xlsx`);
    return;
  }

  // Exportar todas as lojas
  const summaryWs = createConsolidatedStyledSheet(stores);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo Geral');
  existingSheetNames.add('Resumo Geral');

  stores.forEach((store, index) => {
    const sheetName = sanitizeSheetName(store.name, index, existingSheetNames);
    const ws = createStoreStyledSheet(store);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Fechamento_Salarios_Vendas_Rede_${dateStr}.xlsx`);
}
