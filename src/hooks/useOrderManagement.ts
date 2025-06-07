
import { useState, useEffect } from 'react';
import { OrderViewMode, OrderFilters, OrderSort, OrderManagementState } from '@/types/order-management';

const STORAGE_KEY = 'order-management-state';

const defaultState: OrderManagementState = {
  viewMode: 'list',
  filters: {},
  sort: {
    field: 'created_at',
    direction: 'desc',
  },
};

export function useOrderManagement() {
  const [state, setState] = useState<OrderManagementState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (error) {
      console.error('Error loading order management state:', error);
    }
    return defaultState;
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving order management state:', error);
    }
  }, [state]);

  const setViewMode = (viewMode: OrderViewMode) => {
    setState(prev => ({ ...prev, viewMode }));
  };

  const setFilters = (filters: OrderFilters) => {
    setState(prev => ({ ...prev, filters }));
  };

  const setSort = (sort: OrderSort) => {
    setState(prev => ({ ...prev, sort }));
  };

  const resetFilters = () => {
    setState(prev => ({ ...prev, filters: {} }));
  };

  return {
    ...state,
    setViewMode,
    setFilters,
    setSort,
    resetFilters,
  };
}
