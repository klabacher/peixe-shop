import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Badge from '@mui/joy/Badge';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <Sheet
      variant="solid"
      color="primary"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'sm',
      }}
    >
      <div>
        <Typography
        level="h4"
        component="h1"
        sx={{ 
          fontWeight: 'xl', 
          cursor: 'pointer',
          color: 'primary.solidColor',
          '&:hover': { color: 'success.plainColor' },
        }}
        onClick={() => navigate('/')}
      >
        VIGANÔ
      </Typography>
      <Typography
        level="h4"
        component="h1"
        sx={{
          fontWeight: 'xl', 
          cursor: 'pointer',
          color: 'primary.solidColor',
          '&:hover': { color: 'success.plainColor' },
        }}
        onClick={() => navigate('/')}
      >
        PESCADOS
      </Typography>
      </div>

      <IconButton
        variant="plain"
        onClick={() => navigate('/cart')}
        sx={{
          color: 'primary.solidColor',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
        }}
      >
        <Badge badgeContent={cartCount} color="success" size="sm">
          <ShoppingBagIcon />
        </Badge>
      </IconButton>
    </Sheet>
  );
}
