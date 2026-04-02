/// <reference types="vitest/globals" />

/**
 * Input validation tests
 * Ensures user inputs are properly validated before processing
 */

function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email) && email.length <= 255;
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
}

function isValidOrderNumber(orderNum: string): boolean {
  return /^ORD-\d{8}-\d{4}$/.test(orderNum);
}

describe("Email Validation", () => {
  it("should accept valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.co")).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
  });

  it("should reject emails exceeding 255 chars", () => {
    const longEmail = "a".repeat(250) + "@b.com";
    expect(isValidEmail(longEmail)).toBe(false);
  });
});

describe("Input Sanitization", () => {
  it("should strip script tags", () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe("Hello");
  });

  it("should remove angle brackets", () => {
    expect(sanitizeInput("<div>test</div>")).toBe("divtest/div");
  });

  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("should handle clean input unchanged", () => {
    expect(sanitizeInput("Normal text here")).toBe("Normal text here");
  });
});

describe("Order Number Validation", () => {
  it("should accept valid order numbers", () => {
    expect(isValidOrderNumber("ORD-20260401-0001")).toBe(true);
  });

  it("should reject invalid order numbers", () => {
    expect(isValidOrderNumber("")).toBe(false);
    expect(isValidOrderNumber("ORD-123")).toBe(false);
    expect(isValidOrderNumber("INVALID")).toBe(false);
  });
});
