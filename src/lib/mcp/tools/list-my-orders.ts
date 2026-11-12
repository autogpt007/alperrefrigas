import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_orders",
  title: "List my orders",
  description: "List the signed-in customer's recent orders with status, total and tracking number.",
  inputSchema: { limit: z.number().int().min(1).max(50).optional().describe("Max orders (default 10).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const userId = ctx.getUserId();
    if (!ctx.isAuthenticated() || !userId) throw new ToolError("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .select("id, order_number, status, total_amount, tracking_number, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (error) throw new ToolError(error.message);
    const orders = (data ?? []).map((o) => ({
      id: o.id, order_number: o.order_number, status: o.status, total_usd: Number(o.total_amount),
      tracking_number: o.tracking_number, created_at: o.created_at,
    }));
    return { content: [{ type: "text", text: JSON.stringify(orders) }], structuredContent: { orders } };
  },
});
