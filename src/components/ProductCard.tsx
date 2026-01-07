import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip'; // Import do Chip
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  // Cálculo da porcentagem de desconto
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
        boxShadow: 'md', // Usando sombra do tema novo
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
          />
        </AspectRatio>
        {/* Badge de Desconto sobre a imagem */}
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
            }}
          >
            -{discount}% OFF
          </Chip>
        )}
      </CardOverflow>
      
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography level="title-md" sx={{ fontWeight: 800, mt: 1 }}>
          {product.name}
        </Typography>
        
        <Typography level="body-xs" sx={{ mb: 1, flex: 1, color: 'text.secondary', lineHeight: 1.4 }}>
          {product.description.length > 60 
            ? product.description.substring(0, 60) + '...' 
            : product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          {/* Exibição de Preço: De / Por */}
          {product.originalPrice && (
            <Typography level="body-xs" sx={{ textDecoration: 'line-through', color: 'text.tertiary' }}>
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography level="h4" sx={{ color: product.originalPrice ? 'danger.500' : 'primary.500', fontWeight: 800 }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="solid"
          color={product.originalPrice ? "danger" : "primary"} // Botão vermelho se for oferta
          size="sm" // Botão mais compacto
          startDecorator={<ShoppingBagIcon />}
          onClick={(event) => {
            event.stopPropagation();
            onClick(product);
          }}
          sx={{ width: '100%', mt: 1, borderRadius: '12px' }}
        >
          {product.originalPrice ? 'Aproveitar' : 'Pôr na Cesta'}
        </Button>
      </CardContent>
    </Card>
  );
}