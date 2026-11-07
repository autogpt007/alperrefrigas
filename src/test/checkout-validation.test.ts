import { describe, it, expect } from 'vitest';
import { buyerFieldErrors } from '@/lib/checkoutValidation';
const complete = { customerName: 'Buyer', customerEmail: 'buyer@example.com', phoneNumber: '7869870501', street: 'Test street', city: 'Paris', zipCode: '75001', countryCode: 'FR', paymentMethod: 'bank_wire' };
describe('Buyer checkout fields', () => {
  it('allows international destinations without a US state', () => expect(buyerFieldErrors(complete)).toEqual({}));
  it('requires a state for US destinations', () => expect(buyerFieldErrors({ ...complete, countryCode: 'US' }).state).toBe('This field is required.'));
  it('requires card details only when card is selected', () => expect(buyerFieldErrors({ ...complete, paymentMethod: 'credit_card' }).cardNumber).toBe('This field is required.'));
});