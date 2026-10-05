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
import { DeleteStoreModal } from './components/DeleteStoreModal';
import { exportToExcel } from './utils/excelExport';
import { Seller, Store, ExportDeviceMode } from './types/closing';
import {
  Building2,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Smartphone,
  Monitor,
  Home,
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

  // Visualização: Dashboard da loja ou Tela Inicial (aba de cadastrar loja)
  const [isHomeScreen, setIsHomeScreen] = useState(false);

  // Modais state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<Store | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);

  const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
  const [isEditSellerModalOpen, setIsEditSellerModalOpen] = useState(false);

  const [isConsolidatedModalOpen, setIsConsolidatedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modo de exportação: Celular (Mobile) ou Desktop
  const [deviceMode, setDeviceMode] = useState<ExportDeviceMode>(() => {
    try {
      const saved =
        localStorage.getItem('fechafolha_export_device_mode_v1') ||
        localStorage.getItem('otica_folha_export_device_mode_v1');
      if (saved === 'desktop' || saved === 'mobile') return saved;
    } catch {}
    return 'mobile';
  });

  const handleSetDeviceMode = (mode: ExportDeviceMode) => {
    setDeviceMode(mode);
    try {
      localStorage.setItem('fechafolha_export_device_mode_v1', mode);
    } catch {}
    showToast(
      mode === 'mobile'
        ? 'Modo Celular Ativado: Planilha compacta sem corte lateral, ideal para WhatsApp e celular.'
        : 'Modo Desktop Ativado: Planilha completa expandida para computador.'
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers para navegação e lojas
  const handleNavigateHome = () => {
    setIsHomeScreen(true);
  };

  const handleSelectStore = (id: string) => {
    setActiveStoreId(id);
    setIsHomeScreen(false);
  };

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
      setIsHomeScreen(false);
      showToast(`Loja "${created.name}" cadastrada com sucesso!`);
    }
  };

  const handlePromptDeleteStore = (store: Store) => {
    setStoreToDelete(store);
  };

  const handleConfirmDeleteStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    const storeName = store?.name || '';
    deleteStore(storeId);
    setStoreToDelete(null);
    showToast(`Loja "${storeName}" foi excluída permanentemente.`);
    // Se não restarem lojas, volta para a tela inicial automaticamente
    if (stores.length <= 1) {
      setIsHomeScreen(true);
    }
  };

  const handleDeleteStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      handlePromptDeleteStore(store);
    } else {
      deleteStore(storeId);
    }
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

  // Exportações Excel com escolha de Celular vs Desktop
  const handleExportAll = (modeOverride?: ExportDeviceMode) => {
    if (stores.length === 0) return;
    const mode = modeOverride || deviceMode;
    exportToExcel(stores, undefined, mode);
    showToast(
      `Planilha da Rede exportada para formato ${mode === 'mobile' ? 'Celular' : 'Desktop'}!`
    );
  };

  const handleExportCurrent = (modeOverride?: ExportDeviceMode) => {
    if (!activeStore) return;
    const mode = modeOverride || deviceMode;
    exportToExcel(stores, activeStore.id, mode);
    showToast(
      `Planilha da loja "${activeStore.name}" exportada para formato ${mode === 'mobile' ? 'Celular' : 'Desktop'}!`
    );
  };

  // Handlers de exportação com feedback tátil de sucesso
  const [activeExportAction, setActiveExportAction] = useState<string | null>(null);

  const handleExportWithTactile = (type: string, action: () => void) => {
    setActiveExportAction(type);
    action();
    setTimeout(() => {
      setActiveExportAction(null);
    }, 1000);
  };

  const sellers = activeStore?.sellers || [];

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-sans selection:bg-emerald-500 selection:text-white bg-[url('/bg-waves.jpg')] bg-cover bg-center bg-fixed">
      {/* Toast Notification (High-End Dark Glass) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0D0F17]/95 backdrop-blur-xl text-white text-xs font-medium rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.8)] border border-white/15 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <Header
        stores={stores}
        activeStoreId={activeStoreId}
        deviceMode={deviceMode}
        isHomeScreen={isHomeScreen}
        onNavigateHome={handleNavigateHome}
        onChangeDeviceMode={handleSetDeviceMode}
        onSelectStore={handleSelectStore}
        onOpenNewStoreModal={handleOpenNewStoreModal}
        onExportAllExcel={handleExportAll}
        onExportCurrentStoreExcel={handleExportCurrent}
        onOpenStoreSettings={handleOpenEditStoreModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {stores.length === 0 || isHomeScreen ? (
          /* Empty State / Initial Screen (Aba de Cadastrar Loja) */
          <EmptyState
            existingStoresCount={stores.length}
            activeStoreName={activeStore?.name}
            stores={stores}
            onBackToDashboard={stores.length > 0 ? () => setIsHomeScreen(false) : undefined}
            onSelectStore={handleSelectStore}
            onDeleteStore={handlePromptDeleteStore}
            onAddFirstStore={(name, totalSales, period) => {
              const created = addStore(name, totalSales, period);
              setIsHomeScreen(false);
              showToast(`Loja "${created.name}" cadastrada! Agora você já pode lançar os funcionários.`);
            }}
          />
        ) : activeStore ? (
          <div>
            {/* Store Navigation Bar (quando existem lojas na rede) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-white/8">
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                {/* Botão de Voltar para Tela Inicial / Criar Loja */}
                <button
                  type="button"
                  onClick={handleNavigateHome}
                  title="Voltar para a tela inicial (aba de criar loja)"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white hover:-translate-y-0.5"
                >
                  <Home className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Início (Criar Loja)</span>
                </button>

                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mx-1 shrink-0">
                  Lojas:
                </span>
                {stores.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStore(s.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      s.id === activeStoreId
                        ? 'bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:-translate-y-0.5'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors hover:-translate-y-0.5'
                    }`}
                  >
                    {s.name} ({s.sellers.length})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleOpenNewStoreModal}
                  title="Adicionar mais uma loja à rede via modal"
                  className="p-1.5 text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer hover:-translate-y-0.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsConsolidatedModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visão Consolidada ({stores.length} {stores.length === 1 ? 'loja' : 'lojas'})</span>
                </button>
              </div>
            </div>

            {/* Store Header & Financial KPIs */}
            <StoreHeader
              store={activeStore}
              onEditStore={handleOpenEditStoreModal}
              onNavigateHome={handleNavigateHome}
              onDeleteStore={() => handlePromptDeleteStore(activeStore)}
              onExportStoreExcel={(mode) => handleExportCurrent(mode)}
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

            {/* Floating Action Banner (Luxury Glassmorphism with Linear Glow) */}
            {sellers.length > 0 && (
              <div className="mt-8 p-6 rounded-2xl bg-[#0D0F17]/90 backdrop-blur-md text-white border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 hover:border-white/15 animate-in fade-in slide-in-from-bottom-2">
                {/* Top ambient highlight line */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-300">
                        Exportação de Fechamento para Excel (.xlsx)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {deviceMode === 'mobile'
                        ? 'Modo Celular Ativo: Planilha compacta sem corte lateral, com fontes maiores (11-13pt) e cabeçalho vertical. O usuário final consegue abrir e ler tudo com facilidade diretamente na tela do smartphone (WhatsApp, Excel Mobile).'
                        : 'Modo Desktop Ativo: Planilha executiva completa com todas as colunas detalhadas e formato expandido para tela de computador.'}
                    </p>

                    {/* Selector de Modo Celular vs Desktop */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <span className="text-xs font-mono uppercase text-slate-400">
                        Modo da Planilha:
                      </span>
                      <div className="inline-flex items-center bg-white/3 p-1 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleSetDeviceMode('mobile')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                            deviceMode === 'mobile'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Celular / WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetDeviceMode('desktop')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                            deviceMode === 'desktop'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Desktop (Completo)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Export Action Buttons with tactile feedback */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => handleExportWithTactile('current-mobile', () => handleExportCurrent('mobile'))}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                        deviceMode === 'mobile'
                          ? 'bg-linear-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      }`}
                      title="Exportar planilha desta loja com layout para celular"
                    >
                      {activeExportAction === 'current-mobile' ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                      <span>Exportar Loja (Celular)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportWithTactile('current-desktop', () => handleExportCurrent('desktop'))}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                        deviceMode === 'desktop'
                          ? 'bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                          : 'bg-white/4 hover:bg-white/8 text-slate-300 border border-white/10 hover:border-white/20'
                      }`}
                      title="Exportar planilha desta loja com layout para computador"
                    >
                      {activeExportAction === 'current-desktop' ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" />
                      ) : (
                        <Monitor className="w-4 h-4 text-cyan-400" />
                      )}
                      <span>Exportar Loja (Desktop)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportWithTactile('all', () => handleExportAll())}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                      title="Exportar todas as lojas da rede no formato selecionado"
                    >
                      {activeExportAction === 'all' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>Exportar Rede Completa</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Footer (Dark Luxury Glassmorphic Style) */}
      <footer className="mt-auto border-t border-white/10 bg-[#090A0F]/80 backdrop-blur-md py-5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">FechaFolha</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Fechamento de Salários e Comissões de Lojas</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Exportação para Excel: Otimizada para Celular (WhatsApp) & Desktop
          </span>
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

      {/* Delete Store Confirmation Modal */}
      <DeleteStoreModal
        isOpen={!!storeToDelete}
        store={storeToDelete}
        onClose={() => setStoreToDelete(null)}
        onConfirmDelete={handleConfirmDeleteStore}
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
        deviceMode={deviceMode}
        onExportExcel={(mode) => handleExportAll(mode)}
        onSelectStore={handleSelectStore}
      />
    </div>
  );
}
