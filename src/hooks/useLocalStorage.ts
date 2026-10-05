import { useState, useEffect } from 'react';
import { Store, Seller } from '../types/closing';

const STORAGE_KEY = 'fechafolha_stores_v1';
const LEGACY_STORAGE_KEY = 'otica_folha_stores_v1';
const ACTIVE_STORE_KEY = 'fechafolha_active_store_id_v1';
const LEGACY_ACTIVE_STORE_KEY = 'otica_folha_active_store_id_v1';

export function useClosingStore() {
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Store[];
        return parsed.map((s) => ({
          ...s,
          sellers: s.sellers || [],
        }));
      }
    } catch (err) {
      console.error('Falha ao carregar lojas do localStorage:', err);
    }
    return [];
  });

  const [activeStoreId, setActiveStoreIdState] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_STORE_KEY) || localStorage.getItem(LEGACY_ACTIVE_STORE_KEY);
      return savedId || null;
    } catch {
      return null;
    }
  });

  // Salvar no localStorage sempre que as lojas mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    } catch (err) {
      console.error('Falha ao salvar no localStorage:', err);
    }
  }, [stores]);

  // Salvar a loja ativa selecionada
  useEffect(() => {
    try {
      if (activeStoreId) {
        localStorage.setItem(ACTIVE_STORE_KEY, activeStoreId);
      } else {
        localStorage.removeItem(ACTIVE_STORE_KEY);
      }
    } catch (err) {
      console.error('Falha ao salvar activeStoreId:', err);
    }
  }, [activeStoreId]);

  // Se a loja ativa foi apagada ou não existe, seleciona a primeira disponível
  useEffect(() => {
    if (stores.length > 0) {
      const exists = stores.some((s) => s.id === activeStoreId);
      if (!exists) {
        setActiveStoreIdState(stores[0].id);
      }
    } else {
      setActiveStoreIdState(null);
    }
  }, [stores, activeStoreId]);

  const activeStore = stores.find((s) => s.id === activeStoreId) || null;

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
  };

  const addStore = (name: string, totalSales: number, period = ''): Store => {
    const newStore: Store = {
      id: `store_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      totalSales: Number(totalSales) || 0,
      period: period.trim() || undefined,
      sellers: [],
      includeNotes: false,
      updatedAt: new Date().toISOString(),
    };

    setStores((prev) => [...prev, newStore]);
    setActiveStoreIdState(newStore.id);
    return newStore;
  };

  const updateStore = (storeId: string, data: Partial<Store>) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? {
              ...store,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : store
      )
    );
  };

  const toggleStoreNotes = (storeId: string, forcedState?: boolean) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? {
              ...store,
              includeNotes: forcedState !== undefined ? forcedState : !store.includeNotes,
              updatedAt: new Date().toISOString(),
            }
          : store
      )
    );
  };

  const deleteStore = (storeId: string) => {
    setStores((prev) => {
      const filtered = prev.filter((s) => s.id !== storeId);
      if (activeStoreId === storeId) {
        setActiveStoreIdState(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const addSeller = (
    storeId: string,
    sellerData: Omit<Seller, 'id' | 'createdAt'>
  ) => {
    const newSeller: Seller = {
      ...sellerData,
      id: `seller_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== storeId) return store;
        return {
          ...store,
          sellers: [...store.sellers, newSeller],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateSeller = (
    storeId: string,
    sellerId: string,
    sellerData: Partial<Seller>
  ) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== storeId) return store;
        return {
          ...store,
          sellers: store.sellers.map((s) =>
            s.id === sellerId
              ? {
                  ...s,
                  ...sellerData,
                  totalSalary:
                    (sellerData.baseSalary !== undefined
                      ? sellerData.baseSalary
                      : s.baseSalary) +
                    (sellerData.commissionAmount !== undefined
                      ? sellerData.commissionAmount
                      : s.commissionAmount),
                }
              : s
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const removeSeller = (storeId: string, sellerId: string) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== storeId) return store;
        return {
          ...store,
          sellers: store.sellers.filter((s) => s.id !== sellerId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const clearAllData = () => {
    setStores([]);
    setActiveStoreIdState(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_STORE_KEY);
  };

  return {
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
    clearAllData,
  };
}
