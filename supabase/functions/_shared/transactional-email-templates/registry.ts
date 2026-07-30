/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as quoteConfirmation } from './quote-confirmation.tsx'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as kycRequest } from './kyc-request.tsx'
import { template as kycApproved } from './kyc-approved.tsx'
import { template as kycRejected } from './kyc-rejected.tsx'
import { template as invoiceDelivery } from './invoice-delivery.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'quote-confirmation': quoteConfirmation,
  'contact-confirmation': contactConfirmation,
  'kyc-request': kycRequest,
  'kyc-approved': kycApproved,
  'kyc-rejected': kycRejected,
  'invoice-delivery': invoiceDelivery,
}
