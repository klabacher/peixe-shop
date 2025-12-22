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
import Sheet from '@mui/joy/Sheet';
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
          border: 'none',
          borderRadius: 'xl',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Botão de Fechar Ergonômico e Destacado */}
        <ModalClose 
          variant="solid" 
          sx={{ 
            top: 16, 
            right: 16, 
            zIndex: 2, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }} 
        />
        
        {/* Área de Scroll para o Conteúdo */}
        <Box sx={{ overflowY: 'auto', flex: 1, pb: 10 }}>
          <AspectRatio ratio="4/3" sx={{ width: '100%' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ objectFit: 'cover' }}
            />
          </AspectRatio>

          <Box sx={{ p: 3 }}>
            <Typography level="h3" sx={{ mb: 1, fontSize: '1.5rem', fontWeight: 800 }}>
              {product.name}
            </Typography>
            
            <Typography level="body-lg" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
              {product.description}
            </Typography>

            <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
              Categoria: {product.category}
            </Typography>
          </Box>
        </Box>

        {/* Sticky Footer (Rodapé Fixo) para Ação de Compra */}
        <Sheet
          sx={{ 
            p: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'md', p: 0.5 }}>
            <IconButton 
              size="sm" 
              variant="plain" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <Typography fontWeight="lg" sx={{ minWidth: 20, textAlign: 'center' }}>{quantity}</Typography>
            <IconButton 
              size="sm" 
              variant="plain" 
              onClick={() => setQuantity(quantity + 1)}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Button 
            fullWidth 
            size="lg"
            onClick={handleAddToCart}
            color="danger"
            sx={{ flex: 1 }}
          >
            Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
          </Button>
        </Sheet>
      </ModalDialog>
    </Modal>
  );
}