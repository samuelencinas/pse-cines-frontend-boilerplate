import { api } from './client';
import type { CheckoutRequest, CheckoutResponse } from '../types/sales.types';

// Wrapper del API client para los endpoints de /sales/
export const SalesApi = {
  async checkout(payload: CheckoutRequest): Promise<CheckoutResponse> {
    // Codificar el payload para no enviar la tarjeta de crédito "a pincho". 
    // En este ejemplo se codifica a Base64 (no es seguro) pero para el ejemplo "de juguete" nos sirve
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    const encoded = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
    const { data } = await api.post<CheckoutResponse>('/sales/checkout', { data: encoded });
    return data;
  },
};
