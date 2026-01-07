import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.level1' }}>
      {/* Header */}
      <Sheet
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.surface',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography level="h3">🐟 Admin Dashboard</Typography>
            <Chip color="success" size="sm">
              Live
            </Chip>
          </Box>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<LogoutIcon />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Sheet>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" color="primary">
              <Typography level="body-sm">Total Products</Typography>
              <Typography level="h2">{products.length}</Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" color="success">
              <Typography level="body-sm">Categories</Typography>
              <Typography level="h2">
                {new Set(products.map((p) => p.category)).size}
              </Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" color="warning">
              <Typography level="body-sm">In Stock</Typography>
              <Typography level="h2">
                {products.filter((p) => p.stock > 0).length}
              </Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" color="danger">
              <Typography level="body-sm">Low Stock</Typography>
              <Typography level="h2">
                {products.filter((p) => p.stock < 10).length}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
          <TabList>
            <Tab>Products</Tab>
            <Tab>Categories</Tab>
          </TabList>

          {/* Products Tab */}
          <TabPanel value={0} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography level="h4">Manage Products</Typography>
              <Button
                startDecorator={<AddIcon />}
                onClick={handleAddProduct}
                color="primary"
              >
                Add Product
              </Button>
            </Box>

            <ProductList
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
            />
          </TabPanel>

          {/* Categories Tab */}
          <TabPanel value={1} sx={{ p: 3 }}>
            <CategoryManager products={products} />
          </TabPanel>
        </Tabs>
      </Box>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          open={showProductForm}
          onClose={handleFormClose}
          product={editingProduct}
        />
      )}
    </Box>
  );
}
