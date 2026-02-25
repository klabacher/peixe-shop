import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Input,
  IconButton,
} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CategoryManagerProps {
  products: any[];
}

export default function CategoryManager({ products }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  const getCategoryStats = (category: string) => {
    const categoryProducts = products.filter((p) => p.category === category);
    return {
      count: categoryProducts.length,
      totalStock: categoryProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
    };
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    alert(`A categoria "${newCategory}" ficará disponível ao adicionar um produto com essa categoria.`);
    setNewCategory('');
  };

  return (
    <Box>
      <Typography level="h4" sx={{ mb: 3 }}>
        Gerenciar Categorias
      </Typography>

      {/* Add New Category */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="title-md" sx={{ mb: 2 }}>
            Nova Categoria
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Input
              placeholder="Nome da categoria..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              sx={{ flex: 1 }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button
              startDecorator={<AddIcon />}
              onClick={handleAddCategory}
            >
              Adicionar
            </Button>
          </Box>
          <Typography level="body-sm" sx={{ mt: 1, color: 'text.tertiary' }}>
            As categorias são criadas automaticamente ao adicionar produtos. Use isso para pré-definir nomes.
          </Typography>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Categorias Existentes
      </Typography>

      {categories.length === 0 ? (
        <Card variant="soft">
          <CardContent>
            <Typography sx={{ textAlign: 'center' }}>
              Nenhuma categoria ainda. Adicione produtos para criar categorias.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            return (
              <Card key={category} variant="outlined">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography level="title-lg">{category}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip size="sm" color="primary">
                        {stats.count} produtos
                      </Chip>
                      <Chip size="sm" color="success">
                        {stats.totalStock} em estoque
                      </Chip>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="sm" variant="soft" disabled>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="sm" variant="soft" color="danger" disabled>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Info Card */}
      <Card variant="soft" color="primary" sx={{ mt: 3 }}>
        <CardContent>
          <Typography level="title-sm" sx={{ mb: 1 }}>
            💡 Dicas de Gerenciamento
          </Typography>
          <Typography level="body-sm">
            • Categorias são criadas automaticamente ao cadastrar produtos
            <br />
            • Use nomes consistentes (ex: "Peixes" e não "peixe" ou "PEIXE")
            <br />
            • Edite a categoria dos produtos para reorganizar o cardápio
            <br />
            • Para excluir uma categoria, mova ou exclua todos os produtos dela
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
