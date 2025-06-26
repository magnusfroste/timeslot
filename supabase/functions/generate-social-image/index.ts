
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
    const inviteId = url.searchParams.get('inviteId')
    
    if (!inviteId) {
      return new Response('Missing inviteId parameter', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

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
      return new Response('Invite not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    // Generate image using OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `Create a professional meeting invitation social media image with a clean, modern design. The image should have:
        - A calendar icon at the top center
        - Title: "${invite.title}"
        - Organizer: "Organized by ${invite.inviter_name}"
        - Description: "${invite.description || 'Meeting invitation'}"
        - Subtitle: "Click to see available times and share your availability"
        - Use a gradient background from light blue to indigo
        - Modern typography with good contrast
        - Professional business meeting aesthetic
        - Size optimized for social media sharing (landscape orientation)`,
        size: "1792x1024",
        quality: "high",
        output_format: "png"
      })
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text())
      // Fallback to default image
      return Response.redirect('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    const imageData = await openaiResponse.json()
    
    // Since gpt-image-1 returns base64, we need to convert and return the image
    const base64Data = imageData.data[0].b64_json
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })

  } catch (error) {
    console.error('Error generating social image:', error)
    // Fallback to default image
    return Response.redirect('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=630&fit=crop&crop=center&auto=format')
  }
})
