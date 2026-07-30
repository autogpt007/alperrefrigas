import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface KycRejectedProps {
  customerName?: string
  orderNumber?: string
  reason?: string
}

const KycRejectedEmail = ({ customerName, orderNumber, reason }: KycRejectedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Verification Issue — Order #{orderNumber || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>❌ Verification Issue</Heading>
          <Text style={headerSubtext}>Additional action needed for Order #{orderNumber || 'N/A'}</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={text}>Dear {customerName || 'Customer'},</Text>
          <Text style={text}>Unfortunately, we were unable to verify your identity for Order #{orderNumber || 'N/A'}. {reason || 'The documents provided did not meet our verification requirements.'}</Text>
          <Text style={text}>Please contact us at sales@alperrefrigerants.com or +1-682-215-2974 to resolve this issue.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: KycRejectedEmail,
  subject: (d: Record<string, any>) => `Verification Issue — Order #${d.orderNumber || 'N/A'}`,
  displayName: 'KYC rejected',
  previewData: { customerName: 'John', orderNumber: 'ORD-001', reason: 'ID photo was unclear.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { background: 'linear-gradient(135deg, #991b1b, #b91c1c)', padding: '32px', textAlign: 'center' as const }
const h1 = { color: '#ffffff', margin: '0', fontSize: '24px', fontWeight: 'bold' }
const headerSubtext = { color: '#fca5a5', margin: '8px 0 0', fontSize: '14px' }
const contentSection = { padding: '24px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '0 24px' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, padding: '16px 24px' }
