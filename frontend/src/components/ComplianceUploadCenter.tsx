import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileIcon,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplianceUploadCenterProps {
  onBack: () => void;
  userName: string;
}

const ComplianceUploadCenter = ({ onBack, userName }: ComplianceUploadCenterProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);
  const [campaignContent, setCampaignContent] = useState("");
  const [logoResult, setLogoResult] = useState<any>(null);
  const [textResult, setTextResult] = useState<any>(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [selectedGuidelines, setSelectedGuidelines] = useState<string[]>([]);
  const [loadingClassify, setLoadingClassify] = useState(false);
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
 const API_URL = process.env.REACT_APP_AI_API_URL || "https://your-deta-micro-name.deta.dev";

  const guidelineOptions = [
    "mutual_fund",
    "investing",
    "trading",
    "ipo",
    "fno_derivatives",
  ];

  // ---------- Helpers ----------
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "text"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo" && !file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "File Selected", description: `${file.name} is ready for analysis.` });
    type === "logo" ? setLogoFile(file) : setTextFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoPreview(reader.result as string);
      } else {
        if (file.type === "application/pdf" || file.type.startsWith("text/")) {
          reader.result && setTextPreview((reader.result as string).substring(0, 500) + "...");
        } else {
          setTextPreview("File uploaded. Preview not available for this type.");
        }
      }
    };
    if (type === "logo" || file.type.startsWith("image/")) reader.readAsDataURL(file);
    else reader.readAsText(file);

    // Reset states
    setDetectedType(null);
    setSelectedGuidelines([]);
    setTextResult(null);
  };

  const fetchApi = async (
    endpoint: string,
    body: FormData,
    setter: any,
    loaderSetter: any,
    label: string
  ) => {
    loaderSetter(true);
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, { method: "POST", body });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data = await res.json();
      setter(data);
      toast({ title: `${label} Analysis Complete`, description: `Overall: ${data.overall_accuracy_percentage}%` });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      loaderSetter(false);
    }
  };

  const handleClassifyText = () => {
    if (!textFile && !campaignContent) return;
    const formData = new FormData();
    if (textFile) formData.append("file", textFile);
    else formData.append("text", campaignContent);
    setLoadingClassify(true);
    fetchApi("classify-text", formData, (data: any) => {
      setDetectedType(data.detected_type);
      // Pre-select based on detected
      if (data.detected_type === "mutual_fund") {
        setSelectedGuidelines(["mutual_fund"]);
      } else if (data.detected_type !== "other") {
        setSelectedGuidelines([data.detected_type]);
      }
    }, setLoadingClassify, "Classification");
  };

  const handleCheckLogo = () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append("file", logoFile);
    fetchApi("check-logo", formData, setLogoResult, setLoadingLogo, "Logo");
  };

  const handleCheckText = () => {
    if (!textFile && !campaignContent) return;
    if (selectedGuidelines.length === 0) {
      toast({ title: "Error", description: "Select at least one guideline type.", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    if (textFile) formData.append("file", textFile);
    else formData.append("text", campaignContent);
    formData.append("guideline_types", JSON.stringify(selectedGuidelines));
    fetchApi("check-text", formData, setTextResult, setLoadingText, "Text");
  };

  const toggleGuideline = (opt: string) => {
    setSelectedGuidelines((prev) =>
      prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
    );
  };

  const getBadge = (percentage: number) => {
    if (percentage >= 95) return <Badge className="bg-green-100 text-green-800">Pass ({percentage}%)</Badge>;
    if (percentage >= 80) return <Badge className="bg-amber-100 text-amber-800">Warning ({percentage}%)</Badge>;
    return <Badge className="bg-red-100 text-red-800">Fail ({percentage}%)</Badge>;
  };

  const renderEvaluations = (evaluations: any[]) => (
    <Accordion type="single" collapsible className="w-full">
      {evaluations?.map((guideline: any, gIdx: number) => (
        <AccordionItem key={gIdx} value={`guideline-${gIdx}`}>
          <AccordionTrigger className="flex items-center">
            {guideline.guideline}
            <Badge className="ml-auto">{guideline.status} ({guideline.guideline_percentage}%)</Badge>
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="single" collapsible className="w-full">
              {guideline.categories?.map((cat: any, cIdx: number) => (
                <AccordionItem key={cIdx} value={`cat-${gIdx}-${cIdx}`}>
                  <AccordionTrigger className="flex items-center">
                    {cat.category}
                    <Badge className="ml-auto">{cat.status} ({cat.category_percentage}%)</Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-4 space-y-1 text-sm">
                      {cat.sub_criteria?.map((s: any, i: number) => (
                        <li key={i} className="flex justify-between">
                          <span>{s.name} (conf: {s.confidence})</span>
                          <Badge variant={s.pass_fail === "Pass" ? "default" : "destructive"}>
                            {s.pass_fail}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  const renderGuidance = (result: any) => (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-medium flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> What is Right
        </h4>
        <ul className="list-disc pl-4">
          {result.what_is_right?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-medium flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Improvements
        </h4>
        <ul className="list-disc pl-4">
          {result.improvements?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-medium flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Anomalies
        </h4>
        <ul className="list-disc pl-4">
          {result.anomalies_detected?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </div>
  );

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="bg-card border-b border-border shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
            <h1 className="text-xl font-bold">Compliance Center</h1>
          </div>
          <div className="text-sm">Welcome, {userName}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Section */}
        <Card>
          <CardHeader><CardTitle>Text Compliance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              {textPreview ? <ScrollArea className="h-32 p-2 bg-muted">{textPreview}</ScrollArea> : <FileIcon className="w-12 h-12 mx-auto" />}
              <Button variant="outline" onClick={() => textInputRef.current?.click()}>Select File</Button>
              <input type="file" accept="*/*" ref={textInputRef} className="hidden" onChange={(e) => handleFileChange(e,"text")} />
              {textFile && <p className="mt-2 text-xs">{textFile.name}</p>}
            </div>
            <Textarea placeholder="Paste text content..." value={campaignContent} onChange={(e) => setCampaignContent(e.target.value)} />
            <Button className="w-full" onClick={handleClassifyText} disabled={loadingClassify || (!textFile && !campaignContent)}>
              {loadingClassify ? "Classifying..." : "Detect Type"}
            </Button>
            {detectedType && (
              <div className="space-y-2">
                <p>Detected Type: {detectedType.replace("_", " ").toUpperCase()}</p>
                <p>Select Guideline Types to Check (multi-select):</p>
                <div className="space-y-2">
                  {guidelineOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <Checkbox
                        id={opt}
                        checked={selectedGuidelines.includes(opt)}
                        onCheckedChange={() => toggleGuideline(opt)}
                      />
                      <Label htmlFor={opt}>{opt.replace("_", " ").toUpperCase()}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Universal ASCI guidelines will always be checked.</p>
              </div>
            )}
            <Button className="w-full" onClick={handleCheckText} disabled={loadingText || selectedGuidelines.length === 0 || (!textFile && !campaignContent)}>
              {loadingText ? "Analyzing..." : "Analyze Text"}
            </Button>
            {textResult && (
              <div className="space-y-4">
                <div className="flex justify-between"><span>Overall Compliance</span>{getBadge(textResult.overall_accuracy_percentage)}</div>
                <Progress value={textResult.overall_accuracy_percentage} className="h-2" />
                {renderEvaluations(textResult.evaluations)}
                {renderGuidance(textResult)}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ComplianceUploadCenter;