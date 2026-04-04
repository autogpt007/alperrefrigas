import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface KycApprovedProps {
  customerName?: string
  orderNumber?: string
}

const KycApprovedEmail = ({ customerName, orderNumber }: KycApprovedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Verification Approved — Order #{orderNumber || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>✅ Verification Approved</Heading>
          <Text style={headerSubtext}>Your order is being processed!</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={text}>Dear {customerName || 'Customer'},</Text>
          <Text style={text}>Your identity verification for Order #{orderNumber || 'N/A'} has been approved. We are now processing your order and will notify you when it ships.</Text>
          <Text style={text}>Thank you for your patience and for helping us keep transactions secure.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: KycApprovedEmail,
  subject: (d: Record<string, any>) => `Verification Approved — Order #${d.orderNumber || 'N/A'}`,
  displayName: 'KYC approved',
  previewData: { customerName: 'John', orderNumber: 'ORD-001' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #065f46, #047857)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#ffffff', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#a7f3d0', margin: '8px 0 0', fontSize: '14px' }
const contentSection = { padding: '24px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '0 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px' }
