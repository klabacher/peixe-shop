import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { Product } from '../data/mockData';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductModal({ open, onClose, product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog 
        layout="center"
        sx={{ 
          maxWidth: 500, 
          width: '90%',
          p: 0,
          overflow: 'hidden'
        }}
      >
        <ModalClose variant="plain" sx={{ zIndex: 1, bgcolor: 'background.surface', borderRadius: '50%' }} />
        
        <AspectRatio ratio="16/9">
          <img
            src={product.image}
            alt={product.name}
            style={{ objectFit: 'cover' }}
          />
        </AspectRatio>

        <Box sx={{ p: 2 }}>
          <Typography level="h3" component="h2" sx={{ mb: 1 }}>
            {product.name}
          </Typography>
          
          <Typography level="body-md" textColor="neutral.500" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography level="h4" color="success">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'neutral.outlinedBorder', borderRadius: 'sm', p: 0.5 }}>
              <IconButton 
                size="sm" 
                variant="plain" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography fontWeight="lg">{quantity}</Typography>
              <IconButton 
                size="sm" 
                variant="plain" 
                onClick={() => setQuantity(quantity + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <Button 
            fullWidth 
            size="lg"
            onClick={handleAddToCart}
            variant="solid"
            color="success"
          >
            Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
