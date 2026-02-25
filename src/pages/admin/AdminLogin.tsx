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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signInWithEmail } from '../../firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Email ou senha incorretos.'
          : err.code === 'auth/too-many-requests'
          ? 'Muitas tentativas. Tente novamente mais tarde.'
          : 'Falha na autenticação. Verifique suas credenciais.'
      );
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
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, textAlign: 'center' }}>
        <Box sx={{ mx: 'auto', mb: 2, width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.softBg', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 28, color: 'primary.500' }} />
        </Box>
        <Typography level="h3" sx={{ mb: 0.5 }}>
          Painel Administrativo
        </Typography>
        <Typography level="body-sm" sx={{ mb: 3, color: 'text.secondary' }}>
          Acesse com suas credenciais de administrador
        </Typography>

        {error && (
          <Alert color="danger" sx={{ mb: 2, textAlign: 'left' }}>
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
              placeholder="admin@vigano.com.br"
              required
            />
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormControl>

          <Button type="submit" fullWidth loading={loading} size="lg">
            Entrar
          </Button>
        </form>
      </Card>
    </Box>
  );
}
