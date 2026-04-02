import { describe, it, expect } from "vitest";

/**
 * Cart logic tests
 * Tests cart calculations independent of React context
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

function calculateTotal(subtotal: number, tax: number, shipping: number): number {
  return Math.round((subtotal + tax + shipping) * 100) / 100;
}

const sampleItems: CartItem[] = [
  { id: "1", name: "R-134a", price: 150, quantity: 2 },
  { id: "2", name: "R-410a", price: 200, quantity: 1 },
];

describe("Cart Calculations", () => {
  it("should calculate subtotal correctly", () => {
    expect(calculateSubtotal(sampleItems)).toBe(500);
  });

  it("should handle empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("should calculate tax correctly", () => {
    expect(calculateTax(500, 0.08)).toBe(40);
  });

  it("should calculate total with tax and shipping", () => {
    expect(calculateTotal(500, 40, 25)).toBe(565);
  });

  it("should handle zero tax rate", () => {
    expect(calculateTax(500, 0)).toBe(0);
  });

  it("should handle free shipping", () => {
    expect(calculateTotal(500, 40, 0)).toBe(540);
  });
});
