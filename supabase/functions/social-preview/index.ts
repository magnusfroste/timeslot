import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const inviteId = url.searchParams.get('id')
    
    if (!inviteId) {
      console.log('Missing id parameter')
      return new Response('Missing invite ID', { status: 400 })
    }

    console.log('Generating social preview for invite:', inviteId)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    // Initialize Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch invite details
    const { data: invite, error } = await supabaseClient
      .from('meeting_invites')
      .select('*')
      .eq('id', inviteId)
      .single()

    if (error || !invite) {
      console.error('Invite fetch error:', error)
      // Redirect to app anyway, it will show "not found"
      return Response.redirect(`${getAppUrl()}/invite/${inviteId}`, 302)
    }

    console.log('Found invite:', invite.title)

    // Generate dynamic OG image URL
    const imageUrl = `${supabaseUrl}/functions/v1/generate-image-svg?id=${inviteId}`
    
    // The app URL for redirect
    const appUrl = getAppUrl()
    const inviteUrl = `${appUrl}/invite/${inviteId}`

    // Build HTML with SSR meta tags
    const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📅 Mötesinbjudan: ${escapeHtml(invite.title)}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="📅 Mötesinbjudan: ${escapeHtml(invite.title)}">
  <meta name="description" content="${escapeHtml(invite.inviter_name)} vill boka ett möte med dig! ${invite.available_slots?.length || 0} föreslagna tider. Klicka för att svara.">
  
  <!-- Open Graph / Facebook / WhatsApp / iMessage -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${inviteUrl}">
  <meta property="og:title" content="📅 Mötesinbjudan: ${escapeHtml(invite.title)}">
  <meta property="og:description" content="${escapeHtml(invite.inviter_name)} vill boka ett möte med dig! ${invite.available_slots?.length || 0} föreslagna tider. Klicka för att svara.">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TimeSlotfit - Meeting Scheduling">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${inviteUrl}">
  <meta name="twitter:title" content="📅 Mötesinbjudan: ${escapeHtml(invite.title)}">
  <meta name="twitter:description" content="${escapeHtml(invite.inviter_name)} vill boka ett möte med dig! ${invite.available_slots?.length || 0} föreslagna tider. Klicka för att svara.">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Redirect for browsers -->
  <meta http-equiv="refresh" content="0;url=${inviteUrl}">
  <script>window.location.href = "${inviteUrl}";</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 400px;
    }
    h1 { margin-bottom: 10px; }
    p { opacity: 0.9; }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📅 Mötesinbjudan</h1>
    <h2>${escapeHtml(invite.title)}</h2>
    <p>Från: ${escapeHtml(invite.inviter_name)}</p>
    <p>${invite.available_slots?.length || 0} föreslagna tider</p>
    <p>Omdirigerar dig...</p>
    <a href="${inviteUrl}">Klicka här om du inte omdirigeras</a>
  </div>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60'
      }
    })

  } catch (error) {
    console.error('Error in social-preview function:', error)
    return new Response('Internal error', { status: 500 })
  }
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getAppUrl(): string {
  // In production, this should be the actual app URL
  // We can infer it from the Supabase URL or use an environment variable
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  
  // Extract project ref from Supabase URL
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
  if (match) {
    // Default to lovable.app domain pattern
    return `https://${match[1]}.lovableproject.com`
  }
  
  // Fallback - this should be configured via environment variable in production
  return Deno.env.get('APP_URL') ?? 'https://timeslotfit-demo.vercel.app'
}
