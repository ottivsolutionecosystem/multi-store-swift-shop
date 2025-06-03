
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryFormFields } from '@/components/admin/categories/CategoryFormFields';
import { CategoryImageUpload } from '@/components/admin/categories/CategoryImageUpload';
import { useCategoryForm } from '@/hooks/useCategoryForm';
import { ArrowLeft } from 'lucide-react';

export default function CategoryFormPage() {
  const { id } = useParams();
  const {
    formData,
    updateFormData,
    categories,
    loading,
    isEdit,
    handleSubmit,
    navigate
  } = useCategoryForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/categories')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Categorias
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryFormFields
                formData={formData}
                categories={categories}
                loading={loading}
                isEdit={isEdit}
                categoryId={id}
                onFormDataChange={updateFormData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/categories')}
              />
            </CardContent>
          </Card>

          <CategoryImageUpload
            imageUrl={formData.image_url}
            onImageChange={(url) => updateFormData({ image_url: url })}
          />
        </div>
      </main>
    </div>
  );
}
