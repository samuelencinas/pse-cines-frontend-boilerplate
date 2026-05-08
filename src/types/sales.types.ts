export interface PaymentResult {
  status: 'approved' | 'declined';
  transactionId: string;
  amount: number;
  currency: string;
  cardLast4: string;
  cardHolder?: string;
  timestamp: string;
  reason?: string;
}

export interface Sale {
  id: number;
  amount: number;
  transactionId: string;
  status: string;
  currency: string;
  cardLast4: string | null;
  tickets: number;
  createdAt: string;
  movieId: number | null;
  userId: number | null;
  showTimingId: number | null;
}

export interface CheckoutRequest {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: string;
  showTimingId: number;
  tickets: number;
}

export interface CheckoutResponse {
  payment: PaymentResult;
  sale: Sale | null;
}
