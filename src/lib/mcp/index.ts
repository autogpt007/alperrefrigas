import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import listMyOrders from "./tools/list-my-orders";
import listMyQuotes from "./tools/list-my-quotes";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "alperrefrigas",
  title: "alperrefrigas",
  version: "0.1.0",
  instructions: "Tools for Alper Refrigerants: search the wholesale catalog and check your own orders and quote requests.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProducts, listMyOrders, listMyQuotes],
});
