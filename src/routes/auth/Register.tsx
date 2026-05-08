// LAB 6: Usabilidad — pantalla de registro paralela a Login, con validación
// de longitud mínima de contraseña y confirmación inline para evitar errores
// silenciosos.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../auth/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, md: 10 } }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3} alignItems="center">
          <PersonAddIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight="bold">Crear cuenta</Typography>

          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                autoComplete="new-password"
                helperText="Mínimo 6 caracteres" // LAB 6: Usabilidad — esperar antes de fallar
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Creando…' : 'Registrarme'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <MuiLink component="button" onClick={() => navigate('/login')}>
              Inicia sesión
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};
