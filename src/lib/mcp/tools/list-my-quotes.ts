import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_quotes",
  title: "List my quote requests",
  description: "List the signed-in customer's wholesale quote requests and their status.",
  inputSchema: { limit: z.number().int().min(1).max(50).optional().describe("Max quotes (default 10).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const userId = ctx.getUserId();
    if (!ctx.isAuthenticated() || !userId) throw new ToolError("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("quotes")
      .select("id, quote_number, status, company_name, created_at, quote_items(product_name, quantity, packaging)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (error) throw new ToolError(error.message);
    const quotes = (data ?? []).map((q) => ({
      id: q.id, quote_number: q.quote_number, status: q.status, company_name: q.company_name, created_at: q.created_at,
      items: (q.quote_items ?? []).map((i) => ({ product_name: i.product_name, quantity: Number(i.quantity), packaging: i.packaging })),
    }));
    return { content: [{ type: "text", text: JSON.stringify(quotes) }], structuredContent: { quotes } };
  },
});
