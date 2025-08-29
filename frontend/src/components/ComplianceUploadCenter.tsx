import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  Shield, 
  Gavel, 
  Building, 
  Zap,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Brain,
  UserCheck,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

interface ComplianceUploadCenterProps {
  onBack: () => void;
  userName: string;
}

type UploadType = 'guidelines' | 'campaign' | null;
type VerificationLayer = 1 | 2 | 3;
type ComplianceType = 'brand' | 'sebi' | 'government';

interface ComplianceGuideline {
  id: string;
  name: string;
  type: ComplianceType; 
  uploadDate: string;
  status: 'active' | 'pending' | 'expired';
}

interface CampaignDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  uploadDate: string;
}

const ComplianceUploadCenter = ({ onBack, userName }: ComplianceUploadCenterProps) => {
  const [activeTab, setActiveTab] = useState<UploadType>('guidelines');
  const [selectedGuidelines, setSelectedGuidelines] = useState<string[]>([]);
  const [campaignContent, setCampaignContent] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [newGuidelineName, setNewGuidelineName] = useState('');
  const [newGuidelineType, setNewGuidelineType] = useState<ComplianceType>('brand');
  const [newGuidelineContent, setNewGuidelineContent] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);
  const [logoResult, setLogoResult] = useState<any>(null);
  const [textResult, setTextResult] = useState<any>(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const verificationLayers = [
    { id: 1, name: 'AI Initial Scan', description: 'Logo detection, font analysis, color verification', icon: Brain, processes: ['Brand element detection', 'Typography analysis', 'Color palette verification', 'Layout structure check'] },
    { id: 2, name: 'Compliance Agent Review', description: 'Multi-guideline cross-reference and validation', icon: Shield, processes: ['SEBI guidelines check', 'Government standards review', 'Brand guideline compliance', 'Legal requirement verification'] },
    { id: 3, name: 'Human Validation Queue', description: 'Final human expert review and approval', icon: UserCheck, processes: ['Expert manual review', 'Context validation', 'Risk assessment', 'Final approval/rejection'] }
  ];

  const complianceTypes = [
    { id: 'brand', name: 'Brand Guidelines', icon: Building, color: 'bg-blue-500', description: 'Visual identity and brand standards' },
    { id: 'sebi', name: 'SEBI Guidelines', icon: Gavel, color: 'bg-red-500', description: 'Securities and Exchange Board regulations' },
    { id: 'government', name: 'Government Standards', icon: Shield, color: 'bg-green-500', description: 'Government advertising and communication standards' }
  ];

  const campaignTypes = [
    'Social Media Campaign',
    'Print Advertisement',
    'Digital Banner',
    'Email Marketing',
    'Presentation Material',
    'Website Content',
    'Product Launch Material'
  ];

  const getCategoryAverage = (result: any, category: string) => {
    const cat = result?.evaluations?.find((e: any) => e.category === category);
    if (!cat) return 0;
    const sum = cat.sub_criteria.reduce((acc: number, s: any) => acc + s.score, 0);
    return sum / cat.sub_criteria.length || 0;
  };

  const getBadge = (avgScore: number) => {
    const percentage = Math.round(avgScore * 10);
    let className = '';
    let label = '';
    if (avgScore > 8) {
      className = 'bg-green-100 text-green-800';
      label = 'Pass';
    } else if (avgScore > 5) {
      className = 'bg-amber-100 text-amber-800';
      label = 'Warning';
    } else {
      className = 'bg-red-100 text-red-800';
      label = 'Fail';
    }
    return <Badge className={className}>{label} ({percentage}%)</Badge>;
  };

  const getTextBadge = (overall: number) => {
    const avgScore = overall / 10;
    return getBadge(avgScore);
  };

  const handleCheckLogo = async () => {
    if (!logoFile) {
      toast({ title: "Error", description: "Please upload a logo file.", variant: "destructive" });
      return;
    }
    setLoadingLogo(true);
    const formData = new FormData();
    formData.append('file', logoFile);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/check-logo`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data = await res.json();
      setLogoResult(data);
      toast({ title: "Logo Analysis Complete", description: `Overall: ${data.overall_accuracy_percentage}%` });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoadingLogo(false);
    }
  };

  const handleCheckText = async () => {
    if (!textFile && !campaignContent) {
      toast({ title: "Error", description: "Please upload a file or enter text.", variant: "destructive" });
      return;
    }
    setLoadingText(true);
    const formData = new FormData();
    if (textFile) {
      formData.append('file', textFile);
    } else if (campaignContent) {
      formData.append('text', campaignContent);
    }
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/check-text`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data = await res.json();
      setTextResult(data);
      toast({ title: "Text Analysis Complete", description: `Overall: ${data.overall_accuracy}%` });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoadingText(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'text') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'logo' && !file.type.startsWith('image/')) {
        toast({ title: "Error", description: "Please upload an image file.", variant: "destructive" });
        return;
      } else if (type === 'text' && !['.txt', '.doc', '.docx', '.pdf'].some(ext => file.name.toLowerCase().endsWith(ext))) {
        toast({ title: "Error", description: "Please upload a text, doc, docx, or pdf file.", variant: "destructive" });
        return;
      }
      toast({ title: "File Selected", description: `${file.name} is ready for analysis.` });
      type === 'logo' ? setLogoFile(file) : setTextFile(file);
    }
  };

  const triggerLogoUpload = () => {
    logoInputRef.current?.click();
  };

  const triggerTextUpload = () => {
    textInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/f1965c8a-ba23-43da-80d2-e1828995c058.png" 
                alt="Centura" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Compliance Checking Center</h1>
                <p className="text-sm text-muted-foreground">Logo and Text File Compliance Verification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Logo Compliance Section */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <span>Logo Compliance Check</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Upload a logo image for compliance verification
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your logo or click to browse
                </p>
                <Button variant="outline" onClick={triggerLogoUpload}>
                  Choose Logo File
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={logoInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'logo')}
                />
                {logoFile && (
                  <p className="mt-4 text-sm text-foreground">Selected file: {logoFile.name}</p>
                )}
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={handleCheckLogo}
                disabled={loadingLogo || !logoFile}
              >
                <Shield className="w-4 h-4 mr-2" />
                {loadingLogo ? 'Checking...' : 'Check Logo Compliance'}
              </Button>
              
              {/* Logo Results Section */}
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-foreground mb-3">Compliance Results</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Brand Guidelines:</span>
                    {logoResult ? getBadge(getCategoryAverage(logoResult, 'Font Verification')) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Color Standards:</span>
                    {logoResult ? getBadge(getCategoryAverage(logoResult, 'Color Compliance')) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Size Requirements:</span>
                    {logoResult ? getBadge(getCategoryAverage(logoResult, 'Logo Analysis')) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                </div>
                {logoResult && logoResult.improvements && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Improvements:</p>
                    <p>{logoResult.improvements}</p>
                  </div>
                )}
                {logoResult && logoResult.anomalies_detected?.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    <p className="font-medium">Anomalies:</p>
                    <ul>
                      {logoResult.anomalies_detected.map((anomaly: string, idx: number) => (
                        <li key={idx}>- {anomaly}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {logoResult && logoResult.what_is_right && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium">What is Right:</p>
                    <div className="whitespace-pre-wrap">{logoResult.what_is_right}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text File Compliance Section */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Text File Compliance Check</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Upload a text file or enter content for compliance verification
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Drag and drop a text file or click to browse
                </p>
                <Button variant="outline" size="sm" onClick={triggerTextUpload}>
                  Choose File
                </Button>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  ref={textInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'text')}
                />
                {textFile && (
                  <p className="mt-4 text-sm text-foreground">Selected file: {textFile.name}</p>
                )}
              </div>
              
              <div className="text-center text-muted-foreground text-sm">or</div>
              
              <Textarea
                placeholder="Paste your text content here for compliance checking..."
                className="min-h-[120px] resize-none"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
              />
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCheckText}
                disabled={loadingText || (!textFile && !campaignContent)}
              >
                <Gavel className="w-4 h-4 mr-2" />
                {loadingText ? 'Checking...' : 'Check Text Compliance'}
              </Button>
              
              {/* Text Results Section */}
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-foreground mb-3">Compliance Results</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">SEBI Guidelines:</span>
                    {textResult ? getTextBadge(textResult.overall_accuracy) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Government Standards:</span>
                    {textResult ? getTextBadge(textResult.overall_accuracy) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Legal Requirements:</span>
                    {textResult ? getTextBadge(textResult.overall_accuracy) : <Badge variant="secondary">Pending</Badge>}
                  </div>
                </div>
                {textResult && textResult.overall_improvements?.length > 0 && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Improvements:</p>
                    <ul>
                      {textResult.overall_improvements.map((imp: string, idx: number) => (
                        <li key={idx}>- {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {textResult && textResult.overall_anomalies_detected?.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    <p className="font-medium">Anomalies:</p>
                    <ul>
                      {textResult.overall_anomalies_detected.map((anomaly: string, idx: number) => (
                        <li key={idx}>- {anomaly}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {textResult && textResult.overall_what_is_right && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium">What is Right:</p>
                    <div className="whitespace-pre-wrap">{textResult.overall_what_is_right}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceUploadCenter;