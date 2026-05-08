// LAB 6: Usabilidad — landing autenticada con CTA hacia las dos secciones
// principales (Cines y Películas). Como Home vive dentro de MainLayout, el
// usuario está siempre autenticado al llegar aquí.
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  return (
    <Container maxWidth="lg">
      {/* LAB 6: Usabilidad — landing page */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 4,
          borderRadius: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'common.white',
        }}
      >
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="h3" component="h1" fontWeight={800}>
            Bienvenid@, {user?.email.split('@')[0]}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 720 }}>
            Explora los cines y consulta la cartelera.
            {isAdmin && ' Como administrador, también puedes crear y editar cines y películas directamente desde su listado.'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<TheatersIcon />}
              onClick={() => navigate('/cines')}
            >
              Ver cines
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="inherit"
              startIcon={<MovieIcon />}
              onClick={() => navigate('/movies')}
            >
              Ver películas
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* LAB 6: Usabilidad — tarjetas informativas de cada sección */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <TheatersIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Cines</Typography>
            <Typography variant="body2" color="text.secondary">
              Lista de cines con aforo y cartelera desplegable.
              {isAdmin && ' Edita o borra cines desde su tarjeta.'}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <MovieIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Películas</Typography>
            <Typography variant="body2" color="text.secondary">
              Catálogo con sesiones y filtro por título o reparto.
              {isAdmin && ' Crea, edita o borra películas desde la propia tabla.'}
            </Typography>
          </Paper>
        </Grid>
        {isAdmin && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 40 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Modo administración activo</Typography>
                <Typography variant="body2" color="text.secondary">
                  Las acciones de gestión aparecen automáticamente en cada listado.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
