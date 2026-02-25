import { Box } from '@mui/joy';
import { Outlet, useLocation } from 'react-router-dom';
import StoreFooter from './StoreFooter';

export default function CustomerLayout() {
  const location = useLocation();
  const showFooter = location.pathname !== '/cart';

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
