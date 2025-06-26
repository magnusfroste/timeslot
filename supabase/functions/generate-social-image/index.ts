
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
      console.error('Invite fetch error:', error)
      // Fallback to default image
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    // Generate image using OpenAI DALL-E
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a professional meeting invitation social media image with a clean, modern design. The image should have:
        - A large calendar icon prominently displayed
        - Title: "${invite.title}"
        - Organizer: "Organized by ${invite.inviter_name}"
        - Text: "Click to see available times"
        - Use a blue gradient background
        - Modern typography with high contrast
        - Professional business meeting aesthetic
        - Optimized for social media sharing (16:9 aspect ratio)`,
        size: "1792x1024",
        quality: "standard",
        n: 1
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      // Fallback to default image
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    const imageData = await openaiResponse.json()
    
    if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
      console.error('Invalid OpenAI response format:', imageData)
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    // Redirect to the generated image URL
    return Response.redirect(imageData.data[0].url)

  } catch (error) {
    console.error('Error generating social image:', error)
    // Fallback to default image
    return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
  }
})
