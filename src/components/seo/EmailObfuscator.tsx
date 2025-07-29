import React, { useState } from 'react';

interface EmailObfuscatorProps {
  email: string;
  className?: string;
  children?: React.ReactNode;
}

const EmailObfuscator: React.FC<EmailObfuscatorProps> = ({ 
  email, 
  className = '', 
  children 
}) => {
  const [revealed, setRevealed] = useState(false);
  
  // Simple obfuscation - encode email
  const obfuscatedEmail = email
    .replace('@', ' [at] ')
    .replace(/\./g, ' [dot] ');
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!revealed) {
      setRevealed(true);
      setTimeout(() => {
        window.location.href = `mailto:${email}`;
      }, 100);
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <a
      href={revealed ? `mailto:${email}` : '#'}
      onClick={handleClick}
      className={className}
      data-email={btoa(email)} // Base64 encode for extra obfuscation
    >
      {children || (revealed ? email : obfuscatedEmail)}
    </a>
  );
};

export default EmailObfuscator;