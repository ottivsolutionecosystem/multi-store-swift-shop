import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { usePromotionManagement } from '@/hooks/usePromotionManagement';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Percent, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PromotionFiltersComponent } from '@/components/admin/promotions/PromotionFilters';
import { PromotionViewToggle } from '@/components/admin/promotions/PromotionViewToggle';
import { PromotionListView } from '@/components/admin/promotions/PromotionListView';
import { PromotionTableView } from '@/components/admin/promotions/PromotionTableView';

export default function PromotionsPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const services = useServices();
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);

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

  const [stats, setStats] = useState({
    active: 0,
    scheduled: 0,
    totalSavings: 0
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    const loadPromotions = async () => {
      if (!services) return;

      try {
        const promotionsData = await services.promotionService.getAllPromotions();
        setPromotions(promotionsData);

        // Calculate stats usando o campo status
        const activeCount = promotionsData.filter(p => p.status === 'active').length;
        const scheduledCount = promotionsData.filter(p => p.status === 'scheduled').length;

        setStats({
          active: activeCount,
          scheduled: scheduledCount,
          totalSavings: 0 // This would need order data to calculate properly
        });
      } catch (error) {
        console.error('Erro ao carregar promoções:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar promoções',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    loadPromotions();
  }, [services, toast]);

  const handleCreatePromotion = () => {
    navigate('/admin/promotions/new');
  };

  const handleEditPromotion = (id: string) => {
    navigate(`/admin/promotions/${id}/edit`);
  };

  const handleDeletePromotion = async (id: string) => {
    if (!services) return;

    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

    try {
      await services.promotionService.deletePromotion(id);
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Promoção excluída com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir promoção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir promoção',
        variant: 'destructive',
      });
    }
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Promoções</h1>
            <p className="text-gray-600 mt-2">Crie e gerencie promoções para impulsionar suas vendas</p>
          </div>
          <Button onClick={handleCreatePromotion} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Promoção
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promoções Ativas</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">promoções em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promoções Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">próximas promoções</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Promoções</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPromotions}</div>
              <p className="text-xs text-muted-foreground">promoções criadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <PromotionFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            filteredCount={filteredCount}
            totalCount={totalPromotions}
          />
        </div>

        {/* View Toggle and Content */}
        {promotions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Suas Promoções</CardTitle>
                  <CardDescription>
                    Gerencie todas as suas promoções criadas
                  </CardDescription>
                </div>
                <PromotionViewToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'table' ? (
                <PromotionTableView
                  promotions={filteredPromotions}
                  sort={sort}
                  onSortChange={setSort}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              ) : (
                <PromotionListView
                  promotions={filteredPromotions}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {promotions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Percent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma promoção encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando sua primeira promoção para aumentar suas vendas
              </p>
              <Button onClick={handleCreatePromotion} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Criar Primeira Promoção
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
