import { createClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail, type SendTemplateEmailOptions } from './send-email.ts'

// Sends a registered template and records the outcome in email_send_log,
// matching the rows the previous email setup wrote. Logging never changes the result.
export async function sendAndLog(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {}
): Promise<{ sent: boolean; reason?: string; error?: string }> {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const db = url && key ? createClient(url, key) : null
  const log = async (status: string, error_message?: string) => {
    if (!db) return
    const { error } = await db.from('email_send_log').insert({
      message_id: null, template_name: templateName, recipient_email: to, status,
      ...(error_message ? { error_message: error_message.slice(0, 1000) } : {}),
    })
    if (error) console.error('email_send_log insert failed', { code: error.code, message: error.message })
  }
  try {
    const result = await sendTemplateEmail(templateName, to, options)
    if (result.sent) { await log('sent'); return { sent: true } }
    await log('suppressed'); return { sent: false, reason: result.reason }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Email send failed', { templateName, msg })
    await log('failed', msg)
    return { sent: false, error: msg }
  }
}
