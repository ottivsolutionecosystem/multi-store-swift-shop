
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePromotionManagement } from '@/hooks/usePromotionManagement';
import { usePromotionData } from '@/hooks/usePromotionData';
import { usePromotionActions } from '@/hooks/usePromotionActions';
import { Header } from '@/components/layout/Header';
import { PromotionHeader } from '@/components/admin/promotions/PromotionHeader';
import { PromotionStats } from '@/components/admin/promotions/PromotionStats';
import { PromotionFiltersComponent } from '@/components/admin/promotions/PromotionFilters';
import { PromotionContent } from '@/components/admin/promotions/PromotionContent';
import { PromotionEmptyState } from '@/components/admin/promotions/PromotionEmptyState';

export default function PromotionsPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const { promotions, isLoadingPromotions, stats, removePromotion } = usePromotionData();
  const { handleCreatePromotion, handleEditPromotion, handleDeletePromotion } = usePromotionActions();

  const {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    sort,
    setSort,
    filteredPromotions,
    totalPromotions,
    filteredCount,
  } = usePromotionManagement(promotions);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  const onDeletePromotion = (id: string) => {
    handleDeletePromotion(id, removePromotion);
  };

  if (loading || isLoadingPromotions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <PromotionHeader onCreatePromotion={handleCreatePromotion} />
        
        <PromotionStats stats={stats} totalPromotions={totalPromotions} />

        <div className="mb-6">
          <PromotionFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            filteredCount={filteredCount}
            totalCount={totalPromotions}
          />
        </div>

        {promotions.length > 0 ? (
          <PromotionContent
            promotions={filteredPromotions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sort={sort}
            onSortChange={setSort}
            onEdit={handleEditPromotion}
            onDelete={onDeletePromotion}
          />
        ) : (
          <PromotionEmptyState onCreatePromotion={handleCreatePromotion} />
        )}
      </main>
    </div>
  );
}
