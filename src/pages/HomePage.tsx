import * as React from 'react';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Chip from '@mui/joy/Chip';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import AspectRatio from '@mui/joy/AspectRatio';
import CircularProgress from '@mui/joy/CircularProgress';
import Alert from '@mui/joy/Alert';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import LogoSection from '../components/LogoSection';
import { useCart } from '../context/CartContext';
import { useProducts } from '../firebase/hooks';
import type { Product } from '../types/product';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const BASE_TABS = [
  { id: 'Mais Pedidos', label: 'Mais Pedidos', icon: <WhatshotIcon /> },
  { id: 'Promoções', label: 'Ofertas', icon: <LocalOfferIcon /> },
];

type CategoryTab = {
  id: string;
  label: string;
  icon: React.ReactNode | null;
};

export default function HomePage() {
  const { addToCart, count } = useCart();
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Mais Pedidos');

  const dynamicCategoryTabs = React.useMemo<CategoryTab[]>(() => {
    const seen = new Set<string>();
    return products
      .map((product) => product.category)
      .filter((category): category is string => {
        if (!category || seen.has(category)) {
          return false;
        }
        seen.add(category);
        return true;
      })
      .map((category) => ({
        id: category,
        label: category,
        icon: null,
      }));
  }, [products]);

  const categoryTabs = React.useMemo(
    () => [...BASE_TABS, ...dynamicCategoryTabs],
    [dynamicCategoryTabs]
  );

  React.useEffect(() => {
    if (!categoryTabs.some((tab) => tab.id === selectedCategory)) {
      setSelectedCategory('Mais Pedidos');
    }
  }, [categoryTabs, selectedCategory]);

  const filteredProducts = React.useMemo<Product[]>(() => {
    if (!products.length) return [];
    if (selectedCategory === 'Mais Pedidos') {
      const bestSellers = products.filter((product) => product.isBestSeller);
      return bestSellers.length
        ? bestSellers
        : products.slice(0, Math.min(4, products.length));
    }

    if (selectedCategory === 'Promoções') {
      return products.filter(
        (product) => product.originalPrice && product.originalPrice > product.price
      );
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const heroProduct = React.useMemo<Product | null>(() => {
    if (!products.length) return null;
    return (
      products.find((product) => product.isBestSeller) ?? products[0]
    );
  }, [products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Box
      sx={{
        pb: { xs: 0, sm: 12 },
        bgcolor: 'background.body',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header cartCount={count} />
      <LogoSection />

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 99,
          bgcolor: 'background.body',
          pt: 1,
          pb: 2,
          boxShadow: '0 20px 50px -30px rgba(0,0,0,0.5)',
        }}
      >
        <Tabs
          aria-label='Categorias de produtos'
          value={selectedCategory}
          onChange={(_event, newValue) => setSelectedCategory(newValue as string)}
          sx={{ bgcolor: 'transparent' }}
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 1.5,
              ml: { xs: 1, sm: 2 },
              borderRadius: 'xl',
              bgcolor: 'background.surface',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.12)',
                borderRadius: 8,
              },
              '& > button': {
                scrollSnapAlign: 'start',
                flex: '0 0 auto',
              },
              [`& .${tabClasses.root}`]: {
                boxShadow: 'none',
                fontWeight: 'md',
                borderRadius: 'sm',
                whiteSpace: 'nowrap',
                transition: '0.2s',
                px: { xs: 2, sm: 2.5 },
                py: 1,
                border: '1px solid',
                borderColor: 'neutral.200',
                minWidth: { xs: 120, sm: 'auto' },
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'primary.500',
                  color: 'white',
                  borderColor: 'primary.500',
                  fontWeight: 'lg',
                },
                [`&:not(.${tabClasses.selected}):hover`]: {
                  bgcolor: 'neutral.100',
                },
              },
            }}
          >
            {categoryTabs.map((cat) => (
              <Tab key={cat.id} value={cat.id} disableIndicator>
                {cat.icon && (
                  <Box component='span' sx={{ mr: 1, display: 'inherit' }}>
                    {cat.icon}
                  </Box>
                )}
                {cat.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 4, sm: 6 } }}>
        <Sheet
          component='section'
          variant='outlined'
          sx={{
            borderRadius: 'xl',
            p: { xs: 2, sm: 3 },
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'stretch',
            bgcolor: 'background.surface',
            boxShadow: '0 25px 50px -30px rgba(15,23,42,0.6)',
          }}
        >
          <AspectRatio
            ratio='5/3'
            sx={{
              minWidth: { sm: 240 },
              borderRadius: 'lg',
              overflow: 'hidden',
              flex: 1,
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
            }}
          >
            <Box>
              <Typography
                level='body-xs'
                textColor='success.plainColor'
                sx={{ mb: 1 }}
              >
                Primeiro item no banco
              </Typography>
              <Typography
                level='h3'
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.9rem' },
                  fontWeight: 800,
                }}
              >
                {heroProduct?.name ?? 'Sem produtos cadastrados'}
              </Typography>
              <Typography level='body-md' sx={{ mt: 1, color: 'text.secondary' }}>
                {heroProduct?.description ??
                  'Cadastre seus produtos pelo painel administrativo para que apareçam aqui.'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
              <Chip size='sm' color='primary' variant='soft'>
                {heroProduct?.category ?? 'Categoria pendente'}
              </Chip>
              <Chip size='sm' variant='soft'>
                {heroProduct
                  ? `R$ ${heroProduct.price.toFixed(2).replace('.', ',')}`
                  : 'Preço pendente'}
              </Chip>
              <Chip size='sm' variant='outlined' color='neutral'>
                Estoque: {heroProduct?.stock ?? '—'}
              </Chip>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
              <Button
                variant='solid'
                color='primary'
                onClick={() => heroProduct && handleProductClick(heroProduct)}
                disabled={!heroProduct}
              >
                Ver card
              </Button>
              <Button
                variant='soft'
                color='success'
                onClick={() => heroProduct && addToCart(heroProduct, 1)}
                disabled={!heroProduct}
              >
                Adicionar ao carrinho
              </Button>
            </Box>
          </Box>
        </Sheet>

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            level='h2'
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.8rem' },
              fontWeight: 800,
            }}
          >
            {selectedCategory === 'Promoções'
              ? 'Ofertas Imperdíveis 🔥'
              : selectedCategory}
          </Typography>
          <Chip size='sm' variant='soft' color='neutral'>
            {filteredProducts.length} itens
          </Chip>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size='lg' />
          </Box>
        ) : error ? (
          <Alert color='danger' variant='soft' sx={{ mt: 3 }}>
            Falha ao carregar produtos: {error.message}
          </Alert>
        ) : filteredProducts.length === 0 ? (
          <Alert color='neutral' variant='soft' sx={{ mt: 3 }}>
            Nenhum produto encontrado nessa categoria no momento.
          </Alert>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {filteredProducts.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} onClick={handleProductClick} />
              </Grid>
            ))}
          </Grid>
        )}
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
