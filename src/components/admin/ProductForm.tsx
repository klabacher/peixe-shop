import { useState, useEffect } from 'react';
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  Box,
  Switch,
  Grid,
  Divider,
} from '@mui/joy';
import { createProduct, updateProduct } from '../../firebase/admin';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: any;
}

const CATEGORIES = [
  'Peixes',
  'Frutos do Mar',
  'Combos',
  'Bebidas',
  'Temperos',
  'Outros',
];

const UNITS = ['kg', 'un', 'kit', 'pacote', 'litro'];

export default function ProductForm({ open, onClose, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Peixes',
    price: '',
    originalPrice: '',
    unit: 'kg',
    description: '',
    stock: '',
    image: '',
    isBestSeller: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Peixes',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        unit: product.unit || 'kg',
        description: product.description || '',
        stock: product.stock?.toString() || '',
        image: product.image || '',
        isBestSeller: product.isBestSeller || false,
      });
    }
  }, [product]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : null,
        unit: formData.unit,
        description: formData.description,
        stock: parseInt(formData.stock),
        image: formData.image || '/images/placeholder.jpg',
        isBestSeller: formData.isBestSeller,
      };

      if (product?.id) {
        await updateProduct(product.id, productData);
        alert('Product updated successfully!');
      } else {
        await createProduct(productData);
        alert('Product created successfully!');
      }

      onClose();
      // Force refresh
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ minWidth: 600, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormControl required>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Salmão Fresco"
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl required>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(_, value) => handleChange('category', value)}
                >
                  {CATEGORIES.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl required>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={formData.unit}
                  onChange={(_, value) => handleChange('unit', value)}
                >
                  {UNITS.map((unit) => (
                    <Option key={unit} value={unit}>
                      {unit}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl required>
                <FormLabel>Price (R$)</FormLabel>
                <Input
                  type="number"
                  slotProps={{
                    input: {
                      step: '0.01',
                    },
                  }}
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="89.90"
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel>Original Price (R$) - Optional</FormLabel>
                <Input
                  type="number"
                  slotProps={{
                    input: {
                      step: '0.01',
                    },
                  }}
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  placeholder="99.90"
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl required>
                <FormLabel>Stock Quantity</FormLabel>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="50"
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl required>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Product description..."
                  minRows={3}
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl>
                <FormLabel>Image URL - Optional</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="/images/product.jpg"
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <FormLabel>Best Seller</FormLabel>
                  <Typography level="body-sm">
                    Show this product in "Mais Pedidos"
                  </Typography>
                </Box>
                <Switch
                  checked={formData.isBestSeller}
                  onChange={(e) => handleChange('isBestSeller', e.target.checked)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="plain" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {product ? 'Update' : 'Create'} Product
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
}
