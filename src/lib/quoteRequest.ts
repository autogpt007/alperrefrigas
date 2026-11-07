import { z } from 'zod';

export const quoteRequestSchema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_email: z.string().trim().email().max(255),
  company_name: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(40).optional(),
  shipping_address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  items: z.array(z.object({
    product_id: z.string().uuid().nullable().optional(),
    product_name: z.string().trim().min(1).max(300),
    quantity: z.number().int().min(1).max(100000),
    packaging: z.string().max(120).optional(),
  })).min(1).max(100),
});

export const checkoutDestination = (signedIn: boolean) => signedIn ? '/checkout' : '/checkout?guest=true';