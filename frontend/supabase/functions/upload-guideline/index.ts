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

    const { name, type, fileUrl, content } = await req.json()

    // Extract and process document content using AI
    const processedContent = await extractComplianceRules(content, type)

    // Insert guideline record
    const { data, error } = await supabase
      .from('compliance_guidelines')
      .insert({
        name,
        type,
        file_url: fileUrl,
        processed_content: processedContent,
        extraction_status: 'completed',
        metadata: {
          extracted_at: new Date().toISOString(),
          content_length: content.length
        }
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, guideline: data }),
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

async function extractComplianceRules(content: string, type: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    return content // Fallback to original content
  }

  const typePrompts = {
    brand: 'Extract brand guidelines including logo usage, color schemes, typography, messaging tone, and visual identity requirements.',
    sebi: 'Extract SEBI compliance requirements for financial communications, including mandatory disclosures, risk warnings, and regulatory language.',
    government: 'Extract government regulatory requirements including advertising standards, consumer protection rules, and industry-specific compliance.',
    internal: 'Extract internal policy guidelines including approval processes, content standards, and organizational requirements.'
  }

  const prompt = `Extract and structure compliance rules from this ${type} document:

${content}

${typePrompts[type as keyof typeof typePrompts]}

Format the output as structured compliance rules with:
- Rule categories
- Specific requirements  
- Mandatory elements
- Prohibited content
- Risk levels
- Approval requirements

Make it actionable for automated compliance checking.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a compliance expert who extracts actionable rules from policy documents.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 3000
      })
    })

    const result = await response.json()
    return result.choices[0].message.content
  } catch (error) {
    console.error('Failed to process content with AI:', error)
    return content // Fallback to original content
  }
}