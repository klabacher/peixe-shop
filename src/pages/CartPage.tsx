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
import CircularProgress from '@mui/joy/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/useStoreSettings';
import { DEFAULT_PRODUCT_IMAGE } from '../supabase/storage';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { settings } = useStoreSettings();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  
  // Form states
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cep, setCep] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [cepLoading, setCepLoading] = React.useState(false);
  const [cepError, setCepError] = React.useState('');
  const [checkoutStep, setCheckoutStep] = React.useState<'cart' | 'form' | 'summary'>('cart');

  const fullAddress = [street, number, complement, neighborhood, city && state ? `${city} - ${state}` : city || state, cep].filter(Boolean).join(', ');

  const lookupCep = async (rawCep: string) => {
    const cleanCep = rawCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    setCepLoading(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }
      setStreet(data.logradouro || '');
      setNeighborhood(data.bairro || '');
      setCity(data.localidade || '');
      setState(data.uf || '');
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    setCep(v);
    if (v.replace(/\D/g, '').length === 8) {
      lookupCep(v);
    }
  };

  const handleCheckout = () => {
    const itemLines = items.map(item => {
      const hasDiscount = item.originalPrice && item.originalPrice > item.price;
      const linePrice = `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
      const orig = hasDiscount ? ` (era R$ ${item.originalPrice!.toFixed(2).replace('.', ',')})` : '';
      return `• ${item.quantity}x ${item.name} - ${linePrice}${orig}`;
    }).join('\n');

    const message = encodeURIComponent(
      `*Novo Pedido - ${settings.storeName} ${settings.storeSubname}*\n\n` +
      `*Cliente:* ${name}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Endereço:* ${fullAddress}\n\n` +
      `*Pedido:*\n${itemLines}\n\n` +
      `*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n` +
      `*Entrega:* Retirar na Loja (${settings.address})\n` +
      `*Horário de Retirada:* ${settings.openingHours}`
    );
    
    const whatsappUrl = `https://wa.me/${settings.phone}?text=${message}`;
    
    setOpenSuccess(true);
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      clearCart();
      setOpenSuccess(false);
      navigate('/');
    }, 3000);
  };

  const formValid = name && phone && cep.replace(/\D/g, '').length === 8 && street && number && city;

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
        {items.map((item) => {
          const hasDiscount = item.originalPrice && item.originalPrice > item.price;
          return (
            <Sheet key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 'md', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                <AspectRatio ratio="1" sx={{ width: 80, borderRadius: 'sm' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE; }}
                  />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {hasDiscount && (
                      <Typography level="body-xs" sx={{ textDecoration: 'line-through', color: 'text.tertiary' }}>
                        R$ {item.originalPrice!.toFixed(2).replace('.', ',')}
                      </Typography>
                    )}
                    <Typography level="body-sm" sx={{ color: hasDiscount ? 'danger.500' : 'success.plainColor', fontWeight: hasDiscount ? 700 : 400 }}>
                      R$ {item.price.toFixed(2).replace('.', ',')} / {item.unit || 'un'}
                    </Typography>
                  </Box>
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
                    <Typography level="title-md" sx={{ color: hasDiscount ? 'danger.500' : 'success.plainColor' }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Sheet>
          );
        })}

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
          placeholder="Ex: (27) 99999-9999" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </FormControl>

      <Divider sx={{ my: 2 }} />
      <Typography level="title-md" sx={{ mb: 2 }}>Endereço</Typography>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>CEP</FormLabel>
        <Input 
          startDecorator={cepLoading ? <CircularProgress size="sm" /> : <SearchIcon />}
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          error={!!cepError}
          required
        />
        {cepError && (
          <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>{cepError}</Typography>
        )}
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <FormControl sx={{ flex: 3 }}>
          <FormLabel>Rua</FormLabel>
          <Input 
            placeholder="Rua / Avenida" 
            value={street} 
            onChange={(e) => setStreet(e.target.value)} 
            required 
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Nº</FormLabel>
          <Input 
            placeholder="123" 
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            required 
          />
        </FormControl>
      </Box>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Complemento</FormLabel>
        <Input 
          placeholder="Apto, Bloco... (opcional)" 
          value={complement} 
          onChange={(e) => setComplement(e.target.value)} 
        />
      </FormControl>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Bairro</FormLabel>
        <Input 
          placeholder="Bairro" 
          value={neighborhood} 
          onChange={(e) => setNeighborhood(e.target.value)} 
        />
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <FormControl sx={{ flex: 3 }}>
          <FormLabel>Cidade</FormLabel>
          <Input 
            placeholder="Cidade" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>UF</FormLabel>
          <Input 
            placeholder="ES" 
            value={state} 
            onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))} 
          />
        </FormControl>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography level="title-md" sx={{ mb: 2 }}>Opção de Entrega</Typography>
      
      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 2, bgcolor: 'primary.softBg' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <StoreIcon color="primary" />
          <Typography level="title-md">Retirar na Loja (Única Opção)</Typography>
        </Box>
        <Typography level="body-sm" sx={{ mb: 1 }}>
          {settings.address} - {settings.addressCity}, {settings.addressState}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'text.tertiary' }} />
          <Typography level="body-xs" fontWeight="bold">
            Aberto: {settings.openingHours}
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
          disabled={!formValid}
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
        <Typography level="body-sm">{fullAddress}</Typography>
      </Sheet>

      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3 }}>
        <Typography level="title-sm" textColor="text.tertiary" sx={{ mb: 1 }}>ITENS</Typography>
        {items.map(item => {
          const hasDiscount = item.originalPrice && item.originalPrice > item.price;
          return (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography level="body-sm">{item.quantity}x {item.name}</Typography>
              <Box sx={{ textAlign: 'right' }}>
                {hasDiscount && (
                  <Typography level="body-xs" sx={{ textDecoration: 'line-through', color: 'text.tertiary' }}>
                    R$ {(item.originalPrice! * item.quantity).toFixed(2).replace('.', ',')}
                  </Typography>
                )}
                <Typography level="body-sm" sx={{ color: hasDiscount ? 'danger.500' : undefined }}>
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography level="title-md">Total</Typography>
          <Typography level="title-md" textColor="success.plainColor">R$ {total.toFixed(2).replace('.', ',')}</Typography>
        </Box>
      </Sheet>

      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3 }}>
        <Typography level="title-sm" textColor="text.tertiary" sx={{ mb: 1 }}>ENTREGA</Typography>
        <Typography level="body-md"><strong>Retirar na Loja</strong></Typography>
        <Typography level="body-sm">{settings.address} - {settings.addressCity}, {settings.addressState}</Typography>
        <Typography level="body-xs" sx={{ mt: 1 }}>Horário: {settings.openingHours}</Typography>
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
