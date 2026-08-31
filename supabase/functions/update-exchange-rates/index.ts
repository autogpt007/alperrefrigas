import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Frankfurter API base URL
const FRANKFURTER_API = 'https://api.frankfurter.app/latest'

// Currencies we support with their metadata
const CURRENCY_CONFIG = {
  EUR: {
    currency_name: 'Euro',
    currency_symbol: '€',
    flag_emoji: '🇪🇺',
    country_codes: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR', 'SK', 'SI', 'LT', 'LV', 'EE', 'LU', 'MT', 'CY', 'HR', 'BG', 'RO', 'PL', 'CZ', 'HU', 'SE', 'DK']
  },
  GBP: {
    currency_name: 'British Pound',
    currency_symbol: '£',
    flag_emoji: '🇬🇧',
    country_codes: ['GB']
  },
  AUD: {
    currency_name: 'Australian Dollar',
    currency_symbol: 'A$',
    flag_emoji: '🇦🇺',
    country_codes: ['AU']
  },
  CAD: {
    currency_name: 'Canadian Dollar',
    currency_symbol: 'CA$',
    flag_emoji: '🇨🇦',
    country_codes: ['CA']
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify the request is authorized via a shared secret
    const cronSecret = Deno.env.get('CRON_SECRET')
    const authHeader = req.headers.get('Authorization')
    const providedSecret = req.headers.get('x-cron-secret')

    // Allow if valid cron secret OR valid admin JWT
    if (providedSecret !== cronSecret || !cronSecret) {
      // Fall back to JWT auth check
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
      
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { createClient } = await import("npm:@supabase/supabase-js@2")
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      })
      const { data: { user }, error: authError } = await authClient.auth.getUser()
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check admin role
      const { data: roleData } = await authClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (!roleData) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    console.log('Starting exchange rate update...')

    // Fetch latest rates from Frankfurter API (USD base)
    const targetCurrencies = Object.keys(CURRENCY_CONFIG).join(',')
    const response = await fetch(`${FRANKFURTER_API}?from=USD&to=${targetCurrencies}`)
    
    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Frankfurter API response:', JSON.stringify(data))

    if (!data.rates) {
      throw new Error('No rates returned from Frankfurter API')
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updatedRates: string[] = []
    const errors: string[] = []

    // Update each currency rate in the database
    for (const [currency, rate] of Object.entries(data.rates)) {
      const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]
      if (!config) continue

      const { error } = await supabase
        .from('exchange_rates')
        .upsert({
          target_currency: currency,
          base_currency: 'USD',
          rate: rate as number,
          currency_name: config.currency_name,
          currency_symbol: config.currency_symbol,
          flag_emoji: config.flag_emoji,
          country_codes: config.country_codes,
          is_active: true,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'target_currency'
        })

      if (error) {
        console.error(`Error updating ${currency}:`, error)
        errors.push(`${currency}: update failed`)
      } else {
        console.log(`Updated ${currency}: ${rate}`)
        updatedRates.push(`${currency}: ${rate}`)
      }
    }

    // Also ensure USD is in the table with rate 1.0
    const { error: usdError } = await supabase
      .from('exchange_rates')
      .upsert({
        target_currency: 'USD',
        base_currency: 'USD',
        rate: 1.0,
        currency_name: 'US Dollar',
        currency_symbol: '$',
        flag_emoji: '🇺🇸',
        country_codes: ['US'],
        is_active: true,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'target_currency'
      })

    if (usdError) {
      errors.push(`USD: update failed`)
    } else {
      updatedRates.push('USD: 1.0')
    }

    const result = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Exchange rates updated successfully' 
        : `Updated with ${errors.length} errors`,
      updated_rates: updatedRates,
      errors: errors.length > 0 ? errors : undefined,
      source: 'Frankfurter API (ECB)',
      timestamp: new Date().toISOString()
    }

    console.log('Update complete:', JSON.stringify(result))

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: errors.length === 0 ? 200 : 207
    })

  } catch (error) {
    console.error('Exchange rate update failed:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
