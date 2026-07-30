import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface QuoteConfirmationProps {
  customerName?: string
  quoteNumber?: string
}

const QuoteConfirmationEmail = ({ customerName, quoteNumber }: QuoteConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Quote Request Received — #{quoteNumber || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>Quote Request Received</Heading>
          <Text style={headerSubtext}>We'll get back to you shortly{customerName ? `, ${customerName}` : ''}</Text>
        </Section>
        <Section style={infoBox}>
          <Text style={infoTitle}>Quote #{quoteNumber || 'N/A'}</Text>
          <Text style={infoSubtext}>Status: Under Review</Text>
        </Section>
        <Text style={text}>Our team is reviewing your request and will provide competitive wholesale pricing within 4 business hours.</Text>
        <Text style={text}>For urgent inquiries, contact us at sales@alperrefrigerants.com or +1-787-965-8975.</Text>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteConfirmationEmail,
  subject: (d: Record<string, any>) => `Quote Request Received — #${d.quoteNumber || 'N/A'}`,
  displayName: 'Quote confirmation',
  previewData: { customerName: 'Jane', quoteNumber: 'QT-001' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#22d3ee', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#cbd5e1', margin: '8px 0 0', fontSize: '14px' }
const infoBox = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', margin: '24px' }
const infoTitle = { margin: '0', color: '#166534', fontWeight: 'bold', fontSize: '14px' }
const infoSubtext = { margin: '4px 0 0', color: '#64748b', fontSize: '14px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', padding: '0 24px', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '20px 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }
