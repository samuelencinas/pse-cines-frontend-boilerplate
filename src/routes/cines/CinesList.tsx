import { useEffect, useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { Container, Typography, Grid, Box, CircularProgress } from "@mui/material";
import type { CinemaResponseDto } from "../../types/cines.types";
import { CineCard } from "./CineCard";

export const CinesList = () => {
    const [cines, setCines] = useState<CinemaResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Llamada a la API con cartelera (implementación simple no, lo siguiente)
        axios.post('http://localhost:3000/cinemas', { withCatalog: true }).then((res: AxiosResponse) => {
            const { data } = res;
            if (data && data.length > 0) {
                setCines(data as CinemaResponseDto[]);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="800" color="primary.main" gutterBottom>
                    Nuestros Cines
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Descubre la cartelera en nuestros cines y no te pierdas ningún estreno.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (!cines || cines.length === 0) ? (
                <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
                    No hay cines disponibles en este momento.
                </Typography>
            ) : (
                <Grid container spacing={4} alignItems="stretch">
                    {cines.map((cinema: CinemaResponseDto) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cinema.id}>
                            <CineCard cinema={cinema} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}