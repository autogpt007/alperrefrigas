import React from 'react';
import { Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

interface ContactDisplayProps {
  category?: string;
  types?: string[];
  showIcons?: boolean;
  showDescriptions?: boolean;
  className?: string;
  linkPhones?: boolean;
  linkEmails?: boolean;
}

export const ContactDisplay: React.FC<ContactDisplayProps> = ({
  category,
  types,
  showIcons = true,
  showDescriptions = false,
  className = '',
  linkPhones = true,
  linkEmails = true
}) => {
  const { contactInfo, loading } = useContactInfo(category);

  if (loading) {
    return <div className="animate-pulse">Loading contact information...</div>;
  }

  const filteredContacts = types 
    ? contactInfo.filter(contact => types.includes(contact.contact_type))
    : contactInfo;

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'hours': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatContactValue = (contact: any) => {
    if (contact.contact_type === 'phone' && linkPhones) {
      return (
        <a 
          href={`tel:${contact.value.replace(/[^\d+]/g, '')}`}
          className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
        >
          {contact.value}
        </a>
      );
    }
    
    if (contact.contact_type === 'email' && linkEmails) {
      return (
        <a 
          href={`mailto:${contact.value}`}
          className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
        >
          {contact.value}
        </a>
      );
    }

    return <span>{contact.value}</span>;
  };

  if (filteredContacts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {filteredContacts.map((contact) => (
        <div key={contact.id} className="flex items-start space-x-3">
          {showIcons && (
            <div className="mt-1 text-muted-foreground">
              {getContactIcon(contact.contact_type)}
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground">{contact.label}</div>
            <div className="text-sm">
              {formatContactValue(contact)}
            </div>
            {showDescriptions && contact.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {contact.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Convenience components for specific use cases
export const EmergencyContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="emergency" />
);

export const GeneralContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="general" />
);

export const SupportContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="support" />
);

export const ReturnsContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="returns" />
);

export const ComplianceContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="compliance" />
);

export const LegalContacts: React.FC<Omit<ContactDisplayProps, 'category'>> = (props) => (
  <ContactDisplay {...props} category="legal" />
);