// LAB 6: Usabilidad — listado de cines con CRUD integrado.
// Los botones de Editar/Borrar se muestran únicamente a usuarios con rol
// ADMIN; el resto de roles ven sólo la cartelera. La acción "Nuevo cine"
// también queda escondida para los no-admin.
import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import type { CinemaResponseDto } from "../../types/cines.types";
import { CineCard } from "./CineCard";
import { CinesApi } from "../../api/cines.api";
import { useAuth } from "../../auth/AuthContext";

interface CinemaForm { id?: number; name: string; capacity: number }

export const CinesList = () => {
    const { hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN');
    const [cines, setCines] = useState<CinemaResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // CRUD state
    const [editing, setEditing] = useState<CinemaForm | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<CinemaResponseDto | null>(null);
    const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

    const reload = () => {
        setLoading(true);
        setError(null);
        CinesApi.list({ withCatalog: true })
            .then((data) => setCines(data ?? []))
            .catch((err) =>
                setError(err?.response?.data?.error || err?.message || 'No se pudieron cargar los cines')
            )
            .finally(() => setLoading(false));
    };

    useEffect(reload, []);

    const onSubmit = async (form: CinemaForm) => {
        try {
            if (form.id) {
                await CinesApi.update(form.id, { name: form.name, capacity: form.capacity });
                setSnack({ msg: 'Cine actualizado', severity: 'success' });
            } else {
                await CinesApi.create({ name: form.name, capacity: form.capacity });
                setSnack({ msg: 'Cine creado', severity: 'success' });
            }
            setEditing(null);
            reload();
        } catch (e: any) {
            setSnack({ msg: e?.response?.data?.error || 'Error al guardar', severity: 'error' });
        }
    };

    const onDelete = async (id: number) => {
        try {
            await CinesApi.remove(id);
            setSnack({ msg: 'Cine borrado', severity: 'success' });
            setConfirmDelete(null);
            reload();
        } catch (e: any) {
            setSnack({ msg: e?.response?.data?.error || 'Error al borrar', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* LAB 6: Usabilidad — encabezado con jerarquía y subtítulo descriptivo */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="800" color="primary.main" gutterBottom>
                    Nuestros Cines
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Descubre la cartelera en nuestros cines y no te pierdas ningún estreno.
                </Typography>
            </Box>

            {/* LAB 6: Usabilidad — barra de acciones, sólo visible para administradores */}
            {isAdmin && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setEditing({ name: '', capacity: 100 })}
                    >
                        Nuevo cine
                    </Button>
                </Stack>
            )}

            {/* LAB 6: Usabilidad — tres estados claros: cargando / error / contenido */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
            ) : (!cines || cines.length === 0) ? (
                <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
                    No hay cines disponibles en este momento.
                </Typography>
            ) : (
                <Grid container spacing={4} alignItems="stretch">
                    {cines.map((cinema: CinemaResponseDto) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cinema.id}>
                            <CineCard
                                cinema={cinema}
                                // LAB 6: Usabilidad — sólo el admin recibe los handlers,
                                // así que la card decide internamente si renderiza los botones.
                                onEdit={isAdmin ? () => setEditing({ id: cinema.id, name: cinema.name, capacity: cinema.capacity }) : undefined}
                                onDelete={isAdmin ? () => setConfirmDelete(cinema) : undefined}
                                // LAB 6: Usabilidad — tras una compra recargamos el catálogo
                                // para que las plazas libres se actualicen al instante.
                                onPurchaseComplete={reload}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Diálogo de creación/edición — sólo lo abrimos desde botones de admin */}
            <CinemaDialog form={editing} onClose={() => setEditing(null)} onSubmit={onSubmit} />

            {/* LAB 6: Usabilidad — confirmación explícita antes de un borrado destructivo */}
            <Dialog open={confirmDelete !== null} onClose={() => setConfirmDelete(null)}>
                <DialogTitle>Confirmar borrado</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Seguro que quieres borrar el cine "{confirmDelete?.name}"? Se eliminarán también sus sesiones.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={() => confirmDelete && onDelete(confirmDelete.id)}>
                        Borrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* LAB 6: Usabilidad — Snackbar centralizado para feedback no intrusivo */}
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

const CinemaDialog = ({
    form,
    onClose,
    onSubmit,
}: {
    form: CinemaForm | null;
    onClose: () => void;
    onSubmit: (f: CinemaForm) => void;
}) => {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(100);

    useEffect(() => {
        if (form) {
            setName(form.name);
            setCapacity(form.capacity);
        }
    }, [form]);

    return (
        <Dialog open={form !== null} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{form?.id ? 'Editar cine' : 'Nuevo cine'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus // LAB 6: Usabilidad — foco automático al abrir
                        fullWidth
                    />
                    <TextField
                        label="Aforo"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 1 }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    disabled={!name.trim() || capacity <= 0}
                    onClick={() => onSubmit({ id: form?.id, name: name.trim(), capacity })}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
