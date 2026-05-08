// LAB 6: Usabilidad — sección de Películas: tabla con sesiones, búsqueda
// rápida por título y, sólo para administradores, acciones inline de
// crear/editar/borrar.
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import type { MovieResponseDto } from '../../types/movies.types';
import { MoviesApi } from '../../api/movies.api';
import { useAuth } from '../../auth/AuthContext';

interface MovieForm { id?: number; title: string; cast: string }

export const MoviesList = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN'); // LAB 6: Usabilidad — gating de acciones por rol

  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [editing, setEditing] = useState<MovieForm | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MovieResponseDto | null>(null);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const reload = () => {
    setLoading(true);
    setError(null);
    MoviesApi.list({})
      .then((d) => setMovies(d ?? []))
      .catch((err) =>
        setError(err?.response?.data?.error || err?.message || 'No se pudieron cargar las películas')
      )
      .finally(() => setLoading(false));
  };

  useEffect(reload, []);

  // LAB 6: Usabilidad — filtro inmediato en cliente, sin pegarle al servidor por cada tecla
  const filtered = useMemo(() => {
    if (!query.trim()) return movies;
    const q = query.toLowerCase();
    return movies.filter(
      (m) => m.title.toLowerCase().includes(q) || m.cast.toLowerCase().includes(q)
    );
  }, [movies, query]);

  const onSubmit = async (form: MovieForm) => {
    try {
      if (form.id) {
        await MoviesApi.update(form.id, { title: form.title, cast: form.cast });
        setSnack({ msg: 'Película actualizada', severity: 'success' });
      } else {
        await MoviesApi.create({ title: form.title, cast: form.cast });
        setSnack({ msg: 'Película creada', severity: 'success' });
      }
      setEditing(null);
      reload();
    } catch (e: any) {
      setSnack({ msg: e?.response?.data?.error || 'Error al guardar', severity: 'error' });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await MoviesApi.remove(id);
      setSnack({ msg: 'Película borrada', severity: 'success' });
      setConfirmDelete(null);
      reload();
    } catch (e: any) {
      setSnack({ msg: e?.response?.data?.error || 'Error al borrar', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* LAB 6: Usabilidad — encabezado con icono y descriptor de la sección */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <MovieIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            Películas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catálogo y sesiones programadas.
          </Typography>
        </Box>
      </Stack>

      {/* LAB 6: Usabilidad — barra de filtros + acción de admin alineadas */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="Buscar por título o reparto"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditing({ title: '', cast: '' })}
          >
            Nueva película
          </Button>
        )}
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {query ? 'Ninguna película coincide con tu búsqueda.' : 'Todavía no hay películas en el catálogo.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Reparto</TableCell>
                <TableCell>Sesiones</TableCell>
                {isAdmin && <TableCell align="right">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.id}</TableCell>
                  <TableCell><strong>{m.title}</strong></TableCell>
                  <TableCell>{m.cast}</TableCell>
                  <TableCell>
                    {m.sessions && m.sessions.length > 0 ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {m.sessions.map((s, i) => (
                          <Chip
                            key={i}
                            size="small"
                            variant="outlined"
                            label={`${s.cinema} · ${s.day} ${s.start}`}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Sin sesiones
                      </Typography>
                    )}
                  </TableCell>
                  {/* LAB 6: Usabilidad — columna de acciones sólo cuando hay rol ADMIN */}
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => setEditing({ id: m.id, title: m.title, cast: m.cast })}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Borrar">
                        <IconButton color="error" onClick={() => setConfirmDelete(m)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MovieDialog form={editing} onClose={() => setEditing(null)} onSubmit={onSubmit} />

      <Dialog open={confirmDelete !== null} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirmar borrado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que quieres borrar la película "{confirmDelete?.title}"? Se eliminarán también sus sesiones.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={() => confirmDelete && onDelete(confirmDelete.id)}>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack !== null}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack?.severity ?? 'success'} variant="filled" onClose={() => setSnack(null)}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// ---- Diálogo de formulario ------------------------------------------------

const MovieDialog = ({
  form,
  onClose,
  onSubmit,
}: {
  form: MovieForm | null;
  onClose: () => void;
  onSubmit: (f: MovieForm) => void;
}) => {
  const [title, setTitle] = useState('');
  const [cast, setCast] = useState('');

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setCast(form.cast);
    }
  }, [form]);

  return (
    <Dialog open={form !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form?.id ? 'Editar película' : 'Nueva película'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus fullWidth />
          <TextField
            label="Reparto"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            helperText="Lista de actores separados por comas"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!title.trim() || !cast.trim()}
          onClick={() => onSubmit({ id: form?.id, title: title.trim(), cast: cast.trim() })}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
