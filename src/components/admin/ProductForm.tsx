import { useState, useEffect, useRef } from 'react';
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
  Alert,
  AspectRatio,
  Sheet,
} from '@mui/joy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { createProduct, updateProduct } from '../../firebase/admin';
import { uploadImage, DEFAULT_PRODUCT_IMAGE } from '../../supabase';
import { clearFirestoreCache } from '../../firebase/firestore';
import type { Product } from '../../types/product';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved?: () => void;
  categories?: string[];
}

type ProductFormData = {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  unit: string;
  description: string;
  stock: string;
  image: string;
  isBestSeller: boolean;
  isVisible: boolean;
};

const DEFAULT_CATEGORIES = [
  'Peixes',
  'Frutos do Mar',
  'Combos',
  'Bebidas',
  'Temperos',
  'Outros',
];

const UNITS = ['kg', 'un', 'kit', 'pacote', 'litro'];

export default function ProductForm({ open, onClose, product, onSaved, categories }: ProductFormProps) {
  const CATEGORIES = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultCategory = CATEGORIES[0] ?? 'Peixes';

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: defaultCategory,
    price: '',
    originalPrice: '',
    unit: 'kg',
    description: '',
    stock: '',
    image: '',
    isBestSeller: false,
    isVisible: true,
  });

  useEffect(() => {
    if (!open) return;

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
        isVisible: product.isVisible !== false,
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        name: '',
        category: defaultCategory,
        price: '',
        originalPrice: '',
        unit: 'kg',
        description: '',
        stock: '',
        image: '',
        isBestSeller: false,
        isVisible: true,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setUploadProgress('');
  }, [defaultCategory, open, product]);

  const handleChange = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Apenas imagens são permitidas');
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress('');

    try {
      let imageUrl = formData.image || DEFAULT_PRODUCT_IMAGE;

      // Upload new image if selected
      if (imageFile) {
        setUploadProgress('Enviando imagem...');
        imageUrl = await uploadImage(imageFile, 'products');
        setUploadProgress('Imagem enviada!');
      }

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
        image: imageUrl,
        isBestSeller: formData.isBestSeller,
        isVisible: formData.isVisible,
      };

      if (product?.id) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      clearFirestoreCache();
      onClose();
      if (onSaved) {
        onSaved();
      } else {
        window.location.reload();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar produto';
      alert(`Erro: ${message}`);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const hasNoImage = !imageFile && !formData.image;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ minWidth: { xs: '95vw', sm: 600 }, maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto' }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          {product ? 'Editar Produto' : 'Novo Produto'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid xs={12}>
              <FormLabel sx={{ mb: 1 }}>Imagem do Produto</FormLabel>
              <Sheet
                variant="outlined"
                sx={{
                  borderRadius: 'lg',
                  p: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: imagePreview ? 'primary.300' : 'neutral.300',
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.500', bgcolor: 'primary.50' },
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e: React.DragEvent) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                {imagePreview ? (
                  <AspectRatio ratio="16/9" sx={{ borderRadius: 'md', overflow: 'hidden' }}>
                    <img src={imagePreview} alt="Pré-visualização" style={{ objectFit: 'cover' }} />
                  </AspectRatio>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1 }}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'neutral.400' }} />
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Clique ou arraste uma imagem aqui
                    </Typography>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                      PNG, JPG ou WebP • Máx. 5MB
                    </Typography>
                  </Box>
                )}
              </Sheet>
              {hasNoImage && (
                <Alert
                  variant="soft"
                  color="neutral"
                  size="sm"
                  startDecorator={<InfoOutlinedIcon />}
                  sx={{ mt: 1 }}
                >
                  <span>Uma imagem padrão será utilizada caso nenhuma seja selecionada.</span>
                </Alert>
              )}
              {imagePreview && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    startDecorator={<ImageIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Trocar imagem
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      handleChange('image', '');
                    }}
                  >
                    Remover
                  </Button>
                </Box>
              )}
              {uploadProgress && (
                <Typography level="body-xs" sx={{ mt: 0.5, color: 'primary.500' }}>
                  {uploadProgress}
                </Typography>
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl required>
                <FormLabel>Nome do Produto</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Salmão Fresco"
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl required>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(_, value) => handleChange('category', value ?? defaultCategory)}
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
                <FormLabel>Unidade</FormLabel>
                <Select
                  value={formData.unit}
                  onChange={(_, value) => handleChange('unit', value ?? 'kg')}
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
                <FormLabel>Preço (R$)</FormLabel>
                <Input
                  type="number"
                  slotProps={{ input: { step: '0.01' } }}
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="89.90"
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel>Preço Original (R$) - Opcional</FormLabel>
                <Input
                  type="number"
                  slotProps={{ input: { step: '0.01' } }}
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  placeholder="99.90"
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl required>
                <FormLabel>Estoque</FormLabel>
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
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descrição do produto..."
                  minRows={3}
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <FormLabel>Mais Vendido</FormLabel>
                  <Typography level="body-sm">
                    Exibir em "Mais Pedidos"
                  </Typography>
                </Box>
                <Switch
                  checked={formData.isBestSeller}
                  onChange={(e) => handleChange('isBestSeller', e.target.checked)}
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <FormLabel>Produto visível na loja</FormLabel>
                  <Typography level="body-sm">
                    Quando desligado, o produto fica oculto para clientes.
                  </Typography>
                </Box>
                <Switch
                  checked={formData.isVisible}
                  onChange={(e) => handleChange('isVisible', e.target.checked)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="plain" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {product ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
}
