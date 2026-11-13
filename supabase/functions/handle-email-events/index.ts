import { createEmailWebhookHandler } from 'npm:@lovable.dev/email-js@0.7.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const db = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

// Mirrors the previous suppression/unsubscribe handlers' records (notification only).
async function record(
  eventId: string,
  recipient: string,
  reason: 'bounce' | 'complaint' | 'unsubscribe',
  status: 'bounced' | 'complained' | 'suppressed',
  message: string,
  messageId?: string | null,
) {
  const supabase = db()
  const email = recipient.toLowerCase()
  const { error: supErr } = await supabase
    .from('suppressed_emails')
    .upsert({ email, reason, metadata: null }, { onConflict: 'email' })
  if (supErr) {
    console.error('suppressed_emails upsert failed', { event_id: eventId, code: supErr.code, message: supErr.message })
    throw new Error('suppression write failed')
  }
  const { error: logErr } = await supabase.from('email_send_log').insert({
    message_id: messageId ?? null, template_name: 'system', recipient_email: email,
    status, error_message: message, metadata: null,
  })
  if (logErr) {
    console.error('email_send_log insert failed', { event_id: eventId, code: logErr.code, message: logErr.message })
    throw new Error('log write failed')
  }
}

const handler = createEmailWebhookHandler({
  apiKey: Deno.env.get('LOVABLE_API_KEY')!,
  on: {
    'email.bounced': (e) => record(e.event_id, e.data.recipient, 'bounce', 'bounced',
      'Permanent bounce — email address is invalid or rejected', e.data.message_id),
    'email.complaint': (e) => record(e.event_id, e.data.recipient, 'complaint', 'complained',
      'Spam complaint — recipient marked email as spam', e.data.message_id),
    'email.unsubscribed': (e) => record(e.event_id, e.data.recipient, 'unsubscribe', 'suppressed',
      'Recipient unsubscribed', e.data.message_id),
  },
})

Deno.serve((req) => handler(req))
