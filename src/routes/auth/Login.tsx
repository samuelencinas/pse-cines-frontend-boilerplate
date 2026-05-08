// LAB 6: Usabilidad — pantalla de login centrada con feedback de error,
// estado de carga deshabilitando el botón, y soporte de "volver a la ruta
// anterior" si el usuario fue redirigido aquí desde una ruta protegida.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../auth/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      // LAB 6: Usabilidad — mostramos el mensaje de error sin romper la página
      setError(err?.response?.data?.error || err?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, md: 10 } }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3} alignItems="center">
          <LoginIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight="bold">Iniciar sesión</Typography>

          {/* LAB 6: Usabilidad — banner de error visible y accesible */}
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                autoFocus // LAB 6: Usabilidad — foco automático en el primer campo
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading} // LAB 6: Usabilidad — bloquea doble submit
              >
                {loading ? 'Iniciando…' : 'Entrar'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ¿No tienes cuenta?{' '}
            <MuiLink component="button" onClick={() => navigate('/register')}>
              Regístrate
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};
