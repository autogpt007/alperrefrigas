-- Remove duplicate kyc_verifications rows per order, keeping only the newest
DELETE FROM public.kyc_verifications
WHERE id NOT IN (
  SELECT DISTINCT ON (order_id) id
  FROM public.kyc_verifications
  ORDER BY order_id, created_at DESC
);

-- Add unique constraint so one order can only have one KYC record
ALTER TABLE public.kyc_verifications
ADD CONSTRAINT kyc_verifications_order_id_unique UNIQUE (order_id);