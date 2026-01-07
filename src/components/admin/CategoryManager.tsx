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
    alert(`Category "${newCategory}" will be available when you add a product with this category.`);
    setNewCategory('');
  };

  return (
    <Box>
      <Typography level="h4" sx={{ mb: 3 }}>
        Manage Categories
      </Typography>

      {/* Add New Category */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="title-md" sx={{ mb: 2 }}>
            Add New Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Input
              placeholder="Enter category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              sx={{ flex: 1 }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button
              startDecorator={<AddIcon />}
              onClick={handleAddCategory}
            >
              Add
            </Button>
          </Box>
          <Typography level="body-sm" sx={{ mt: 1, color: 'text.tertiary' }}>
            Categories are automatically created when you add products. This helps you pre-define them.
          </Typography>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Existing Categories
      </Typography>

      {categories.length === 0 ? (
        <Card variant="soft">
          <CardContent>
            <Typography sx={{ textAlign: 'center' }}>
              No categories yet. Add products to create categories.
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
                        {stats.count} products
                      </Chip>
                      <Chip size="sm" color="success">
                        {stats.totalStock} total stock
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
            💡 Category Management Tips
          </Typography>
          <Typography level="body-sm">
            • Categories are created automatically from products
            <br />
            • Use consistent naming (e.g., "Peixes" not "peixe" or "Peixe")
            <br />
            • Edit product categories to reorganize items
            <br />
            • Delete all products in a category to remove it
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
