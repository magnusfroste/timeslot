
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
      console.log('Missing inviteId parameter')
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    console.log('Generating social image for invite:', inviteId)

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
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    console.log('Found invite:', invite.title)

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.log('No OpenAI API key found, using fallback image')
      return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
    }

    // Try to generate image with OpenAI
    try {
      console.log('Attempting to generate image with OpenAI...')
      
      const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Create a professional meeting invitation social media image. Clean modern design with:
- Large calendar icon prominently displayed
- Title: "${invite.title}"
- Organizer: "Organized by ${invite.inviter_name}"
- Text: "Click to see available times"
- Blue gradient background
- Modern typography, high contrast
- Professional business aesthetic
- Social media optimized (16:9 ratio)`,
          size: "1792x1024",
          quality: "standard",
          n: 1
        })
      })

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        console.error('OpenAI API error:', errorText)
        throw new Error(`OpenAI API failed: ${openaiResponse.status}`)
      }

      const imageData = await openaiResponse.json()
      console.log('OpenAI response received')
      
      if (imageData.data && imageData.data[0] && imageData.data[0].url) {
        console.log('Successfully generated image, redirecting to:', imageData.data[0].url)
        return Response.redirect(imageData.data[0].url)
      } else {
        console.error('Invalid OpenAI response format:', imageData)
        throw new Error('Invalid response format from OpenAI')
      }

    } catch (openaiError) {
      console.error('OpenAI generation failed:', openaiError)
      
      // Fallback to a more specific calendar image based on meeting details
      const encodedTitle = encodeURIComponent(invite.title)
      const encodedOrganizer = encodeURIComponent(invite.inviter_name)
      
      // Use a calendar-themed image with better parameters
      const fallbackUrl = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format&q=80&txt=${encodedTitle}&txt-size=48&txt-color=ffffff&txt-pad=40&txt-align=center`
      
      console.log('Using fallback image:', fallbackUrl)
      return Response.redirect(fallbackUrl)
    }

  } catch (error) {
    console.error('Error in generate-social-image function:', error)
    return Response.redirect('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format')
  }
})
