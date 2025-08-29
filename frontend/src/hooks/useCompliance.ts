import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface ComplianceGuideline {
  id: string
  name: string
  type: 'brand' | 'sebi' | 'government' | 'internal'
  file_url?: string
  processed_content?: string
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: any
  created_at: string
  updated_at: string
}

export interface AnalysisResult {
  id: string
  campaign_id: string
  compliance_code: string
  overall_score: number
  overall_status: 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant'
  selected_guidelines: string[]
  verification_layers: VerificationLayer[]
  compliance_violations: ComplianceViolation[]
  created_at: string
}

export interface VerificationLayer {
  id: string
  layer_number: number
  layer_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  score?: number
  issues: any[]
  warnings: any[]
  recommendations: any[]
  processing_details: any
}

export interface ComplianceViolation {
  id: string
  violation_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  suggested_fix?: string
  guideline_reference?: string
}

export function useComplianceGuidelines() {
  const [guidelines, setGuidelines] = useState<ComplianceGuideline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchGuidelines()
  }, [])

  const fetchGuidelines = async () => {
    try {
      const { data, error } = await supabase
        .from('compliance_guidelines')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuidelines((data || []).map(item => ({
        ...item,
        type: item.type as ComplianceGuideline['type'],
        extraction_status: item.extraction_status as ComplianceGuideline['extraction_status'],
        file_url: item.file_url || undefined,
        processed_content: item.processed_content || undefined,
        metadata: item.metadata || {}
      })))
    } catch (err) {
      console.error('Error fetching guidelines:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch guidelines')
      toast({
        title: "Error",
        description: "Failed to fetch compliance guidelines",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadGuideline = async (name: string, type: string, content: string, fileUrl?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('upload-guideline', {
        body: { name, type, content, fileUrl }
      })

      if (error) throw error
      
      await fetchGuidelines() // Refresh the list
      toast({
        title: "Success",
        description: "Guideline uploaded and processed successfully",
      })
      return data.guideline
    } catch (err) {
      console.error('Error uploading guideline:', err)
      const message = err instanceof Error ? err.message : 'Failed to upload guideline'
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive"
      })
      throw new Error(message)
    }
  }

  return {
    guidelines,
    loading,
    error,
    uploadGuideline,
    refetch: fetchGuidelines
  }
}

export function useComplianceAnalysis() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const startAnalysis = async (
    campaignContent: string,
    campaignType: string,
    selectedGuidelines: string[]
  ) => {
    setLoading(true)
    setError(null)

    try {
      // First create campaign document
      const { data: campaign, error: campaignError } = await supabase
        .from('campaign_documents')
        .insert({
          title: `Campaign Analysis - ${new Date().toLocaleString()}`,
          content: campaignContent,
          campaign_type: campaignType,
          analysis_status: 'analyzing'
        })
        .select()
        .single()

      if (campaignError) throw campaignError

      // Start analysis
      const { data, error } = await supabase.functions.invoke('analyze-compliance', {
        body: {
          campaignId: campaign.id,
          campaignContent,
          campaignType,
          selectedGuidelines
        }
      })

      if (error) throw error

      // Start polling for results
      pollAnalysisStatus(data.analysisId)
      
      toast({
        title: "Analysis Started",
        description: "Your campaign is being analyzed through our multi-layer system",
      })
      
      return data.analysisId
    } catch (err) {
      console.error('Error starting analysis:', err)
      const message = err instanceof Error ? err.message : 'Failed to start analysis'
      setError(message)
      setLoading(false)
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive"
      })
      throw err
    }
  }

  const pollAnalysisStatus = async (analysisId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-analysis-status', {
          body: { analysisId }
        })

        if (error) throw error

        setCurrentAnalysis(data.analysis)

        // Check if analysis is complete
        const allLayersComplete = data.analysis.verification_layers.every((layer: VerificationLayer) => 
          layer.status === 'completed' || layer.status === 'failed'
        )

        if (allLayersComplete) {
          clearInterval(pollInterval)
          setLoading(false)
          toast({
            title: "Analysis Complete",
            description: "Your compliance analysis has finished processing",
          })
        }
      } catch (err) {
        console.error('Polling error:', err)
        clearInterval(pollInterval)
        setError('Failed to get analysis status')
        setLoading(false)
        toast({
          title: "Polling Error",
          description: "Failed to get analysis status updates",
          variant: "destructive"
        })
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }

  const resetAnalysis = () => {
    setCurrentAnalysis(null)
    setLoading(false)
    setError(null)
  }

  const generateWithGemini = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { prompt }
      })

      if (error) throw error

      return data.generatedText
    } catch (err) {
      console.error('Error with Gemini generation:', err)
      toast({
        title: "Error",
        description: "Failed to generate content with Gemini",
        variant: "destructive"
      })
      throw err
    }
  }

  return {
    currentAnalysis,
    loading,
    error,
    startAnalysis,
    resetAnalysis,
    generateWithGemini
  }
}