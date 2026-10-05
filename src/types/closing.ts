export type CommissionType = 'percentage' | 'fixed';
export type ExportDeviceMode = 'mobile' | 'desktop';

export interface Seller {
  id: string;
  name: string;
  salesAmount: number; // Total de Vendas do Vendedor (R$)
  baseSalary: number; // Salário Base (R$)
  commissionType: CommissionType; // Porcentagem ou Valor Fixo
  commissionRate: number; // % (ex: 2.5) ou valor fixo em R$ se commissionType === 'fixed'
  commissionAmount: number; // Valor final calculado da comissão em R$
  totalSalary: number; // Salário Base + Comissão (Quanto vai receber esse mês)
  notes?: string; // Observação sobre o vendedor/comissão
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  totalSales: number; // Total de Vendas da Loja (R$)
  period?: string; // Mês/Ano de referência (ex: "Outubro/2026")
  sellers: Seller[];
  includeNotes?: boolean; // Se a coluna de observação está habilitada na visualização e no Excel
  updatedAt: string;
}

export interface StoreSummary {
  storeId: string;
  storeName: string;
  storeSales: number;
  totalSellersSales: number;
  sellersCount: number;
  totalBaseSalaries: number;
  totalCommissions: number;
  totalPayrollToPay: number; // Salários Base + Comissões a pagar no mês
}
