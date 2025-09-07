// Simple encryption utility for card data
// Note: In production, consider using a more robust encryption library

export const encryptCardData = (data: string): string => {
  // Basic base64 encoding for demo - in production use proper encryption
  return btoa(data);
};

export const decryptCardData = (encryptedData: string): string => {
  try {
    return atob(encryptedData);
  } catch {
    return '';
  }
};

export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\s+/g, '');
  if (cleaned.length < 4) return cleaned;
  return '**** **** **** ' + cleaned.slice(-4);
};

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};