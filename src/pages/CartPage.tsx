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
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  
  // Form states
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [checkoutStep, setCheckoutStep] = React.useState<'cart' | 'form' | 'summary'>('cart');

  const handleCheckout = () => {
    // Format message for WhatsApp
    const message = encodeURIComponent(
      `*Novo Pedido - Peixe Shop*\n\n` +
      `*Cliente:* ${name}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Endereço:* ${address}\n\n` +
      `*Pedido:*\n${items.map(item => `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n` +
      `*Total:* R$ ${total.toFixed(2)}\n\n` +
      `*Entrega:* Retirar na Loja (Rua dos Peixes, 123)\n` +
      `*Horário de Retirada:* Seg a Sex, 09h às 19h`
    );
    
    const whatsappUrl = `https://wa.me/5512996707238?text=${message}`;
    
    setOpenSuccess(true);
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

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

  const renderCart = () => (
    <>
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
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}
      >
        <Button 
          fullWidth 
          size="lg" 
          onClick={() => setCheckoutStep('form')}
          variant="solid"
          color="success"
        >
          Ir para Identificação
        </Button>
      </Sheet>
    </>
  );

  const renderForm = () => (
    <Box sx={{ p: 2, pb: 12 }}>
      <Typography level="h4" sx={{ mb: 3 }}>Identificação</Typography>
      
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Seu Nome</FormLabel>
        <Input 
          startDecorator={<PersonIcon />} 
          placeholder="Ex: João Silva" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormControl>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>WhatsApp / Telefone</FormLabel>
        <Input 
          startDecorator={<PhoneIcon />} 
          placeholder="Ex: 12 99999-9999" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </FormControl>

      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Seu Endereço</FormLabel>
        <Input 
          startDecorator={<LocationOnIcon />} 
          placeholder="Rua, Número, Bairro" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </FormControl>

      <Divider sx={{ my: 3 }} />

      <Typography level="title-md" sx={{ mb: 2 }}>Opção de Entrega</Typography>
      
      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 2, bgcolor: 'primary.softBg' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <StoreIcon color="primary" />
          <Typography level="title-md">Retirar na Loja (Única Opção)</Typography>
        </Box>
        <Typography level="body-sm" sx={{ mb: 1 }}>
          Rua dos Peixes, 123 - Centro, São José dos Campos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'text.tertiary' }} />
          <Typography level="body-xs" fontWeight="bold">
            Aberto: Seg a Sex, 09:00 às 19:00
          </Typography>
        </Box>
      </Sheet>

      <Sheet
        variant="solid"
        color="primary"
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, display: 'flex', gap: 2 }}
      >
        <Button 
          variant="soft" 
          color="neutral" 
          onClick={() => setCheckoutStep('cart')}
        >
          Voltar
        </Button>
        <Button 
          fullWidth 
          size="lg" 
          onClick={() => setCheckoutStep('summary')}
          variant="solid"
          color="success"
          disabled={!name || !phone || !address}
        >
          Ver Resumo
        </Button>
      </Sheet>
    </Box>
  );

  const renderSummary = () => (
    <Box sx={{ p: 2, pb: 12 }}>
      <Typography level="h4" sx={{ mb: 3 }}>Resumo do Pedido</Typography>
      
      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3 }}>
        <Typography level="title-sm" textColor="text.tertiary" sx={{ mb: 1 }}>CLIENTE</Typography>
        <Typography level="body-md"><strong>{name}</strong></Typography>
        <Typography level="body-sm">{phone}</Typography>
        <Typography level="body-sm">{address}</Typography>
      </Sheet>

      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3 }}>
        <Typography level="title-sm" textColor="text.tertiary" sx={{ mb: 1 }}>ITENS</Typography>
        {items.map(item => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography level="body-sm">{item.quantity}x {item.name}</Typography>
            <Typography level="body-sm">R$ {(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography level="title-md">Total</Typography>
          <Typography level="title-md" textColor="success.plainColor">R$ {total.toFixed(2).replace('.', ',')}</Typography>
        </Box>
      </Sheet>

      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3 }}>
        <Typography level="title-sm" textColor="text.tertiary" sx={{ mb: 1 }}>ENTREGA</Typography>
        <Typography level="body-md"><strong>Retirar na Loja</strong></Typography>
        <Typography level="body-sm">Rua dos Peixes, 123</Typography>
        <Typography level="body-xs" sx={{ mt: 1 }}>Horário: Seg a Sex, 09:00 às 19:00</Typography>
      </Sheet>

      <Sheet
        variant="solid"
        color="primary"
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, display: 'flex', gap: 2 }}
      >
        <Button 
          variant="soft" 
          color="neutral" 
          onClick={() => setCheckoutStep('form')}
        >
          Voltar
        </Button>
        <Button 
          fullWidth 
          size="lg" 
          onClick={handleCheckout}
          variant="solid"
          color="success"
        >
          Finalizar no WhatsApp
        </Button>
      </Sheet>
    </Box>
  );

  return (
    <Box sx={{ pb: 12, bgcolor: 'background.body', minHeight: '100vh' }}>
      <Sheet
        variant="solid"
        color="primary"
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, position: 'sticky', top: 0, zIndex: 100, boxShadow: 'sm' }}
      >
        <IconButton
          onClick={() => {
            if (checkoutStep === 'summary') setCheckoutStep('form');
            else if (checkoutStep === 'form') setCheckoutStep('cart');
            else navigate('/');
          }}
          variant="plain"
          sx={{ color: 'primary.solidColor', '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography level="h4" textColor="primary.solidColor">
          {checkoutStep === 'cart' ? 'Sacola' : checkoutStep === 'form' ? 'Identificação' : 'Resumo'}
        </Typography>
      </Sheet>

      {checkoutStep === 'cart' && renderCart()}
      {checkoutStep === 'form' && renderForm()}
      {checkoutStep === 'summary' && renderSummary()}

      <Modal open={openSuccess} onClose={() => {}}>
        <ModalDialog layout="center" sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.500', mx: 'auto', mb: 2 }} />
          <Typography level="h3" sx={{ mb: 1 }}>Pedido Enviado!</Typography>
          <Typography>Estamos te redirecionando para o WhatsApp...</Typography>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
