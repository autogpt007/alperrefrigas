import * as React from 'npm:react@18.3.1';
import { Html, Head, Preview, Body, Container, Heading, Text, Button } from 'npm:@react-email/components@0.0.22';
import type { TemplateEntry } from './registry.ts';

const Email = ({ quoteNumber, companyName, reviewUrl }: { quoteNumber?: string; companyName?: string; reviewUrl?: string }) => (
  <Html><Head /><Preview>New buyer quote request</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
    <Container style={{ maxWidth: '600px', padding: '24px' }}>
      <Heading>New quote request</Heading><Text>Company: {companyName}</Text><Text>Reference: {quoteNumber}</Text>
      <Text>Review the products, quantities and buyer contact details in your admin area.</Text>
      <Button href={reviewUrl || 'https://alperrefrigerants.com/admin/quotes'} style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 20px' }}>Review request</Button>
    </Container>
  </Body></Html>
);
export const template = { component: Email, subject: 'New buyer quote request — Alper Refrigerants', to: 'sales@alperrefrigerants.com', displayName: 'Sales quote notification' } satisfies TemplateEntry;