import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import { useStoreSettings } from '../context/useStoreSettings';

export default function MaintenanceScreen() {
  const { settings } = useStoreSettings();

  const whatsappUrl = `https://wa.me/${settings.phone}`;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        background:
          'radial-gradient(circle at 20% 20%, #99f6e4 0%, #0f172a 42%), radial-gradient(circle at 80% 15%, #f59e0b 0%, transparent 35%), linear-gradient(135deg, #0b1120 0%, #134e4a 60%, #0f172a 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(12px)',
            opacity: 0.35,
          },
          '&::before': {
            width: { xs: 180, sm: 260 },
            height: { xs: 180, sm: 260 },
            bgcolor: '#22d3ee',
            left: { xs: -40, sm: -20 },
            top: { xs: 30, sm: 50 },
            animation: 'floatOne 8s ease-in-out infinite',
          },
          '&::after': {
            width: { xs: 220, sm: 320 },
            height: { xs: 220, sm: 320 },
            bgcolor: '#f59e0b',
            right: { xs: -90, sm: -40 },
            bottom: { xs: 10, sm: -20 },
            animation: 'floatTwo 10s ease-in-out infinite',
          },
          '@keyframes floatOne': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-18px)' },
          },
          '@keyframes floatTwo': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(16px)' },
          },
        }}
      />

      <Sheet
        variant="soft"
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 760,
          borderRadius: '2xl',
          p: { xs: 3, sm: 5 },
          border: '1px solid',
          borderColor: 'rgba(255,255,255,0.2)',
          bgcolor: 'rgba(9, 14, 33, 0.7)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 30px 80px -40px rgba(0,0,0,0.75)',
          color: 'common.white',
        }}
      >
        <Chip
          startDecorator={<BuildCircleIcon />}
          color="warning"
          variant="soft"
          sx={{
            mb: 2,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Modo manutenção
        </Chip>

        <Typography
          level="h1"
          sx={{
            color: 'common.white',
            fontSize: { xs: '1.7rem', sm: '2.6rem' },
            lineHeight: 1.1,
            fontWeight: 900,
            textWrap: 'balance',
          }}
        >
          {settings.storeName} {settings.storeSubname}
        </Typography>

        <Typography
          level="h2"
          sx={{
            mt: 1,
            color: '#67e8f9',
            fontSize: { xs: '1.3rem', sm: '1.9rem' },
            fontWeight: 800,
            textWrap: 'balance',
          }}
        >
          Estamos ajustando os detalhes para te atender melhor.
        </Typography>

        <Typography
          level="title-lg"
          sx={{
            mt: 2,
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 500,
          }}
        >
          Estaremos de volta em breve.
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
          <Chip size="sm" variant="soft" color="neutral" startDecorator={<AccessTimeIcon />}>
            {settings.openingHours}
          </Chip>
          <Chip size="sm" variant="soft" color="neutral" startDecorator={<PlaceIcon />}>
            {settings.addressCity} - {settings.addressState}
          </Chip>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            component="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="success"
            size="lg"
            startDecorator={<WhatsAppIcon />}
            sx={{ fontWeight: 700 }}
          >
            Falar com a loja
          </Button>
        </Box>
      </Sheet>
    </Box>
  );
}
