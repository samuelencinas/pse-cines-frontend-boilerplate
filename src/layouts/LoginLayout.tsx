// LAB 6: Usabilidad — layout específico para las pantallas de autenticación
// (login y registro). No tiene sidebar ni AppBar para no distraer del
// formulario, y centra el contenido vertical y horizontalmente con un
// fondo neutro que destaca la tarjeta del formulario.
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters';
import { useAuth } from '../auth/AuthContext';

export const LoginLayout = () => {
  const { isAuthenticated } = useAuth();

  // LAB 6: Usabilidad — si el usuario ya está autenticado no tiene sentido
  // que vuelva a ver login/registro: lo mandamos al inicio.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      {/* LAB 6: Usabilidad — branding sutil en la cabecera del layout de auth */}
      <Container maxWidth="sm" sx={{ pt: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'common.white' }}>
          <TheatersIcon sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={800}>
            Cines PSE
          </Typography>
        </Stack>
      </Container>

      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Outlet />
      </Box>

      <Box sx={{ py: 2, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
        <Typography variant="caption">
          PSE 2025-2026 · Práctica Guiada
        </Typography>
      </Box>
    </Box>
  );
};
