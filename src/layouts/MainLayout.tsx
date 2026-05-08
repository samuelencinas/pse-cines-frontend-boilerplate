// LAB 6: Usabilidad — layout principal con Drawer lateral
// permanente en escritorio y temporal (hamburguesa) en móvil.
import { useState } from 'react';
import { Outlet, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../auth/AuthContext';

const DRAWER_WIDTH = 240; // LAB 6: Usabilidad — anchura fija del drawer

interface NavEntry {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: Array<'CLIENT' | 'CINEMA' | 'ADMIN'>;
}

// Ítems del menú
const NAV_ENTRIES: NavEntry[] = [
  { label: 'Inicio',    to: '/',       icon: <HomeIcon /> },
  { label: 'Cines',     to: '/cines',  icon: <TheatersIcon /> },
  { label: 'Películas', to: '/movies', icon: <MovieIcon /> },
];

export const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, hasRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // LAB 6: Usabilidad — el layout principal exige sesión: si entra un usuario
  // no autenticado, lo redirigimos a /login conservando la ruta de origen
  // para devolverlo aquí tras hacer login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // LAB 6: Usabilidad — entradas filtradas por rol para no mostrar enlaces a los que el usuario no podría acceder
  const visibleEntries = NAV_ENTRIES.filter(
    (e) => !e.roles || hasRole(...(e.roles as any))
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TheatersIcon color="primary" />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Cines PSE
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {visibleEntries.map((entry) => (
          <ListItem key={entry.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={entry.to}
              end={entry.to === '/'}
              onClick={() => setMobileOpen(false)}
              // LAB 6: Usabilidad — feedback visual del enlace activo vía la API de NavLink
              sx={{
                '&.active': {
                  bgcolor: 'action.selected',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <ListItemIcon>{entry.icon}</ListItemIcon>
              <ListItemText primary={entry.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* LAB 6: Usabilidad — sección de usuario al pie del drawer.
          Como MainLayout exige sesión, aquí siempre habrá un usuario. */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{user!.email[0].toUpperCase()}</Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap>{user!.email}</Typography>
            <Chip label={user!.role} size="small" color="primary" variant="outlined" />
          </Box>
          <Tooltip title="Cerrar sesión">
            <IconButton
              onClick={() => {
                logout();
                navigate('/login');
              }}
              size="small"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* LAB 6: Usabilidad — AppBar fija, anclada a la derecha del drawer en desktop */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          {/* LAB 6: Usabilidad — botón hamburguesa sólo visible en móvil */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="abrir menú"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cines PSE — Práctica Guiada
          </Typography>
        </Toolbar>
      </AppBar>

      {/* LAB 6: Usabilidad — drawer responsive: temporal en móvil, permanente en desktop */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }} // LAB 6: Usabilidad — mejor rendimiento en móvil
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* LAB 6: Usabilidad — main: padding superior compensa la AppBar fija */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
