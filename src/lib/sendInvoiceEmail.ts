import { supabase } from "@/integrations/supabase/client";

export interface SendInvoiceEmailArgs {
  recipientEmail: string;
  buyerName: string;
  docNumber: string;
  docType: "invoice" | "quote";
  total: number;
  currency: string;
  pdfUrl: string;
  paymentTerms?: string | null;
  paymentNotes?: string | null;
  idempotencyKey?: string;
}

/**
 * Queues the branded delivery email containing a secure download link to the
 * generated quote / invoice PDF.
 */
export const sendInvoiceEmail = async (args: SendInvoiceEmailArgs) => {
  const total = Number(args.total || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const { data, error } = await supabase.functions.invoke("send-transactional-email", {
    body: {
      templateName: "invoice-delivery",
      recipientEmail: args.recipientEmail,
      idempotencyKey:
        args.idempotencyKey || `invoice-${args.docNumber}-${args.recipientEmail}-${Date.now()}`,
      templateData: {
        buyerName: args.buyerName,
        docNumber: args.docNumber,
        docType: args.docType,
        total,
        currency: args.currency,
        pdfUrl: args.pdfUrl,
        paymentTerms: args.paymentTerms || null,
        paymentNotes: args.paymentNotes || null,
      },
    },
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.reason || "Email was not sent");
  }
  return data;
};
