import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import { DEFAULT_PRODUCT_IMAGE } from '../supabase';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card 
      sx={{ 
        width: '100%', 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        borderRadius: '16px',
        boxShadow: 'md',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
      onClick={() => onClick(product)}
    >
      <CardOverflow>
        <AspectRatio ratio="4/3">
          <img
            src={product.image}
            loading="lazy"
            alt={product.name}
            style={{ objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE; }}
          />
        </AspectRatio>
        {discount > 0 && (
          <Chip
            color="danger"
            variant="solid"
            size="sm"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontWeight: 'bold',
              borderRadius: 'sm',
              fontSize: '0.7rem',
              px: 1,
            }}
          >
            -{discount}% OFF
          </Chip>
        )}
      </CardOverflow>
      
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography level="title-md" sx={{ fontWeight: 800, mt: 1 }}>
          {product.name}
        </Typography>
        
        <Typography level="body-xs" sx={{ mb: 0.5, flex: 1, color: 'text.secondary', lineHeight: 1.4 }}>
          {product.description.length > 60 
            ? product.description.substring(0, 60) + '...' 
            : product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          {product.originalPrice && product.originalPrice > product.price ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography level="body-xs" sx={{ color: 'text.tertiary', fontSize: '0.7rem' }}>
                De
              </Typography>
              <Typography level="body-sm" sx={{ textDecoration: 'line-through', color: 'neutral.400', fontSize: '0.8rem' }}>
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </Typography>
            </Box>
          ) : null}
          
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            {product.originalPrice && product.originalPrice > product.price && (
              <Typography level="body-xs" sx={{ color: 'danger.500', fontWeight: 600, fontSize: '0.7rem' }}>
                Por
              </Typography>
            )}
            <Typography level="h4" sx={{ 
              color: product.originalPrice && product.originalPrice > product.price ? 'danger.500' : 'primary.500', 
              fontWeight: 800,
              fontSize: product.originalPrice ? '1.3rem' : '1.1rem',
            }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </Typography>
            {product.unit && (
              <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>/{product.unit}</Typography>
            )}
          </Box>
        </Box>

        <Button
          variant="solid"
          color={product.originalPrice && product.originalPrice > product.price ? "danger" : "primary"}
          size="sm"
          startDecorator={<ShoppingBagIcon />}
          onClick={(event) => {
            event.stopPropagation();
            onClick(product);
          }}
          sx={{ width: '100%', mt: 1, borderRadius: '12px' }}
        >
          {product.originalPrice && product.originalPrice > product.price ? 'Aproveitar' : 'Pôr na Cesta'}
        </Button>
      </CardContent>
    </Card>
  );
}