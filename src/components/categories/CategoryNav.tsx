import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { Database } from '@/integrations/supabase/types';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryWithSubs = Category & { subcategories?: Category[] };

interface CategoryNavProps {
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategoryId?: string | null;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ 
  onCategorySelect, 
  selectedCategoryId 
}) => {
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const services = useServices();
  const { loading: tenantLoading } = useTenant();

  useEffect(() => {
    const loadCategories = async () => {
      if (tenantLoading || !services) {
        return;
      }

      try {
        const categoriesData = await services.categoryService.getCategoriesWithSubcategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [services, tenantLoading]);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    onCategorySelect?.(categoryId);
  };

  const renderCategoryIcon = (category: Category) => {
    if (category.image_url) {
      return (
        <img 
          src={category.image_url} 
          alt={category.name}
          className="h-5 w-5 object-cover rounded"
        />
      );
    }
    return <Tag className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
          selectedCategoryId === null
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Tag className="h-4 w-4" />
        <span>Todos os Produtos</span>
      </button>
      
      {categories.map((category) => (
        <div key={category.id} className="space-y-1">
          <div className="flex items-center">
            {category.subcategories && category.subcategories.length > 0 && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategoryId === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${
                category.subcategories && category.subcategories.length > 0 
                  ? '' 
                  : 'ml-6'
              }`}
            >
              {renderCategoryIcon(category)}
              <span>{category.name}</span>
            </button>
          </div>
          
          {expandedCategories.has(category.id) && category.subcategories && (
            <div className="ml-6 space-y-1">
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleCategoryClick(subcategory.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                    selectedCategoryId === subcategory.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {renderCategoryIcon(subcategory)}
                  <span>{subcategory.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
