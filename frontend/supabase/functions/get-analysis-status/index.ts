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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const analysisId = url.searchParams.get('analysisId')

    if (!analysisId) {
      throw new Error('Analysis ID is required')
    }

    // Get analysis result with layers
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select(`
        *,
        campaign_documents (title, content, campaign_type),
        verification_layers (*),
        compliance_violations (*)
      `)
      .eq('id', analysisId)
      .single()

    if (analysisError) throw analysisError

    // Get selected guidelines
    const { data: guidelines, error: guidelinesError } = await supabase
      .from('compliance_guidelines')
      .select('*')
      .in('id', analysis.selected_guidelines)

    if (guidelinesError) throw guidelinesError

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: {
          ...analysis,
          selected_guidelines_data: guidelines
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})