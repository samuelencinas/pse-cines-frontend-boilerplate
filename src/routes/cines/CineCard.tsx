import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button,
  Collapse,
  Box,
  Chip,
  Divider,
  useTheme
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, AccessAlarm, Theaters, Place } from '@mui/icons-material';
import type { CinemaResponseDto } from "../../types/cines.types";

interface CineProps {
    cinema: CinemaResponseDto;
}

export const CineCard = ({ cinema }: CineProps) => {
  const [expanded, setExpanded] = useState(false);
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
      
      <CardActions sx={{ px: 2, py: 1.5 }}>
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
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
          {cinema.catalog?.map((movie) => (
            <Box key={movie.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.sessions.map((session, idx) => (
                  <Chip
                    key={idx}
                    icon={<AccessAlarm sx={{ fontSize: '14px !important' }} />}
                    label={`${session.start} - ${session.end}`}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1, 
                      bgcolor: 'background.paper',
                      borderColor: 'rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
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
    </Card>
  );
}