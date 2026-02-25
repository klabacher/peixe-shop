import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import { useStoreSettings } from '../context/useStoreSettings';

export default function StoreFooter() {
  const { settings, loading } = useStoreSettings();

  if (loading) return null;

  const fullAddress = [
    settings.address,
    settings.addressCity && settings.addressState
      ? `${settings.addressCity} - ${settings.addressState}`
      : settings.addressCity || settings.addressState,
    settings.addressCep,
  ]
    .filter(Boolean)
    .join(', ');

  const mapsQuery = settings.mapsEmbedQuery || fullAddress;

  return (
    <Sheet
      component="footer"
      sx={{
        bgcolor: '#0A1929',
        color: 'white',
        // mt: 'auto', // Removed because Layout handles it
        zIndex: 10, // Ensure it stays on top if needed
      }}
    >
      {/* Map Section */}
      {mapsQuery && (
        <Box sx={{ width: '100%', height: { xs: 200, sm: 250 }, overflow: 'hidden' }}>
          <iframe
            title="Localização da Loja"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
          />
        </Box>
      )}

      {/* Info Section */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3, sm: 4 },
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 3, sm: 4 },
        }}
      >
        {/* Left: Brand info */}
        <Box>
          <Typography
            level="h3"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 0.5,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
            }}
          >
            {settings.storeName} {settings.storeSubname}
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              maxWidth: 400,
            }}
          >
            {settings.storeDescription}
          </Typography>
        </Box>

        {/* Right: Contact info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, mt: 0.25 }} />
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              {fullAddress}
            </Typography>
          </Box>

          <Box
            component="a"
            href={`https://wa.me/${settings.phone}`}
            target="_blank"
            rel="noopener"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              {settings.phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccessTimeIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              {settings.openingHours}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          px: { xs: 2.5, sm: 4 },
          py: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.35)' }}>
          © {new Date().getFullYear()} {settings.storeName} {settings.storeSubname}. Todos os direitos reservados.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            level="body-xs"
            component="a"
            href="https://klabacher.dev/"
            target="_blank"
            rel="noopener"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'white',
              },
            }}
          >
            Feito por João Vitor Klabacher
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              component="a"
              href="https://www.linkedin.com/in/joaovitorklabacher/"
              target="_blank"
              rel="noopener"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
                '&:hover': { color: '#0A66C2' },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </Box>
            <Box
              component="a"
              href="https://github.com/klabacher"
              target="_blank"
              rel="noopener"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
                '&:hover': { color: 'white' },
              }}
            >
              <GitHubIcon fontSize="small" />
            </Box>
            <Box
              component="a"
              href="mailto:jvklabacher@gmail.com"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
                '&:hover': { color: '#EA4335' },
              }}
            >
              <EmailIcon fontSize="small" />
            </Box>
            <Box
              component="a"
              href="https://klabacher.dev/"
              target="_blank"
              rel="noopener"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
                '&:hover': { color: '#4285F4' },
              }}
            >
              <LanguageIcon fontSize="small" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
}
