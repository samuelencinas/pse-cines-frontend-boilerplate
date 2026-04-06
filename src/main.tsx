import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'
import { CinesList } from './routes/cines/CinesList.tsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // Deep Purple
      light: '#9062e5',
      dark: '#280680',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7b1fa2', // Secondary Purple
      light: '#ae52d4',
      dark: '#4a0072',
      contrastText: '#fff',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={App}/>
          <Route path="/cines" Component={CinesList}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
