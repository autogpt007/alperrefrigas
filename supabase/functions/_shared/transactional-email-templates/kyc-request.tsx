import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface KycRequestProps {
  customerName?: string
  orderNumber?: string
  totalAmount?: number
  kycLink?: string
  items?: Array<{ product_name: string; quantity: number; price: number }>
}

const KycRequestEmail = ({ customerName, orderNumber, totalAmount, kycLink, items }: KycRequestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Action Required: Verify Your Identity — Order #{orderNumber || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>🔒 Identity Verification Required</Heading>
          <Text style={headerSubtext}>Action required for Order #{orderNumber || 'N/A'}</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={text}>Dear {customerName || 'Customer'},</Text>
          <Text style={text}>To protect you and process your order securely, we require identity verification. This is a standard security measure for credit card transactions.</Text>
          <Section style={orderBox}>
            <Text style={orderTitle}>Order Summary</Text>
            <Text style={orderDetail}>Order #{orderNumber || 'N/A'} — Total: ${(totalAmount || 0).toFixed(2)}</Text>
          </Section>
          {items && items.length > 0 && (
            <Section style={itemsSection}>
              {items.map((item, i) => (
                <Text key={i} style={itemRow}>{item.product_name} × {item.quantity} — ${(item.price || 0).toFixed(2)}</Text>
              ))}
            </Section>
          )}
          <Text style={boldText}>What you'll need:</Text>
          <Text style={text}>1. Name and billing address registered to your card</Text>
          <Text style={text}>2. Photo of your credit card (front and back)</Text>
          <Text style={text}>3. A valid government-issued ID</Text>
          <Text style={text}>4. A selfie holding your ID clearly visible</Text>
          {kycLink && (
            <Section style={ctaSection}>
              <Button href={kycLink} style={ctaButton}>Complete Verification</Button>
            </Section>
          )}
          <Text style={smallText}>This link expires in 72 hours. All documents are stored securely and encrypted.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: KycRequestEmail,
  subject: (d: Record<string, any>) => `Action Required: Verify Your Identity — Order #${d.orderNumber || 'N/A'}`,
  displayName: 'KYC verification request',
  previewData: { customerName: 'John', orderNumber: 'ORD-001', totalAmount: 500.00, kycLink: 'https://example.com/kyc/abc123', items: [{ product_name: 'R-410A', quantity: 5, price: 100.00 }] },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #92400e, #b45309)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#ffffff', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#fde68a', margin: '8px 0 0', fontSize: '14px' }
const contentSection = { padding: '24px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px' }
const boldText = { fontSize: '14px', color: '#334155', fontWeight: 'bold' as const, margin: '16px 0 8px' }
const orderBox = { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', margin: '16px 0' }
const orderTitle = { margin: '0 0 8px', color: '#92400e', fontWeight: 'bold', fontSize: '14px' }
const orderDetail = { margin: '0', color: '#78350f', fontSize: '14px' }
const itemsSection = { margin: '0 0 16px' }
const itemRow = { fontSize: '14px', color: '#334155', margin: '4px 0', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const ctaButton = { display: 'inline-block', background: '#b45309', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }
const smallText = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '0 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px' }
