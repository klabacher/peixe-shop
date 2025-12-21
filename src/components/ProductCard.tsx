import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import type { Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        width: '100%', 
        cursor: 'pointer',
      }}
      onClick={() => onClick(product)}
    >
      <CardOverflow>
        <AspectRatio ratio="4/3">
          <img
            src={product.image}
            loading="lazy"
            alt={product.name}
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md" fontWeight="lg" textColor="primary.plainColor" sx={{ mt: 1, mb: 0.5 }}>
          {product.name}
        </Typography>
        <Typography level="body-sm" textColor="neutral.500" sx={{ mb: 1 }}>
          {product.description.length > 50 
            ? product.description.substring(0, 50) + '...' 
            : product.description}
        </Typography>
        <Typography level="title-lg" textColor="success.plainColor" sx={{ mb: 1 }}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </Typography>

        <Button
          variant="solid"
          color="success"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            onClick(product);
          }}
        >
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}
