// LAB 6: Usabilidad — pantalla 403 explícita en lugar de devolver al usuario
// a una pantalla en blanco cuando intenta entrar a una zona sin permiso.
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from 'react-router-dom';

export const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            bgcolor: 'error.light',
            color: 'error.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BlockIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h4" fontWeight={800}>Acceso denegado</Typography>
        <Typography color="text.secondary">
          No tienes permisos para ver esta sección. Si crees que es un error,
          contacta con el administrador.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Volver al inicio</Button>
      </Stack>
    </Container>
  );
};
