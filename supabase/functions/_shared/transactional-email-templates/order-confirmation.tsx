import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Alper Refrigerants"

interface OrderConfirmationProps {
  customerName?: string
  orderNumber?: string
  totalAmount?: number
  items?: Array<{ product_name: string; quantity: number; price: number }>
}

const OrderConfirmationEmail = ({ customerName, orderNumber, totalAmount, items }: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Order Confirmed — #{orderNumber || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>Order Confirmed!</Heading>
          <Text style={headerSubtext}>Thank you for your order{customerName ? `, ${customerName}` : ''}</Text>
        </Section>
        <Section style={infoBox}>
          <Text style={infoTitle}>Order #{orderNumber || 'N/A'}</Text>
          <Text style={infoSubtext}>Total: <strong>${(totalAmount || 0).toFixed(2)}</strong></Text>
        </Section>
        {items && items.length > 0 && (
          <Section style={itemsSection}>
            {items.map((item, i) => (
              <Text key={i} style={itemRow}>
                {item.product_name} × {item.quantity} — ${(item.price || 0).toFixed(2)}
              </Text>
            ))}
          </Section>
        )}
        <Hr style={hr} />
        <Text style={text}>We'll notify you when your order ships. For questions, reply to this email or contact sales@alperrefrigerants.com.</Text>
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (d: Record<string, any>) => `Order Confirmed — #${d.orderNumber || 'N/A'}`,
  displayName: 'Order confirmation',
  previewData: { customerName: 'John', orderNumber: 'ORD-001', totalAmount: 250.00, items: [{ product_name: 'R-410A', quantity: 2, price: 125.00 }] },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#22d3ee', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#cbd5e1', margin: '8px 0 0', fontSize: '14px' }
const infoBox = { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px', margin: '24px' }
const infoTitle = { margin: '0', color: '#0369a1', fontWeight: 'bold', fontSize: '14px' }
const infoSubtext = { margin: '4px 0 0', color: '#64748b', fontSize: '14px' }
const itemsSection = { padding: '0 24px' }
const itemRow = { fontSize: '14px', color: '#334155', margin: '4px 0', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }
const hr = { borderColor: '#e2e8f0', margin: '20px 24px' }
const text = { fontSize: '14px', color: '#64748b', lineHeight: '1.5', padding: '0 24px', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }
