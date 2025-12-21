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
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'sm',
        bgcolor: 'background.surface',
      }}
    >
      <div>
        <Typography
        level="h4"
        component="h1"
        sx={{ 
          fontWeight: 'xl', 
          color: 'primary.900',
          cursor: 'pointer',
          fontFamily: 'Anton, Inter, var(--joy-fontFamily-fallback)',
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
          color: 'primary.900',
          cursor: 'pointer',
          fontFamily: 'Anton, Inter, var(--joy-fontFamily-fallback)',
        }}
        onClick={() => navigate('/')}
      >
        PESCADOS
      </Typography>
      </div>

      <IconButton 
        variant="plain" 
        color="neutral"
        onClick={() => navigate('/cart')}
      >
        <Badge badgeContent={cartCount} color="primary" size="sm">
          <ShoppingBagIcon />
        </Badge>
      </IconButton>
    </Sheet>
  );
}
