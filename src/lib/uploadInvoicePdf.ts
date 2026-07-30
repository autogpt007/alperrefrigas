import { supabase } from "@/integrations/supabase/client";

const BUCKET = "customer-invoices";
/** Signed links live for a year so buyers can re-download from their email. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 365;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface UploadedPdf {
  path: string;
  signedUrl: string;
}

/**
 * Uploads a generated document PDF to private storage and returns a
 * long-lived signed URL. Retries transient network/storage failures.
 */
export const uploadInvoicePdf = async (
  blob: Blob,
  documentNumber: string,
  attempts = 3
): Promise<UploadedPdf> => {
  const path = `${new Date().getFullYear()}/${documentNumber}.pdf`;
  let lastError: unknown = null;

  for (let i = 0; i < attempts; i++) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (!error) {
      const { data, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signError || !data?.signedUrl) throw signError || new Error("Could not sign PDF URL");
      return { path, signedUrl: data.signedUrl };
    }
    lastError = error;
    await sleep(500 * (i + 1));
  }

  throw lastError instanceof Error ? lastError : new Error("PDF upload failed");
};
