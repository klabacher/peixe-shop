import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Sheet,
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { deleteProduct } from '../../firebase/admin';

interface ProductListProps {
  products: any[];
  loading: boolean;
  onEdit: (product: any) => void;
}

export default function ProductList({ products, loading, onEdit }: ProductListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(productId);
    try {
      await deleteProduct(productId);
      alert('Product deleted successfully!');
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Card variant="soft">
        <CardContent>
          <Typography level="body-lg" sx={{ textAlign: 'center' }}>
            No products yet. Click "Add Product" to create your first item.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {products.map((product) => (
        <Card key={product.id} variant="outlined">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Product Image Placeholder */}
            <Sheet
              sx={{
                width: 100,
                height: 100,
                borderRadius: 'sm',
                bgcolor: 'background.level2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography level="h1">🐟</Typography>
            </Sheet>

            {/* Product Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  mb: 1,
                }}
              >
                <Box>
                  <Typography level="title-lg">{product.name}</Typography>
                  <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                    {product.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="sm"
                    variant="soft"
                    color="primary"
                    onClick={() => onEdit(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="soft"
                    color="danger"
                    onClick={() => handleDelete(product.id, product.name)}
                    loading={deleting === product.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography level="body-sm" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip size="sm" color="success">
                  R$ {product.price?.toFixed(2)}
                </Chip>
                {product.originalPrice && (
                  <Chip size="sm" variant="soft">
                    <del>R$ {product.originalPrice?.toFixed(2)}</del>
                  </Chip>
                )}
                <Chip
                  size="sm"
                  color={product.stock > 10 ? 'success' : 'warning'}
                  startDecorator={product.stock < 10 ? <WarningIcon /> : null}
                >
                  Stock: {product.stock}
                </Chip>
                <Chip size="sm" variant="outlined">
                  {product.unit}
                </Chip>
                {product.isBestSeller && (
                  <Chip size="sm" color="primary">
                    ⭐ Best Seller
                  </Chip>
                )}
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
