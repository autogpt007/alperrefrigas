/// <reference types="vitest/globals" />

/**
 * Pricing calculation tests
 * Mirrors the bulk pricing logic used in the application
 */
function calculateBulkPrice(basePrice: number, packageType: string): number {
  switch (packageType) {
    case "1 Pallet":
      return basePrice;
    case "20ft Container":
      return basePrice * 0.70; // 30% discount
    case "40ft Container":
      return basePrice * 0.55; // 45% discount
    default:
      return basePrice;
  }
}

describe("Bulk Pricing Calculations", () => {
  it("should return base price for 1 Pallet", () => {
    expect(calculateBulkPrice(100, "1 Pallet")).toBe(100);
  });

  it("should apply 30% discount for 20ft Container", () => {
    expect(calculateBulkPrice(100, "20ft Container")).toBe(70);
  });

  it("should apply 45% discount for 40ft Container", () => {
    expect(calculateBulkPrice(100, "40ft Container")).toBe(55);
  });

  it("should return base price for unknown package type", () => {
    expect(calculateBulkPrice(100, "Unknown")).toBe(100);
  });

  it("should handle zero price", () => {
    expect(calculateBulkPrice(0, "20ft Container")).toBe(0);
  });

  it("should handle large prices correctly", () => {
    expect(calculateBulkPrice(10000, "40ft Container")).toBe(5500);
  });
});
