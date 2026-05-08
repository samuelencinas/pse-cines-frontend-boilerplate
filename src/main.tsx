import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { LoginLayout } from './layouts/LoginLayout';
import { Home } from './routes/Home';
import { Login } from './routes/auth/Login';
import { Register } from './routes/auth/Register';
import { CinesList } from './routes/cines/CinesList';
import { MoviesList } from './routes/movies/MoviesList';
import { Forbidden } from './routes/Forbidden';

// LAB 6: Usabilidad — tema MUI centralizado: paleta, tipografía y forma
// de los componentes coherentes en toda la app.
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1',
      light: '#9062e5',
      dark: '#280680',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#ae52d4',
      dark: '#4a0072',
      contrastText: '#fff',
    },
    background: {
      default: '#f6f5fb',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 }, // LAB 6: Usabilidad — botones sin MAYÚSCULAS forzadas
  },
  components: {
    // LAB 6: Usabilidad — los títulos de los modales en color primario
    // (morado) para que destaquen claramente sobre el fondo blanco del Dialog.
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#5e35b1',
          fontWeight: 700,
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* LAB 6: Usabilidad — Layout específico para autenticación
                (sin sidebar/AppBar para no distraer del formulario). */}
            <Route element={<LoginLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* LAB 6: Usabilidad — Layout principal autenticado: si llega un
                usuario sin sesión, MainLayout redirige internamente a /login. */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cines" element={<CinesList />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route
                path="/movies"
                element={
                  <ProtectedRoute roles={['CINEMA', 'ADMIN']}>
                    <MoviesList />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
