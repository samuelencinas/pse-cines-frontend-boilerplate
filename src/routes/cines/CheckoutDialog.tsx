// LAB 6: Usabilidad — diálogo modal con Stepper de 3 pasos para comprar
// entradas a una película:
//   1. Cantidad de entradas + resumen del importe.
//   2. Datos de la tarjeta (validación inline; no enviamos hasta que estén OK).
//   3. Llamada a /sales/checkout y resultado (aprobado / rechazado).
//
// Mantenemos el formulario en memoria entre pasos para que el usuario pueda
// retroceder sin perder lo escrito.
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { SalesApi } from '../../api/sales.api';
import type { CheckoutResponse } from '../../types/sales.types';
import type { CinemaSessionDto } from '../../types/cines.types';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  movieTitle: string;
  cinemaName: string;
  session: CinemaSessionDto;
  onSuccess?: () => void;
}

// LAB 6: Usabilidad — precio fijo por entrada para mantener el ejemplo simple.
// En una app real vendría del servidor (sesión / sala / horario).
const TICKET_PRICE = 8.5;
const CURRENCY = 'EUR';
const MAX_TICKETS_PER_PURCHASE = 10;

// LAB 6: Usabilidad - literales para los pasos del Stepper
const STEPS = ['Entradas', 'Pago', 'Confirmación'];

