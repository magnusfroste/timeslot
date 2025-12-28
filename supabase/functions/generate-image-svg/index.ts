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
      console.log('Missing id parameter, returning default image')
      return generateDefaultImage()
    }

    console.log('Generating image for invite:', inviteId)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Fetch invite details
    const { data: invite, error } = await supabaseClient
      .from('meeting_invites')
      .select('*')
      .eq('id', inviteId)
      .single()

    if (error || !invite) {
      console.error('Invite fetch error:', error)
      return generateDefaultImage()
    }

    console.log('Generating image for:', invite.title)

    // Generate SVG with meeting details
    const svg = generateSvg({
      title: invite.title,
      organizer: invite.inviter_name,
      slotsCount: invite.available_slots?.length || 0,
      description: invite.description
    })

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Error in generate-image-svg function:', error)
    return generateDefaultImage()
  }
})

interface ImageData {
  title: string
  organizer: string
  slotsCount: number
  description?: string | null
}

function generateSvg(data: ImageData): string {
  const { title, organizer, slotsCount } = data
  
  // Truncate title if too long
  const displayTitle = title.length > 40 ? title.substring(0, 37) + '...' : title
  const displayOrganizer = organizer.length > 30 ? organizer.substring(0, 27) + '...' : organizer

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient background -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="50%" style="stop-color:#764ba2"/>
      <stop offset="100%" style="stop-color:#f093fb"/>
    </linearGradient>
    
    <!-- Subtle pattern overlay -->
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.1)"/>
    </pattern>
    
    <!-- Glow effect -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Card shadow -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="150" fill="rgba(255,255,255,0.05)"/>
  <circle cx="1100" cy="530" r="200" fill="rgba(255,255,255,0.05)"/>
  <circle cx="900" cy="100" r="100" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Main card -->
  <rect x="100" y="100" width="1000" height="430" rx="30" ry="30" fill="rgba(255,255,255,0.15)" filter="url(#cardShadow)"/>
  <rect x="100" y="100" width="1000" height="430" rx="30" ry="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  
  <!-- Calendar icon -->
  <g transform="translate(180, 170)">
    <rect width="100" height="100" rx="20" fill="rgba(255,255,255,0.2)"/>
    <rect x="10" y="10" width="80" height="25" rx="5" fill="#f093fb"/>
    <rect x="10" y="40" width="80" height="50" rx="5" fill="white"/>
    
    <!-- Calendar grid -->
    <rect x="18" y="50" width="12" height="12" rx="2" fill="#667eea"/>
    <rect x="34" y="50" width="12" height="12" rx="2" fill="#e0e0e0"/>
    <rect x="50" y="50" width="12" height="12" rx="2" fill="#e0e0e0"/>
    <rect x="66" y="50" width="12" height="12" rx="2" fill="#e0e0e0"/>
    
    <rect x="18" y="66" width="12" height="12" rx="2" fill="#e0e0e0"/>
    <rect x="34" y="66" width="12" height="12" rx="2" fill="#667eea"/>
    <rect x="50" y="66" width="12" height="12" rx="2" fill="#e0e0e0"/>
    <rect x="66" y="66" width="12" height="12" rx="2" fill="#667eea"/>
  </g>
  
  <!-- Header badge -->
  <rect x="320" y="170" width="280" height="45" rx="22" fill="rgba(255,255,255,0.2)"/>
  <text x="460" y="200" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="white" text-anchor="middle">📅 MÖTESINBJUDAN</text>
  
  <!-- Title -->
  <text x="320" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="white">${escapeXml(displayTitle)}</text>
  
  <!-- Organizer -->
  <text x="320" y="340" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.9)">Från: ${escapeXml(displayOrganizer)}</text>
  
  <!-- Time slots badge -->
  <g transform="translate(320, 380)">
    <rect width="200" height="50" rx="25" fill="rgba(255,255,255,0.2)"/>
    <text x="100" y="33" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white" text-anchor="middle">🕐 ${slotsCount} föreslagna tider</text>
  </g>
  
  <!-- CTA -->
  <rect x="320" y="450" width="320" height="60" rx="30" fill="white"/>
  <text x="480" y="490" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#667eea" text-anchor="middle">✅ Klicka för att svara</text>
  
  <!-- Logo/Brand -->
  <text x="1050" y="500" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="end">TimeSlot</text>
</svg>`
}

function generateDefaultImage(): Response {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="white" text-anchor="middle">📅 TimeSlot</text>
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)" text-anchor="middle">Enkla mötesinbjudningar</text>
</svg>`

  return new Response(svg, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
