-- Create compliance guidelines table
CREATE TABLE public.compliance_guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('brand', 'sebi', 'government', 'internal')),
  file_url TEXT,
  processed_content TEXT,
  extraction_status TEXT NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign documents table
CREATE TABLE public.campaign_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  analysis_status TEXT NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analysis results table
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaign_documents(id) ON DELETE CASCADE,
  compliance_code TEXT NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  overall_status TEXT NOT NULL DEFAULT 'pending' CHECK (overall_status IN ('compliant', 'minor_issues', 'major_issues', 'non_compliant')),
  selected_guidelines TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verification layers table
CREATE TABLE public.verification_layers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  layer_number INTEGER NOT NULL,
  layer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  score INTEGER,
  issues JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  processing_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance violations table  
CREATE TABLE public.compliance_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  suggested_fix TEXT,
  guideline_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_compliance_guidelines_type ON public.compliance_guidelines(type);
CREATE INDEX idx_compliance_guidelines_status ON public.compliance_guidelines(extraction_status);
CREATE INDEX idx_campaign_documents_status ON public.campaign_documents(analysis_status);
CREATE INDEX idx_analysis_results_campaign ON public.analysis_results(campaign_id);
CREATE INDEX idx_verification_layers_analysis ON public.verification_layers(analysis_id);
CREATE INDEX idx_compliance_violations_analysis ON public.compliance_violations(analysis_id);
CREATE INDEX idx_compliance_violations_severity ON public.compliance_violations(severity);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_compliance_guidelines_updated_at
  BEFORE UPDATE ON public.compliance_guidelines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_documents_updated_at
  BEFORE UPDATE ON public.campaign_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.compliance_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_violations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - will be restricted with authentication)
CREATE POLICY "Allow all operations on compliance_guidelines" ON public.compliance_guidelines FOR ALL USING (true);
CREATE POLICY "Allow all operations on campaign_documents" ON public.campaign_documents FOR ALL USING (true);
CREATE POLICY "Allow all operations on analysis_results" ON public.analysis_results FOR ALL USING (true);
CREATE POLICY "Allow all operations on verification_layers" ON public.verification_layers FOR ALL USING (true);
CREATE POLICY "Allow all operations on compliance_violations" ON public.compliance_violations FOR ALL USING (true);