export const CheckoutDialog = ({ open, onClose, movieTitle, cinemaName, session, onSuccess }: CheckoutDialogProps) => {
  // LAB 6: Usabilidad — el máximo real es el menor entre el aforo libre y el
  // tope por compra. Si el aforo está agotado, no se puede pasar del paso 1.
  const maxTickets = Math.max(0, Math.min(MAX_TICKETS_PER_PURCHASE, session.availableSeats));
  const [activeStep, setActiveStep] = useState(0);

  // Paso 1
  const [tickets, setTickets] = useState(1);

  // Paso 2 — datos de la tarjeta
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Paso 3
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // LAB 6: Usabilidad — resetear estado cuando el diálogo se abre/cierra
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setTickets(1);
      setCardHolder('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setSubmitting(false);
      setResult(null);
      setError(null);
    }
  }, [open]);

  const amount = useMemo(() => +(tickets * TICKET_PRICE).toFixed(2), [tickets]);

  // LAB 6: Usabilidad — validación inline para deshabilitar "Siguiente" hasta
  // que los campos estén bien formados. Refleja la regex del backend.
  const cardOk = /^\d{13,19}$/.test(cardNumber.replace(/\s+/g, ''));

  // Validación de fecha simplificada (solo validamos el formato MM/YY, no la validez real de la fecha)
  const expiryOk = /^\d{2}\/\d{2}$/.test(expiryDate);
  const cvvOk = /^\d{3,4}$/.test(cvv);
  const holderOk = cardHolder.trim().length >= 3;
  const cardFormValid = cardOk && expiryOk && cvvOk && holderOk;

  // Handler para el cierre del modal — si el pago se aprobó, notificamos al componente padre para que refresque su estado
  const handleClose = () => {
    if (result?.payment.status === 'approved') onSuccess?.();
    onClose();
  };

  // Handler para el submit
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await SalesApi.checkout({
        cardHolder: cardHolder.trim(),
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expiryDate,
        cvv,
        amount,
        currency: CURRENCY,
        showTimingId: session.id,
        tickets,
      });
      setResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error desconocido en la pasarela');
    } finally {
      setSubmitting(false);
    }
  };

  // Cambio de paso
  const next = () => {
    if (activeStep === 1) {
      setActiveStep(2);
      handleSubmit();
    } else {
      setActiveStep((s) => s + 1);
    }
  };

  // Cambio de paso hacia atrás
  const back = () => setActiveStep((s) => Math.max(0, s - 1));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" color="primary.main" fontWeight={700}>
            Comprar entradas
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {movieTitle} · {cinemaName} · {session.date} {session.start}–{session.end}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* LAB 6: Usabilidad — Stepper visual con etiquetas claras */}
        <Stepper activeStep={activeStep} sx={{ my: 2 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 3 }} />

        {/* PASO 1 — Cantidad de entradas */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              ¿Cuántas entradas quieres? Precio por entrada: <strong>{TICKET_PRICE.toFixed(2)} €</strong>.
            </Typography>
            {/* LAB 6: Usabilidad — feedback claro del aforo restante.
                Si está agotado, mensaje severity=error y bloqueamos el flujo. */}
            {session.availableSeats <= 0 ? (
              <Alert severity="error">
                Esta sesión está agotada. No quedan butacas disponibles.
              </Alert>
            ) : (
              <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                Quedan <strong>{session.availableSeats}</strong> butacas libres en esta sesión.
              </Alert>
            )}
            <TextField
              label="Número de entradas"
              type="number"
              value={tickets}
              onChange={(e) =>
                setTickets(Math.max(1, Math.min(maxTickets, Number(e.target.value) || 1)))
              }
              inputProps={{ min: 1, max: Math.max(1, maxTickets) }}
              fullWidth
              autoFocus
              disabled={session.availableSeats <= 0}
              helperText={
                session.availableSeats <= 0
                  ? 'Sesión agotada'
                  : `Máximo ${maxTickets} (aforo libre: ${session.availableSeats}, tope por compra: ${MAX_TICKETS_PER_PURCHASE})`
              }
            />
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2">
                Total: <strong>{amount.toFixed(2)} {CURRENCY}</strong>
              </Typography>
            </Box>
          </Stack>
        )}

        {/* PASO 2 — Datos de tarjeta */}
        {activeStep === 1 && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Introduce los datos de tu tarjeta. Importe a cobrar:{' '}
              <strong>{amount.toFixed(2)} {CURRENCY}</strong>
            </Typography>
            <TextField
              label="Titular"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              fullWidth
              autoFocus
              autoComplete="cc-name"
              error={cardHolder.length > 0 && !holderOk}
              helperText={cardHolder.length > 0 && !holderOk ? 'Nombre demasiado corto' : ' '}
            />
            <TextField
              label="Número de tarjeta"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
              fullWidth
              autoComplete="cc-number"
              placeholder="4111 1111 1111 1111"
              error={cardNumber.length > 0 && !cardOk}
              helperText={cardNumber.length > 0 && !cardOk ? 'Entre 13 y 19 dígitos' : ' '}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Caducidad"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AA"
                autoComplete="cc-exp"
                fullWidth
                error={expiryDate.length > 0 && !expiryOk}
                helperText={expiryDate.length > 0 && !expiryOk ? 'Formato MM/AA' : ' '}
              />
              <TextField
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                inputProps={{ maxLength: 4 }}
                autoComplete="cc-csc"
                fullWidth
                error={cvv.length > 0 && !cvvOk}
                helperText={cvv.length > 0 && !cvvOk ? '3 ó 4 dígitos' : ' '}
              />
            </Stack>
          </Stack>
        )}

        {/* PASO 3 — Resultado */}
        {activeStep === 2 && (
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            {submitting && (
              <>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Procesando pago…
                </Typography>
              </>
            )}

            {!submitting && error && (
              <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
            )}

            {!submitting && result && result.payment.status === 'approved' && (
              <>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
                <Typography variant="h6" color="success.main">¡Pago aprobado!</Typography>
                <Box sx={{ width: '100%', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>Transaction ID:</strong> {result.payment.transactionId}</Typography>
                  <Typography variant="body2"><strong>Importe:</strong> {result.payment.amount.toFixed(2)} {result.payment.currency}</Typography>
                  <Typography variant="body2"><strong>Tarjeta:</strong> •••• {result.payment.cardLast4}</Typography>
                  {result.sale && (
                    <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                      Venta registrada con id #{result.sale.id}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {!submitting && result && result.payment.status === 'declined' && (
              <>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
                <Typography variant="h6" color="error.main">Pago rechazado</Typography>
                {result.payment.reason && (
                  <Alert severity="warning" sx={{ width: '100%' }}>
                    {result.payment.reason}
                  </Alert>
                )}
              </>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {activeStep === 2 ? (
          <Button onClick={handleClose} variant="contained">Cerrar</Button>
        ) : (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={back} disabled={activeStep === 0}>Atrás</Button>
            <Button
              onClick={next}
              variant="contained"
              disabled={
                (activeStep === 0 && (tickets < 1 || tickets > maxTickets || maxTickets === 0)) ||
                (activeStep === 1 && !cardFormValid)
              }
            >
              {activeStep === 1 ? `Pagar ${amount.toFixed(2)} ${CURRENCY}` : 'Siguiente'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
