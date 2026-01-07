import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Sheet,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, useProducts } from '../../firebase';
import ProductForm from '../../components/admin/ProductForm';
import ProductList from '../../components/admin/ProductList';
import CategoryManager from '../../components/admin/CategoryManager';
import type { Product } from '../../types/product';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const heroProduct = useMemo<Product | null>(() => {
    if (!products.length) return null;
    return products.find((product) => product.isBestSeller) ?? products[0];
  }, [products]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const inStockCount = products.filter((product) => (product.stock ?? 0) > 0).length;
  const lowStockCount = products.filter(
    (product) => typeof product.stock === 'number' && product.stock < 10
  ).length;
  const categoryCount = new Set(products.map((product) => product.category)).size;

  const stats: Array<{
    label: string;
    value: number;
    color: 'primary' | 'success' | 'warning' | 'danger';
  }> = [
    { label: 'Total de produtos', value: products.length, color: 'primary' },
    { label: 'Categorias', value: categoryCount, color: 'success' },
    { label: 'Em estoque', value: inStockCount, color: 'warning' },
    { label: 'Estoque baixo', value: lowStockCount, color: 'danger' },
  ];

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
      <Sheet
        component="header"
        variant="solid"
        color="neutral"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1300,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.surface',
          boxShadow: '0 20px 50px -35px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1,
          }}
        >
          <Typography level="h3" sx={{ fontSize: { xs: '1.6rem', sm: '2rem' } }}>
            🐟 Admin Dashboard
          </Typography>
          <Chip color="success" size="sm">
            Live
          </Chip>
        </Box>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<LogoutIcon />}
          onClick={handleSignOut}
          size="sm"
        >
          Sign Out
        </Button>
      </Sheet>

      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 4,
          pb: { xs: 4, sm: 6 },
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Sheet
          component="section"
          variant="outlined"
          sx={{
            borderRadius: '2xl',
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'stretch',
            bgcolor: 'background.surface',
            boxShadow: '0 25px 70px -40px rgba(15,23,42,0.8)',
          }}
        >
          <AspectRatio
            ratio="4/3"
            sx={{
              width: { xs: '100%', md: 320 },
              borderRadius: 'lg',
              overflow: 'hidden',
              flexShrink: 0,
              bgcolor: 'background.level2',
            }}
          >
            <img
              src={heroProduct?.image ?? '/images/placeholder.jpg'}
              alt={heroProduct?.name ?? 'Produto em destaque'}
              style={{ objectFit: 'cover' }}
            />
          </AspectRatio>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography level="body-xs" textColor="text.secondary">
                Primeiro item na base de dados
              </Typography>
              <Typography level="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                {heroProduct?.name ?? 'Nenhum produto registrado'}
              </Typography>
              <Typography level="body-md" sx={{ mt: 1, color: 'text.secondary' }}>
                {heroProduct?.description ??
                  'Use o painel para cadastrar itens e ver o conteúdo direto do Firestore.'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip size="sm" variant="soft">
                {heroProduct?.category ?? 'Categoria pendente'}
              </Chip>
              <Chip size="sm" variant="soft" color={heroProduct ? 'primary' : 'neutral'}>
                {heroProduct
                  ? `R$ ${heroProduct.price.toFixed(2).replace('.', ',')}`
                  : 'Preço pendente'}
              </Chip>
              <Chip size="sm" variant="outlined" color="neutral">
                Estoque: {heroProduct?.stock ?? '—'}
              </Chip>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="solid"
                color="primary"
                size="sm"
                disabled={!heroProduct}
                onClick={() => heroProduct && handleEditProduct(heroProduct)}
              >
                Abrir no editor
              </Button>
              <Button
                variant="soft"
                color="success"
                size="sm"
                startDecorator={<AddIcon />}
                onClick={handleAddProduct}
              >
                Novo produto
              </Button>
            </Box>
          </Box>
        </Sheet>

        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid key={stat.label} xs={12} sm={6} md={3}>
              <Card
                variant="soft"
                color={stat.color}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                }}
              >
                <Typography level="body-sm" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Typography level="h2">{stat.value}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Sheet
          component="section"
          variant="outlined"
          sx={{
            borderRadius: '2xl',
            borderColor: 'divider',
            p: { xs: 2, md: 3 },
            bgcolor: 'background.surface',
            boxShadow: '0 30px 60px -40px rgba(15,23,42,0.8)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography level="h4">Gerenciar produtos</Typography>
            <Button
              startDecorator={<AddIcon />}
              variant="solid"
              color="primary"
              onClick={handleAddProduct}
            >
              Adicionar item
            </Button>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value as number)}
            sx={{ borderRadius: 'xl', bgcolor: 'transparent' }}
          >
            <TabList variant="soft" sx={{ mb: 2, gap: 1 }}>
              <Tab>Produtos</Tab>
              <Tab>Categorias</Tab>
            </TabList>

            <TabPanel value={0} sx={{ p: 0 }}>
              <ProductList products={products} loading={loading} onEdit={handleEditProduct} />
            </TabPanel>

            <TabPanel value={1} sx={{ p: 0 }}>
              <CategoryManager products={products} />
            </TabPanel>
          </Tabs>
        </Sheet>
      </Box>

      {showProductForm && (
        <ProductForm open={showProductForm} onClose={handleFormClose} product={editingProduct} />
      )}
    </Box>
  );
}
