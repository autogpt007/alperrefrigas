import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface InvoiceDeliveryProps {
  buyerName?: string
  docNumber?: string
  docType?: string
  total?: string
  currency?: string
  pdfUrl?: string | null
  paymentTerms?: string | null
  paymentNotes?: string | null
}

const InvoiceDeliveryEmail = ({
  buyerName,
  docNumber,
  docType,
  total,
  currency,
  pdfUrl,
  paymentTerms,
  paymentNotes,
}: InvoiceDeliveryProps) => {
  const label = docType === 'quote' ? 'Quotation' : 'Invoice'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`Your ${label} ${docNumber || ''} from Alper Refrigerants`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={h1}>{`Your ${label} is ready`}</Heading>
            <Text style={headerSubtext}>Alper Refrigerants</Text>
          </Section>

          <Text style={text}>{`Hello${buyerName ? ` ${buyerName}` : ''},`}</Text>
          <Text style={text}>
            {`Please find your ${label.toLowerCase()} below. You can download the PDF using the secure link.`}
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>{`${label} ${docNumber || ''}`}</Text>
            <Text style={infoSubtext}>{`Amount: ${currency || 'USD'} ${total || '0.00'}`}</Text>
            {paymentTerms ? <Text style={infoSubtext}>{`Terms: ${paymentTerms}`}</Text> : null}
          </Section>

          {pdfUrl ? (
            <Section style={{ padding: '0 24px 8px' }}>
              <Button href={pdfUrl} style={button}>{`Download ${label} PDF`}</Button>
            </Section>
          ) : null}

          {paymentNotes ? (
            <Section style={notesBox}>
              <Text style={notesTitle}>Payment instructions</Text>
              <Text style={notesText}>{paymentNotes}</Text>
            </Section>
          ) : null}

          <Text style={text}>
            Questions? Reply to this email or contact sales@alperrefrigerants.com or +1-682-215-2974.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InvoiceDeliveryEmail,
  subject: (d: Record<string, any>) =>
    `${d.docType === 'quote' ? 'Quotation' : 'Invoice'} ${d.docNumber || ''} from Alper Refrigerants`.trim(),
  displayName: 'Invoice / quote delivery',
  previewData: {
    buyerName: 'Jane Cooper',
    docNumber: 'INV-2601-A1B2C3D4E5',
    docType: 'invoice',
    total: '3,840.00',
    currency: 'USD',
    pdfUrl: 'https://alperrefrigerants.com/example.pdf',
    paymentTerms: 'Due upon receipt',
    paymentNotes: 'Payment by bank wire / ACH transfer.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#22d3ee', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#cbd5e1', margin: '8px 0 0', fontSize: '14px' }
const infoBox = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', margin: '8px 24px 16px' }
const infoTitle = { margin: '0', color: '#0f172a', fontWeight: 'bold', fontSize: '15px' }
const infoSubtext = { margin: '4px 0 0', color: '#475569', fontSize: '14px' }
const notesBox = { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px', margin: '8px 24px 16px' }
const notesTitle = { margin: '0 0 6px', color: '#0369a1', fontWeight: 'bold', fontSize: '13px' }
const notesText = { margin: '0', color: '#334155', fontSize: '13px', whiteSpace: 'pre-line' as const, lineHeight: '1.5' }
const button = { backgroundColor: '#0891b2', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', padding: '0 24px', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '20px 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }
