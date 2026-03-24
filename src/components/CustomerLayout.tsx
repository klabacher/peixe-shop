import { Box, CircularProgress } from '@mui/joy';
import { Outlet, useLocation } from 'react-router-dom';
import StoreFooter from './StoreFooter';
import MaintenanceScreen from './MaintenanceScreen';
import { useStoreSettings } from '../context/useStoreSettings';

export default function CustomerLayout() {
  const location = useLocation();
  const { settings, loading } = useStoreSettings();
  const showFooter = location.pathname !== '/cart';

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.body',
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (settings.maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.body',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Outlet />
      </Box>
      {showFooter && <StoreFooter />}
    </Box>
  );
}
