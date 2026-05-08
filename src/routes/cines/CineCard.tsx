import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Collapse,
  Box,
  Divider,
  IconButton,
  Tooltip,
  ButtonBase,
  useTheme,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, AccessAlarm, Theaters, Place } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import type { CinemaResponseDto, CinemaSessionDto } from "../../types/cines.types";
import { CheckoutDialog } from "./CheckoutDialog";

interface CineProps {
    cinema: CinemaResponseDto;
    // LAB 6: Usabilidad — handlers opcionales: si están definidos, la card
    // muestra los botones admin; si no, no se renderiza nada al respecto.
    onEdit?: () => void;
    onDelete?: () => void;
    // Notificación al padre cuando una compra se cierra con éxito, para que
    // pueda recargar el listado y reflejar el nuevo aforo libre.
    onPurchaseComplete?: () => void;
}

interface ChosenSession {
  movieId: number;
  movieTitle: string;
  session: CinemaSessionDto;
}

export const CineCard = ({ cinema, onEdit, onDelete, onPurchaseComplete }: CineProps) => {
  const [expanded, setExpanded] = useState(false);
  // LAB 6: Usabilidad — guardamos la sesión seleccionada en estado para
  // abrir el modal de checkout con el contexto correcto (sesión + película).
  const [chosen, setChosen] = useState<ChosenSession | null>(null);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const hasCatalog = cinema.catalog && cinema.catalog.length > 0;

  return (
    <Card 
      elevation={3}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          height: 140, 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <Theaters sx={{ fontSize: 60, opacity: 0.8 }} />
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography gutterBottom color="primary.main" variant="h5" component="h2" fontWeight="bold">
          {cinema.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
          <Place fontSize="small" />
          <Typography variant="body2">
            Aforo: {cinema.capacity} personas
          </Typography>
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ px: 2, py: 1.5, gap: 1 }}>
        {hasCatalog ? (
          <Button
            size="small"
            variant={expanded ? "contained" : "outlined"}
            color="primary"
            onClick={handleExpandClick}
            endIcon={<ExpandMoreIcon sx={{
              transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s'
            }} />}
            disableElevation
            sx={{ borderRadius: 2 }}
          >
            {expanded ? 'Ocultar Cartelera' : 'Ver Cartelera'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, ml: 1, fontStyle: 'italic' }}>
            Sin cartelera disponible
          </Typography>
        )}

        {/* LAB 6: Usabilidad — botones admin sólo si los handlers existen.
            Quien decide si esto se muestra es el padre (CinesList), que
            sólo pasa los handlers cuando el usuario es ADMIN. */}
        {(onEdit || onDelete) && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <Tooltip title="Editar">
                <IconButton size="small" color="primary" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Borrar">
                <IconButton size="small" color="error" onClick={onDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
          {cinema.catalog?.map((movie) => (
            <Box key={movie.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
                {movie.title}
              </Typography>
              {/* LAB 6: Usabilidad — cada sesión es un único botón clicable.
                  Muestra horario y plazas libres; cuando se agotan, queda
                  deshabilitada y con un texto "Agotada" en lugar de las plazas. */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.sessions.map((session) => {
                  const soldOut = session.availableSeats <= 0;
                  return (
                    <ButtonBase
                      key={session.id}
                      disabled={soldOut}
                      onClick={() => setChosen({ movieId: movie.id, movieTitle: movie.title, session })}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.25,
                        py: 0.75,
                        borderRadius: 1,
                        border: '1px solid rgba(0,0,0,0.12)',
                        bgcolor: 'background.paper',
                        color: soldOut ? 'text.disabled' : 'text.primary',
                        transition: 'background-color 0.15s, border-color 0.15s, transform 0.15s',
                        '&:not(:disabled):hover': {
                          bgcolor: 'rgba(94, 53, 177, 0.08)',
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)',
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${theme.palette.primary.main}`,
                          outlineOffset: 2,
                        },
                      }}
                    >
                      <AccessAlarm sx={{ fontSize: 14 }} />
                      <Typography variant="caption" fontWeight={600}>
                        {session.start} - {session.end}
                      </Typography>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.25,
                          ml: 0.5,
                          color: soldOut ? 'error.main' : 'success.main',
                        }}
                      >
                        <EventSeatIcon sx={{ fontSize: 13 }} />
                        <Typography variant="caption" fontWeight={600}>
                          {soldOut ? 'Agotada' : `${session.availableSeats}`}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  );
                })}
                {movie.sessions.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No hay sesiones
                  </Typography>
                )}
              </Box>
              <Divider sx={{ mt: 1.5, opacity: 0.5 }} />
            </Box>
          ))}
        </Box>
      </Collapse>

      {/* LAB 6: Usabilidad — modal de checkout fuera del Collapse para que
          su animación no dependa del estado de expansión. */}
      {chosen && (
        <CheckoutDialog
          open={chosen !== null}
          onClose={() => setChosen(null)}
          movieTitle={chosen.movieTitle}
          cinemaName={cinema.name}
          session={chosen.session}
          onSuccess={onPurchaseComplete}
        />
      )}
    </Card>
  );
}