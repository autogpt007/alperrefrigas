CREATE TABLE public.quote_submission_limits (ip_hash text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), attempts integer NOT NULL DEFAULT 0);
GRANT ALL ON public.quote_submission_limits TO service_role;
ALTER TABLE public.quote_submission_limits ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.submit_buyer_quote(payload jsonb, requester uuid, ip_hash_value text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result_id uuid; result_number text; attempts_now integer;
BEGIN
  INSERT INTO quote_submission_limits(ip_hash, attempts) VALUES(ip_hash_value, 1)
  ON CONFLICT(ip_hash) DO UPDATE SET attempts = CASE WHEN quote_submission_limits.window_start < now() - interval '5 minutes' THEN 1 ELSE quote_submission_limits.attempts + 1 END, window_start = CASE WHEN quote_submission_limits.window_start < now() - interval '5 minutes' THEN now() ELSE quote_submission_limits.window_start END RETURNING attempts INTO attempts_now;
  IF attempts_now > 5 THEN RETURN jsonb_build_object('rate_limited', true); END IF;
  INSERT INTO quotes(customer_name, customer_email, company_name, phone, shipping_address, notes, status, user_id)
  VALUES(payload->>'customer_name', payload->>'customer_email', payload->>'company_name', nullif(payload->>'phone',''), nullif(payload->>'shipping_address',''), nullif(payload->>'notes',''), 'pending', requester)
  RETURNING id, quote_number INTO result_id, result_number;
  INSERT INTO quote_items(quote_id, product_id, product_name, quantity, packaging)
  SELECT result_id, nullif(item->>'product_id','')::uuid, item->>'product_name', (item->>'quantity')::integer, item->>'packaging' FROM jsonb_array_elements(payload->'items') item;
  RETURN jsonb_build_object('id', result_id, 'quote_number', result_number);
END; $$;
REVOKE ALL ON FUNCTION public.submit_buyer_quote(jsonb, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_buyer_quote(jsonb, uuid, text) TO service_role;