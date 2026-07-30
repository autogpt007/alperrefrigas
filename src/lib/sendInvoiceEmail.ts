import { supabase } from "@/integrations/supabase/client";

export interface SendInvoiceEmailArgs {
  /** Row id in generated_documents — the PDF is pulled server-side from storage. */
  documentId: string;
  recipientEmail: string;
}

/**
 * Emails the buyer the generated quote / invoice with the PDF attached
 * directly to the message (no download link).
 */
export const sendInvoiceEmail = async (args: SendInvoiceEmailArgs) => {
  const { data, error } = await supabase.functions.invoke("send-invoice-document", {
    body: {
      documentId: args.documentId,
      recipientEmail: args.recipientEmail,
    },
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.error || "Email was not sent");
  }
  if (data && data.error) throw new Error(data.error);
  return data;
};
