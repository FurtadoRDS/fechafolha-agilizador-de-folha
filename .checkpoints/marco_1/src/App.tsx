import { useState } from 'react';
import { useClosingStore } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { StoreHeader } from './components/StoreHeader';
import { SellerForm } from './components/SellerForm';
import { SellerTable } from './components/SellerTable';
import { StoreModal } from './components/StoreModal';
import { EditSellerModal } from './components/EditSellerModal';
import { EmptyState } from './components/EmptyState';
import { ConsolidatedViewModal } from './components/ConsolidatedViewModal';
import { exportToExcel } from './utils/excelExport';
import { Seller, Store } from './types/closing';
import {
  Building2,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const {
    stores,
    activeStoreId,
    activeStore,
    setActiveStoreId,
    addStore,
    updateStore,
    deleteStore,
    addSeller,
    updateSeller,
    removeSeller,
    toggleStoreNotes,
  } = useClosingStore();

  // Modais state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<Store | null>(null);

  const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
  const [isEditSellerModalOpen, setIsEditSellerModalOpen] = useState(false);

  const [isConsolidatedModalOpen, setIsConsolidatedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers para lojas
  const handleOpenNewStoreModal = () => {
    setStoreToEdit(null);
    setIsStoreModalOpen(true);
  };

  const handleOpenEditStoreModal = () => {
    if (activeStore) {
      setStoreToEdit(activeStore);
      setIsStoreModalOpen(true);
    }
  };

  const handleSaveStore = (name: string, totalSales: number, period?: string) => {
    if (storeToEdit) {
      updateStore(storeToEdit.id, { name, totalSales, period });
      showToast(`Loja "${name}" atualizada com sucesso!`);
    } else {
      const created = addStore(name, totalSales, period);
      showToast(`Loja "${created.name}" cadastrada com sucesso!`);
    }
  };

  const handleDeleteStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    deleteStore(storeId);
    showToast(`Loja "${store?.name || ''}" foi removida.`);
  };

  // Handlers para vendedores / funcionários
  const handleAddSeller = (sellerData: Omit<Seller, 'id' | 'createdAt'>) => {
    if (!activeStore) return;
    addSeller(activeStore.id, sellerData);
    showToast(`Funcionário "${sellerData.name}" adicionado com sucesso!`);
  };

  const handleOpenEditSeller = (seller: Seller) => {
    setSellerToEdit(seller);
    setIsEditSellerModalOpen(true);
  };

  const handleSaveEditedSeller = (updatedData: Partial<Seller>) => {
    if (!activeStore || !sellerToEdit) return;
    updateSeller(activeStore.id, sellerToEdit.id, updatedData);
    showToast(`Dados de "${updatedData.name || sellerToEdit.name}" atualizados!`);
  };

  const handleRemoveSeller = (sellerId: string) => {
    if (!activeStore) return;
    removeSeller(activeStore.id, sellerId);
    showToast('Funcionário removido do fechamento.');
  };

  // Exportações Excel com layout profissional
  const handleExportAll = () => {
    if (stores.length === 0) return;
    exportToExcel(stores);
    showToast('Planilha Excel (.xlsx) gerada com sucesso para toda a rede!');
  };

  const handleExportCurrent = () => {
    if (!activeStore) return;
    exportToExcel(stores, activeStore.id);
    showToast(`Planilha da loja "${activeStore.name}" exportada com sucesso!`);
  };

  const sellers = activeStore?.sellers || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <Header
        stores={stores}
        activeStoreId={activeStoreId}
        onSelectStore={setActiveStoreId}
        onOpenNewStoreModal={handleOpenNewStoreModal}
        onExportAllExcel={handleExportAll}
        onExportCurrentStoreExcel={handleExportCurrent}
        onOpenStoreSettings={handleOpenEditStoreModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {stores.length === 0 ? (
          /* Empty State when no stores are configured yet */
          <EmptyState
            onAddFirstStore={(name, totalSales, period) => {
              addStore(name, totalSales, period);
              showToast(`Loja "${name}" cadastrada! Agora você já pode lançar os funcionários.`);
            }}
          />
        ) : activeStore ? (
          <div>
            {/* Store Navigation Bar (when multiple stores exist) */}
            {stores.length > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                  <span className="text-xs font-medium text-slate-400 mr-1 shrink-0">Lojas da Rede:</span>
                  {stores.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveStoreId(s.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        s.id === activeStoreId
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {s.name} ({s.sellers.length})
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleOpenNewStoreModal}
                    title="Adicionar mais uma loja"
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsConsolidatedModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Visão Consolidada ({stores.length} lojas)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Store Header & Financial KPIs */}
            <StoreHeader
              store={activeStore}
              onEditStore={handleOpenEditStoreModal}
            />

            {/* Formulário de Funcionários */}
            <SellerForm
              onAddSeller={handleAddSeller}
              isNotesColumnEnabled={Boolean(activeStore.includeNotes)}
              onToggleNotesColumn={() => {
                toggleStoreNotes(activeStore.id);
                showToast(
                  activeStore.includeNotes
                    ? 'Coluna Observação desabilitada na planilha e na tabela.'
                    : 'Coluna Observação habilitada na planilha e na tabela!'
                );
              }}
            />

            {/* Tabela de Vendas, Salários e Comissões */}
            <SellerTable
              sellers={sellers}
              onEditSeller={handleOpenEditSeller}
              onRemoveSeller={handleRemoveSeller}
              isNotesColumnEnabled={Boolean(activeStore.includeNotes)}
              onToggleNotesColumn={() => {
                toggleStoreNotes(activeStore.id);
                showToast(
                  activeStore.includeNotes
                    ? 'Coluna Observação desabilitada na planilha e na tabela.'
                    : 'Coluna Observação habilitada na planilha e na tabela!'
                );
              }}
            />

            {/* Floating Action Banner */}
            {sellers.length > 0 && (
              <div className="mt-8 p-5 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Fechamento de Salários e Vendas da Loja Pronto para Exportação</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gera planilha oficial com vendas separadas por funcionário, salário base, comissão, total a receber no mês (base + comissão) e soma total da folha no rodapé.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportCurrent}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Exportar Apenas Esta Loja
                  </button>
                  <button
                    type="button"
                    onClick={handleExportAll}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Exportar Rede Completa (.xlsx)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ÓticaFolha · Fechamento de Salários e Comissões de Rede de Óticas</span>
          <span className="text-[11px] text-slate-400">Armazenamento local (localStorage) · Exportação Excel (.xlsx)</span>
        </div>
      </footer>

      {/* Store Add/Edit Modal */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSave={handleSaveStore}
        onDelete={handleDeleteStore}
        storeToEdit={storeToEdit}
      />

      {/* Seller Edit Modal */}
      <EditSellerModal
        isOpen={isEditSellerModalOpen}
        seller={sellerToEdit}
        onClose={() => {
          setIsEditSellerModalOpen(false);
          setSellerToEdit(null);
        }}
        onSave={handleSaveEditedSeller}
      />

      {/* Network Consolidated View Modal */}
      <ConsolidatedViewModal
        isOpen={isConsolidatedModalOpen}
        onClose={() => setIsConsolidatedModalOpen(false)}
        stores={stores}
        onExportExcel={handleExportAll}
        onSelectStore={(id) => setActiveStoreId(id)}
      />
    </div>
  );
}
