import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Link } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SALES = 'sales@alperrefrigerants.com'

interface Props {
  customerName?: string
  orderNumber?: string
  total?: string
  zelleName?: string
  zelleContact?: string
  note?: string
}

const ZelleEmail = ({ customerName, orderNumber = 'N/A', total, zelleName, zelleContact, note }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Zelle payment details for order #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}><Heading style={h1}>Payment details for order #{orderNumber}</Heading></Section>
        <Section style={content}>
          <Text style={text}>Dear {customerName || 'Customer'},</Text>
          <Text style={text}>As discussed, here are the Zelle details to pay for your order.</Text>
          <Section style={box}>
            <Text style={line}><strong>Order:</strong> #{orderNumber}</Text>
            <Text style={line}><strong>Amount due:</strong> {total}</Text>
            <Text style={line}><strong>Zelle name:</strong> {zelleName}</Text>
            <Text style={line}><strong>Zelle email / phone:</strong> {zelleContact}</Text>
          </Section>
          <Text style={text}>Please put <strong>#{orderNumber}</strong> in the Zelle memo so we can match your payment.</Text>
          <Section style={greenBox}>
            <Text style={line}><strong>After you pay:</strong> take a screenshot of the payment confirmation in your bank or Zelle app.</Text>
            <Text style={line}>Email that screenshot to{' '}
              <Link href={`mailto:${SALES}?subject=${encodeURIComponent(`Payment screenshot for order #${orderNumber}`)}`} style={link}>{SALES}</Link>
              {' '}so we can confirm your payment and dispatch your order right away.</Text>
          </Section>
          {note ? <Text style={{ ...text, whiteSpace: 'pre-line' }}>{note}</Text> : null}
          <Text style={muted}>Questions? Reply to this email or contact {SALES} · +1-786-987-0501.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ZelleEmail,
  subject: (d: Record<string, any>) => `Payment details for order #${d.orderNumber || 'N/A'} - Alper Refrigerants`,
  displayName: 'Zelle payment details',
  previewData: { customerName: 'John', orderNumber: 'ORD-001', total: 'USD 3,800.00', zelleName: 'Alper Chemical Group', zelleContact: 'pay@example.com' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const header = { backgroundColor: '#0f172a', padding: '28px', textAlign: 'center' as const }
const h1 = { color: '#22d3ee', margin: '0', fontSize: '22px' }
const content = { padding: '24px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px' }
const line = { fontSize: '14px', color: '#334155', margin: '0 0 6px' }
const box = { backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px', margin: '20px 0' }
const greenBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', margin: '20px 0' }
const link = { color: '#0284c7' }
const muted = { fontSize: '14px', color: '#64748b' }
const hr = { borderColor: '#e2e8f0', margin: '0 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px' }
