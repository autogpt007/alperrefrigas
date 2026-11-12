import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description: "Search the refrigerant, accessory and air conditioner catalog by name, with per-unit USD price and stock.",
  inputSchema: {
    query: z.string().max(100).optional().describe("Text to match in the product name, e.g. R-410A."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    let q = supabaseForUser(ctx)
      .from("products")
      .select("id, name, sku, product_type, category, price, availability, stock_quantity")
      .order("name")
      .limit(limit ?? 20);
    if (query) q = q.ilike("name", `%${query.replace(/[%_]/g, "")}%`);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const products = (data ?? []).map((p) => ({
      id: p.id, name: p.name, sku: p.sku, product_type: p.product_type, category: p.category,
      price_usd: Number(p.price), availability: p.availability, stock_quantity: p.stock_quantity == null ? null : Number(p.stock_quantity),
    }));
    return { content: [{ type: "text", text: JSON.stringify(products) }], structuredContent: { products } };
  },
});
