
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { ProductOrganizationSection } from '@/components/admin/product-form/ProductOrganizationSection';
import { ProductPricingSection } from '@/components/admin/product-form/ProductPricingSection';
import { ProductInventorySection } from '@/components/admin/product-form/ProductInventorySection';
import { ProductShippingSection } from '@/components/admin/product-form/ProductShippingSection';
import { ProductSEOSection } from '@/components/admin/product-form/ProductSEOSection';
import { ArrowLeft } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Manufacturer = Database['public']['Tables']['manufacturers']['Row'];

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const services = useServices();
  const { loading: tenantLoading } = useTenant();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [formData, setFormData] = useState({
    // Informações básicas
    name: '',
    description: '',
    is_active: true,
    image_url: '',
    gallery_images: [] as string[],
    
    // Organização
    category_id: '',
    manufacturer_id: '',
    collections: [] as string[],
    tags: [] as string[],
    
    // Preços
    price: '',
    compare_at_price: '',
    cost_per_item: '',
    
    // Estoque
    stock_quantity: '',
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    sku: '',
    barcode: '',
    
    // Frete
    weight: '',
    
    // SEO
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (tenantLoading || !services) return;

      try {
        // Carregar categorias e fabricantes
        const [categoriesData, manufacturersData] = await Promise.all([
          services.categoryService.getAllCategories(),
          services.manufacturerService.getAllManufacturers()
        ]);
        
        setCategories(categoriesData);
        setManufacturers(manufacturersData);

        // Se for edição, carregar produto
        if (isEdit && id) {
          const product = await services.productService.getProductById(id);
          if (product) {
            setFormData({
              name: product.name,
              description: product.description || '',
              is_active: product.is_active,
              image_url: product.image_url || '',
              gallery_images: product.gallery_images || [],
              
              category_id: product.category_id || '',
              manufacturer_id: product.manufacturer_id || '',
              collections: product.collections || [],
              tags: product.tags || [],
              
              price: product.price.toString(),
              compare_at_price: product.compare_at_price?.toString() || '',
              cost_per_item: product.cost_per_item?.toString() || '',
              
              stock_quantity: product.stock_quantity.toString(),
              track_quantity: product.track_quantity,
              continue_selling_when_out_of_stock: product.continue_selling_when_out_of_stock,
              sku: product.sku || '',
              barcode: product.barcode || '',
              
              weight: product.weight?.toString() || '',
              
              seo_title: product.seo_title || '',
              seo_description: product.seo_description || ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados',
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, [services, tenantLoading, isEdit, id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!services) return;

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        is_active: formData.is_active,
        image_url: formData.image_url || null,
        gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : null,
        
        category_id: formData.category_id || null,
        manufacturer_id: formData.manufacturer_id === 'none' ? null : formData.manufacturer_id || null,
        collections: formData.collections.length > 0 ? formData.collections : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
        
        stock_quantity: parseInt(formData.stock_quantity),
        track_quantity: formData.track_quantity,
        continue_selling_when_out_of_stock: formData.continue_selling_when_out_of_stock,
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        
        weight: formData.weight ? parseFloat(formData.weight) : null,
        
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null
      };

      if (isEdit && id) {
        await services.productService.updateProduct(id, productData);
        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso',
        });
      } else {
        await services.productService.createProduct(productData);
        toast({
          title: 'Sucesso',
          description: 'Produto criado com sucesso',
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/products')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Produtos
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(value) => setFormData({...formData, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma categoria</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="active">Produto Ativo</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Organização */}
              <ProductOrganizationSection
                manufacturerId={formData.manufacturer_id}
                collections={formData.collections}
                tags={formData.tags}
                manufacturers={manufacturers}
                onManufacturerChange={(value) => setFormData({...formData, manufacturer_id: value})}
                onCollectionsChange={(collections) => setFormData({...formData, collections})}
                onTagsChange={(tags) => setFormData({...formData, tags})}
              />

              {/* Preços */}
              <ProductPricingSection
                price={formData.price}
                compareAtPrice={formData.compare_at_price}
                costPerItem={formData.cost_per_item}
                onPriceChange={(value) => setFormData({...formData, price: value})}
                onCompareAtPriceChange={(value) => setFormData({...formData, compare_at_price: value})}
                onCostPerItemChange={(value) => setFormData({...formData, cost_per_item: value})}
              />

              {/* Estoque */}
              <ProductInventorySection
                stockQuantity={formData.stock_quantity}
                trackQuantity={formData.track_quantity}
                continueSellingWhenOutOfStock={formData.continue_selling_when_out_of_stock}
                sku={formData.sku}
                barcode={formData.barcode}
                onStockQuantityChange={(value) => setFormData({...formData, stock_quantity: value})}
                onTrackQuantityChange={(value) => setFormData({...formData, track_quantity: value})}
                onContinueSellingChange={(value) => setFormData({...formData, continue_selling_when_out_of_stock: value})}
                onSkuChange={(value) => setFormData({...formData, sku: value})}
                onBarcodeChange={(value) => setFormData({...formData, barcode: value})}
              />

              {/* Frete */}
              <ProductShippingSection
                weight={formData.weight}
                onWeightChange={(value) => setFormData({...formData, weight: value})}
              />

              {/* SEO */}
              <ProductSEOSection
                seoTitle={formData.seo_title}
                seoDescription={formData.seo_description}
                onSeoTitleChange={(value) => setFormData({...formData, seo_title: value})}
                onSeoDescriptionChange={(value) => setFormData({...formData, seo_description: value})}
              />
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
              {/* Imagens */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Imagem Principal</Label>
                    <ImageUpload
                      bucket="product-images"
                      folder="products"
                      value={formData.image_url}
                      onChange={(url) => setFormData({...formData, image_url: url || ''})}
                    />
                  </div>

                  <div>
                    <Label>Galeria de Imagens</Label>
                    <ImageGalleryUpload
                      bucket="product-images"
                      folder="products"
                      value={formData.gallery_images}
                      onChange={(urls) => setFormData({...formData, gallery_images: urls})}
                      maxImages={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')} Produto
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
