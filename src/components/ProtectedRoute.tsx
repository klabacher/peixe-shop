import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase';
import { Box, CircularProgress } from '@mui/joy';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Simple admin check - user must be authenticated with specific email
const ADMIN_EMAILS = [
  'admin@peixeshop.com',
  'admin@example.com',
  // Add your admin emails here
];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated but not admin
  if (user.email && !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  // Anonymous users can't access admin
  if (user.isAnonymous) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
