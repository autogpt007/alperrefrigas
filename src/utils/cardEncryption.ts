// Secure encryption utility for card data using Web Crypto API
// Uses AES-GCM encryption for proper security

class CardEncryption {
  private static async getEncryptionKey(): Promise<CryptoKey> {
    // In production, this should be stored securely and rotated regularly
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('secure-card-key-32-chars-long!!'), 
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('card-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);
      
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }
}

export const encryptCardData = (data: string): Promise<string> => {
  return CardEncryption.encrypt(data);
};

export const decryptCardData = (encryptedData: string): Promise<string> => {
  return CardEncryption.decrypt(encryptedData);
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