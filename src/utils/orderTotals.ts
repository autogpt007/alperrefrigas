/**
 * Order total breakdown.
 *
 * `total_amount` is the NET amount charged: gross line items, minus any coupon
 * discount, minus the bank-wire settlement discount, plus shipping and tax.
 * Showing `total_amount - shipping - tax` as the subtotal therefore hides the
 * discounts and makes the arithmetic look wrong. This derives every line.
 */

export interface OrderLineItem {
  price?: number | null;
  quantity?: number | null;
}

export interface OrderTotalsInput {
  total_amount: number;
  shipping_cost?: number | null;
  tax_amount?: number | null;
  payment_details?: Record<string, unknown> | null;
  order_items?: OrderLineItem[] | null;
  items?: unknown;
}

export interface OrderTotals {
  itemsSubtotal: number;
  couponDiscount: number;
  couponCode: string | null;
  paymentDiscount: number;
  paymentDiscountPercent: number | null;
  paymentDiscountLabel: string;
  shipping: number;
  tax: number;
  total: number;
  /** True when the line items reconcile with the stored total. */
  reconciles: boolean;
}

const num = (value: unknown): number => {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : 0;
};

const PAYMENT_DISCOUNT_LABELS: Record<string, string> = {
  bank_wire: 'Bank Wire Settlement Discount',
};

export const calculateOrderTotals = (order: OrderTotalsInput): OrderTotals => {
  const details = (order.payment_details ?? {}) as Record<string, unknown>;

  const lineItems: OrderLineItem[] = Array.isArray(order.order_items) && order.order_items.length
    ? order.order_items
    : Array.isArray(order.items)
      ? (order.items as OrderLineItem[])
      : [];

  const grossFromLines = lineItems.reduce(
    (sum, item) => sum + num(item?.price) * (num(item?.quantity) || 0),
    0
  );

  const couponDiscount = num(details.discount_amount);
  const couponCode = typeof details.coupon_code === 'string' && details.coupon_code
    ? details.coupon_code
    : null;

  const paymentDiscount = num(details.payment_discount_amount);
  const rawPercent = num(details.payment_discount_percent);
  const paymentDiscountPercent = rawPercent > 0 ? rawPercent : null;
  const reason = typeof details.payment_discount_reason === 'string'
    ? details.payment_discount_reason
    : '';

  const shipping = num(order.shipping_cost);
  const tax = num(order.tax_amount);
  const total = num(order.total_amount);

  // Fall back to reconstructing the gross subtotal from the net total when the
  // stored line items are missing or incomplete.
  const derivedGross = total - shipping - tax + couponDiscount + paymentDiscount;
  const itemsSubtotal = grossFromLines > 0 ? grossFromLines : Math.max(derivedGross, 0);

  const expected = itemsSubtotal - couponDiscount - paymentDiscount + shipping + tax;

  return {
    itemsSubtotal,
    couponDiscount,
    couponCode,
    paymentDiscount,
    paymentDiscountPercent,
    paymentDiscountLabel:
      PAYMENT_DISCOUNT_LABELS[reason] ||
      (paymentDiscountPercent ? `${paymentDiscountPercent}% Payment Discount` : 'Payment Discount'),
    shipping,
    tax,
    total,
    reconciles: Math.abs(expected - total) < 0.05,
  };
};
