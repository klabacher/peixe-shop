
import * as React from 'react';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import LogoSection from '../components/LogoSection';
import { products, type Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import Divider from '@mui/joy/Divider';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const { addToCart, count } = useCart();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Header cartCount={count} />

      <LogoSection />
      <Divider orientation="horizontal" />
      
      <Box sx={{ p: 2 }}>
        <Typography level="h2" sx={{ mb: 2, fontSize: '1.5rem' }}>
          Destaques
        </Typography>
        
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid key={product.id} xs={6} sm={4} md={3}>
              <ProductCard 
                product={product} 
                onClick={handleProductClick} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <ProductModal 
        open={!!selectedProduct} 
        onClose={handleCloseModal} 
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </Box>
  );
}