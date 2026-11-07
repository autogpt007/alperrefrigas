export function buyerFieldErrors(data: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const required = ['customerName', 'customerEmail', 'phoneNumber', 'street', 'city', 'zipCode'];
  if (data.countryCode === 'US') required.push('state');
  if (data.paymentMethod === 'credit_card') required.push('cardNumber', 'expiryDate', 'cvv', 'cardholderName');
  for (const key of required) if (!String(data[key] ?? '').trim()) errors[key] = 'This field is required.';
  if (data.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.customerEmail))) errors.customerEmail = 'Enter a valid email address.';
  return errors;
}