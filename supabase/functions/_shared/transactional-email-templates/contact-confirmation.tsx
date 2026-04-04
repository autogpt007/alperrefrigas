import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ContactConfirmationProps {
  name?: string
  subject?: string
}

const ContactConfirmationEmail = ({ name, subject }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to Alper Refrigerants</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>Message Received</Heading>
          <Text style={headerSubtext}>Thank you for reaching out{name ? `, ${name}` : ''}</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={text}>We've received your message and our team will respond within 4 hours during business hours.</Text>
          {subject && <Text style={text}><strong>Subject:</strong> {subject}</Text>}
          <Text style={text}>If your matter is urgent, please call us at +1-787-965-8975.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We received your message — Alper Refrigerants',
  displayName: 'Contact confirmation',
  previewData: { name: 'Jane', subject: 'Bulk order inquiry' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#22d3ee', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#cbd5e1', margin: '8px 0 0', fontSize: '14px' }
const contentSection = { padding: '24px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '0 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }
