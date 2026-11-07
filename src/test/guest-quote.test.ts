import { describe, it, expect } from 'vitest';
import { checkoutDestination, quoteRequestSchema } from '@/lib/quoteRequest';
describe('Guest buying', () => {
  it('allows checkout without sign-in', () => expect(checkoutDestination(false)).toBe('/checkout?guest=true'));
  it('accepts quote data without an account', () => expect(quoteRequestSchema.safeParse({ customer_name: 'Test Buyer', customer_email: 'buyer@example.com', company_name: 'Test HVAC', items: [{ product_name: 'R-134A', quantity: 5 }] }).success).toBe(true));
  it('rejects invalid quote email', () => expect(quoteRequestSchema.safeParse({ customer_name: 'Test', customer_email: 'invalid', company_name: 'HVAC', items: [{ product_name: 'R-134A', quantity: 5 }] }).success).toBe(false));
  it('rejects zero quote quantity', () => expect(quoteRequestSchema.safeParse({ customer_name: 'Test', customer_email: 'buyer@example.com', company_name: 'HVAC', items: [{ product_name: 'R-134A', quantity: 0 }] }).success).toBe(false));
});