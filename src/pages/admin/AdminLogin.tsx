import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
  Alert,
} from '@mui/joy';
import { signInWithEmail, signUpWithEmail } from '../../firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.level1',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 4 }}>
        <Typography level="h2" sx={{ mb: 1 }}>
          Admin Login
        </Typography>
        <Typography level="body-sm" sx={{ mb: 3 }}>
          {isSignUp ? 'Create admin account' : 'Sign in to manage your shop'}
        </Typography>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@peixeshop.com"
              required
            />
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormControl>

          <Button type="submit" fullWidth loading={loading} sx={{ mb: 2 }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <Button
            variant="plain"
            fullWidth
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'Need an account? Sign up'}
          </Button>
        </form>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.softBg', borderRadius: 'sm' }}>
          <Typography level="body-sm" sx={{ color: 'warning.plainColor' }}>
            ⚠️ Note: Add your email to ADMIN_EMAILS in ProtectedRoute.tsx
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
