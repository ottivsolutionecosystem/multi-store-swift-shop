
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Manufacturer = Database['public']['Tables']['manufacturers']['Row'];

interface ProductOrganizationSectionProps {
  manufacturerId: string;
  collections: string[];
  tags: string[];
  manufacturers: Manufacturer[];
  onManufacturerChange: (value: string) => void;
  onCollectionsChange: (collections: string[]) => void;
  onTagsChange: (tags: string[]) => void;
}

export function ProductOrganizationSection({
  manufacturerId,
  collections,
  tags,
  manufacturers,
  onManufacturerChange,
  onCollectionsChange,
  onTagsChange
}: ProductOrganizationSectionProps) {
  const [newCollection, setNewCollection] = React.useState('');
  const [newTag, setNewTag] = React.useState('');

  const addCollection = () => {
    if (newCollection.trim() && !collections.includes(newCollection.trim())) {
      onCollectionsChange([...collections, newCollection.trim()]);
      setNewCollection('');
    }
  };

  const removeCollection = (index: number) => {
    const newCollections = collections.filter((_, i) => i !== index);
    onCollectionsChange(newCollections);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="manufacturer">Fabricante</Label>
          <Select value={manufacturerId} onValueChange={onManufacturerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fabricante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum fabricante</SelectItem>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Coleções</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nome da coleção"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCollection()}
            />
            <Button type="button" onClick={addCollection} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {collections.map((collection, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {collection}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeCollection(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nome da tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
