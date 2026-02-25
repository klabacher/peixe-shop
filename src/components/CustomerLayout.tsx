import { Box } from '@mui/joy';
import { Outlet } from 'react-router-dom';
import StoreFooter from './StoreFooter';

export default function CustomerLayout() {
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
      <StoreFooter />
    </Box>
  );
}
