
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, Eye, Download, Zap } from 'lucide-react';

interface UploadAnalysisFlowProps {
  onBack: () => void;
  userRole: string | null;
  userName: string;
}

type FlowStep = 'upload' | 'analyzing' | 'results';

const UploadAnalysisFlow = ({ onBack, userRole, userName }: UploadAnalysisFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const subsidiaries = [
    'JSW Steel', 'JSW Infrastructure', 'JSW Energy', 'JSW Cement', 
    'JSW Paints', 'JSW MG Motor', 'JSW Neo Energy'
  ];

  const assetTypes = [
    'Logo Application', 'Social Media Post', 'Print Advertisement', 
    'Presentation Template', 'Website Banner', 'Brochure/Flyer'
  ];

  const analysisLayers = [
    { id: 1, name: 'AI Initial Scan', description: 'Logo detection & basic compliance' },
    { id: 2, name: 'Compliance Agent Review', description: 'Brand guidelines verification' },
    { id: 3, name: 'Quality Assessment', description: 'Final validation & scoring' }
  ];

  // Simulate file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Start analysis process
  const startAnalysis = () => {
    if (!uploadedFile || !selectedSubsidiary || !selectedAssetType) return;
    
    setCurrentStep('analyzing');
    setAnalysisProgress(0);
    setCurrentLayer(1);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep('results'), 500);
          return 100;
        }
        
        // Update current layer based on progress
        if (prev >= 33 && currentLayer === 1) setCurrentLayer(2);
        if (prev >= 66 && currentLayer === 2) setCurrentLayer(3);
        
        return prev + 2;
      });
    }, 100);
  };

  // Mock compliance results
  const complianceResults = {
    overallScore: 87,
    elements: [
      { name: 'Logo Placement', score: 95, status: 'approved', feedback: 'Perfect positioning and sizing' },
      { name: 'Font Usage', score: 85, status: 'warning', feedback: 'Consider using JSW Sans for body text' },
      { name: 'Color Compliance', score: 92, status: 'approved', feedback: 'Colors match brand palette' },
      { name: 'Layout Structure', score: 78, status: 'needs-fix', feedback: 'Increase margin around logo by 10px' }
    ],
    quickFixes: [
      'Adjust logo margin spacing',
      'Replace Arial with JSW Sans font',
      'Increase contrast ratio for accessibility'
    ]
  };

  const getElementStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'needs-fix': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getElementIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'needs-fix': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderUploadStep = () => (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Asset for Verification</CardTitle>
          <CardDescription>
            Upload your design asset to verify brand compliance across our 3-layer verification system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Drop your file here</h3>
                <p className="text-gray-600">or click to browse</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4">
                    Choose File
                  </Button>
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">✓ {uploadedFile.name}</p>
                  <p className="text-green-600 text-sm">Ready for analysis</p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subsidiary Company</label>
              <Select value={selectedSubsidiary} onValueChange={setSelectedSubsidiary}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subsidiary" />
                </SelectTrigger>
                <SelectContent>
                  {subsidiaries.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Asset Type</label>
              <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={startAnalysis}
            disabled={!uploadedFile || !selectedSubsidiary || !selectedAssetType}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Brand Compliance Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Process Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3-Layer Verification Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisLayers.map((layer, index) => (
              <div key={layer.id} className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {layer.id}
                </div>
                <h4 className="font-medium text-gray-900">{layer.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{layer.description}</p>
                {index < analysisLayers.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-6 -translate-y-1/2">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Analyzing Your Asset</CardTitle>
          <CardDescription>
            Our AI-powered system is verifying your design against JSW Build brand guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Analysis Progress</span>
              <span className="text-sm text-gray-600">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
          </div>

          {/* Layer Progress */}
          <div className="space-y-4">
            {analysisLayers.map((layer) => (
              <div 
                key={layer.id} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentLayer === layer.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : currentLayer > layer.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                    currentLayer === layer.id 
                      ? 'bg-blue-600 text-white animate-pulse' 
                      : currentLayer > layer.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentLayer > layer.id ? '✓' : layer.id}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{layer.name}</h4>
                    <p className="text-sm text-gray-600">{layer.description}</p>
                  </div>
                  {currentLayer === layer.id && (
                    <div className="ml-auto">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* File Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Processing:</h4>
            <p className="text-sm text-gray-600">
              <strong>File:</strong> {uploadedFile?.name}<br />
              <strong>Subsidiary:</strong> {selectedSubsidiary}<br />
              <strong>Type:</strong> {selectedAssetType}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-8">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Compliance Analysis Complete</CardTitle>
          <CardDescription>
            Your asset has been analyzed against JSW Build brand guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className={`text-6xl font-bold ${complianceResults.overallScore >= 85 ? 'text-green-600' : 'text-amber-600'}`}>
              {complianceResults.overallScore}%
            </div>
            <Badge className={`text-lg px-4 py-2 ${complianceResults.overallScore >= 85 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {complianceResults.overallScore >= 85 ? 'Brand Compliant' : 'Needs Minor Adjustments'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <Button variant="outline" className="h-12">
              <Eye className="w-4 h-4 mr-2" />
              Preview Asset
            </Button>
            <Button variant="outline" className="h-12">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Element Analysis */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Element Analysis</CardTitle>
              <CardDescription>Detailed breakdown of compliance by design element</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceResults.elements.map((element, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getElementIcon(element.status)}
                      <h4 className="font-medium text-gray-900">{element.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">{element.score}%</span>
                      <Badge className={`text-xs ${getElementStatusColor(element.status)}`}>
                        {element.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={element.score} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{element.feedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Fixes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Suggested Fixes</CardTitle>
              <CardDescription>Recommended improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceResults.quickFixes.map((fix, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-900">{fix}</p>
                </div>
              ))}
              
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Apply Quick Fixes
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Send for Review
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full">
                Upload Another Asset
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JSW</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brand Compliance Verification</h1>
                <p className="text-sm text-gray-600">AI-Powered Asset Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { id: 'upload', name: 'Upload Asset', number: 1 },
              { id: 'analyzing', name: 'Analysis', number: 2 },
              { id: 'results', name: 'Results', number: 3 }
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : index < ['upload', 'analyzing', 'results'].indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < ['upload', 'analyzing', 'results'].indexOf(currentStep) ? '✓' : step.number}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.name}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    index < ['upload', 'analyzing', 'results'].indexOf(currentStep) 
                      ? 'bg-green-600' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'analyzing' && renderAnalyzingStep()}
        {currentStep === 'results' && renderResultsStep()}
      </div>
    </div>
  );
};

export default UploadAnalysisFlow;
