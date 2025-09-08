import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  campaignId: string;
  campaignContent: string;
  campaignType: string;
  selectedGuidelines: string[];
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

    const { campaignId, campaignContent, campaignType, selectedGuidelines }: AnalysisRequest = await req.json()

    // Fetch selected compliance guidelines
    const { data: guidelines, error: guidelinesError } = await supabase
      .from('compliance_guidelines')
      .select('*')
      .in('id', selectedGuidelines)

    if (guidelinesError) throw guidelinesError

    // Create analysis result record
    const complianceCode = `CEN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    
    const { data: analysisResult, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        campaign_id: campaignId,
        compliance_code: complianceCode,
        overall_score: 0, // Will be updated after analysis
        overall_status: 'pending',
        selected_guidelines: selectedGuidelines
      })
      .select()
      .single()

    if (analysisError) throw analysisError

    // Create verification layers
    const layers = [
      { layer_number: 1, layer_name: 'AI Initial Scan', status: 'processing' },
      { layer_number: 2, layer_name: 'Compliance Agent Review', status: 'pending' },
      { layer_number: 3, layer_name: 'Human Validation Queue', status: 'pending' }
    ]

    const { error: layersError } = await supabase
      .from('verification_layers')
      .insert(
        layers.map(layer => ({
          analysis_id: analysisResult.id,
          ...layer
        }))
      )

    if (layersError) throw layersError

    // Start AI analysis process
    await performAIAnalysis(supabase, analysisResult.id, campaignContent, guidelines)

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId: analysisResult.id,
        complianceCode 
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

async function performAIAnalysis(supabase: any, analysisId: string, content: string, guidelines: any[]) {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Layer 1: AI Initial Scan
    await updateLayerStatus(supabase, analysisId, 1, 'processing')
    
    const layer1Analysis = await performLayer1Analysis(content, guidelines, openaiApiKey)
    await updateLayerResults(supabase, analysisId, 1, 'completed', layer1Analysis)

    // Layer 2: Compliance Agent Review  
    await updateLayerStatus(supabase, analysisId, 2, 'processing')
    
    const layer2Analysis = await performLayer2Analysis(content, guidelines, layer1Analysis, openaiApiKey)
    await updateLayerResults(supabase, analysisId, 2, 'completed', layer2Analysis)

    // Calculate overall score and status
    const overallScore = Math.round((layer1Analysis.score + layer2Analysis.score) / 2)
    const overallStatus = getOverallStatus(overallScore)

    // Update analysis result
    await supabase
      .from('analysis_results')
      .update({
        overall_score: overallScore,
        overall_status: overallStatus
      })
      .eq('id', analysisId)

    // Layer 3: Human validation queue (only if needed)
    if (overallScore < 70) {
      await updateLayerStatus(supabase, analysisId, 3, 'pending')
    } else {
      await updateLayerStatus(supabase, analysisId, 3, 'completed')
    }

  } catch (error) {
    console.error('AI Analysis failed:', error)
    // Mark all layers as failed
    for (let i = 1; i <= 3; i++) {
      await updateLayerStatus(supabase, analysisId, i, 'failed')
    }
  }
}

async function performLayer1Analysis(content: string, guidelines: any[], apiKey: string) {
  const prompt = `Analyze the following marketing campaign content against brand compliance guidelines:

Campaign Content:
${content}

Guidelines:
${guidelines.map(g => `${g.name} (${g.type}): ${g.processed_content}`).join('\n\n')}

Provide analysis in JSON format with:
- score (0-100)
- issues (array of issue objects with type, severity, description)
- warnings (array of warning objects)
- recommendations (array of recommendation strings)

Focus on: logo usage, font compliance, color scheme, messaging tone, regulatory language.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a brand compliance expert. Analyze content strictly against provided guidelines.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })
  })

  const result = await response.json()
  return JSON.parse(result.choices[0].message.content)
}

async function performLayer2Analysis(content: string, guidelines: any[], layer1Results: any, apiKey: string) {
  const prompt = `Perform detailed compliance review building on Layer 1 analysis:

Campaign Content:
${content}

Guidelines:
${guidelines.filter(g => g.type === 'sebi' || g.type === 'government').map(g => `${g.name}: ${g.processed_content}`).join('\n\n')}

Layer 1 Results:
${JSON.stringify(layer1Results, null, 2)}

Provide comprehensive analysis in JSON format focusing on:
- SEBI compliance for financial content
- Government regulatory requirements
- Cross-reference with industry standards
- Legal risk assessment

Return same JSON structure as Layer 1.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a regulatory compliance expert specializing in SEBI and government guidelines.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })
  })

  const result = await response.json()
  return JSON.parse(result.choices[0].message.content)
}

async function updateLayerStatus(supabase: any, analysisId: string, layerNumber: number, status: string) {
  await supabase
    .from('verification_layers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('analysis_id', analysisId)
    .eq('layer_number', layerNumber)
}

async function updateLayerResults(supabase: any, analysisId: string, layerNumber: number, status: string, results: any) {
  await supabase
    .from('verification_layers')
    .update({
      status,
      score: results.score,
      issues: results.issues,
      warnings: results.warnings,
      recommendations: results.recommendations,
      updated_at: new Date().toISOString()
    })
    .eq('analysis_id', analysisId)
    .eq('layer_number', layerNumber)
}

function getOverallStatus(score: number): string {
  if (score >= 90) return 'compliant'
  if (score >= 70) return 'minor_issues'
  if (score >= 50) return 'major_issues'
  return 'non_compliant'
}