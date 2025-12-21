import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import AspectRatio from '@mui/joy/AspectRatio';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StoreIcon from '@mui/icons-material/Store';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [openSuccess, setOpenSuccess] = React.useState(false);

  const handleCheckout = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      clearCart();
      setOpenSuccess(false);
      navigate('/');
    }, 3000);
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography level="h3" sx={{ mb: 2 }}>Seu carrinho está vazio</Typography>
        <Button variant="solid" color="primary" onClick={() => navigate('/')}>Voltar para a loja</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 12, bgcolor: 'background.body', minHeight: '100vh' }}>
      <Sheet
        variant="solid"
        color="primary"
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, position: 'sticky', top: 0, zIndex: 100, boxShadow: 'sm' }}
      >
        <IconButton
          onClick={() => navigate('/')}
          variant="plain"
          sx={{ color: 'primary.solidColor', '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography level="h4" textColor="primary.solidColor">Sacola</Typography>
      </Sheet>

      <Box sx={{ p: 2 }}>
        {items.map((item) => (
          <Sheet key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 'md', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
              <AspectRatio ratio="1" sx={{ width: 80, borderRadius: 'sm' }}>
                <img src={item.image} alt={item.name} />
              </AspectRatio>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography level="title-md">{item.name}</Typography>
                  <IconButton 
                    size="sm" 
                    color="danger" 
                    variant="plain"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
                <Typography level="body-sm" textColor="success.plainColor" sx={{ mb: 1 }}>
                  R$ {item.price.toFixed(2).replace('.', ',')} / un
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'neutral.outlinedBorder', borderRadius: 'sm', p: 0.5 }}>
                    <IconButton 
                      size="sm" 
                      variant="plain"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton 
                      size="sm" 
                      variant="plain"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography level="title-md" textColor="success.plainColor">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Sheet>
        ))}

        <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <StoreIcon color="primary" />
            <Typography level="title-md">Retirar na Loja</Typography>
          </Box>
          <Typography level="body-sm">
            Rua dos Peixes, 123 - Centro<br/>
            Disponível em 30 minutos
          </Typography>
        </Sheet>

        <Sheet variant="soft" color="neutral" sx={{ p: 2, borderRadius: 'md' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal</Typography>
            <Typography textColor="success.plainColor">R$ {total.toFixed(2).replace('.', ',')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Taxa de serviço</Typography>
            <Typography>Grátis</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography level="title-lg">Total</Typography>
            <Typography level="title-lg" textColor="success.plainColor">R$ {total.toFixed(2).replace('.', ',')}</Typography>
          </Box>
        </Sheet>
      </Box>

      <Sheet
        variant="solid"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <Button 
          fullWidth 
          size="lg" 
          onClick={handleCheckout}
          variant="solid"
          color="success"
        >
          Confirmar Pedido
        </Button>
      </Sheet>

      <Modal open={openSuccess} onClose={() => {}}>
        <ModalDialog layout="center" sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.500', mx: 'auto', mb: 2 }} />
          <Typography level="h3" sx={{ mb: 1 }}>Pedido Confirmado!</Typography>
          <Typography>Sua retirada está agendada.</Typography>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
