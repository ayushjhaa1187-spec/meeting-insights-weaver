import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw } from "lucide-react";

const SettingsPage = () => {
  const { toast } = useToast();
  const [model, setModel] = useState("gemini-flash");
  const [temperature, setTemperature] = useState([0.3]);
  const [maxTokens, setMaxTokens] = useState([4096]);
  const [noiseThreshold, setNoiseThreshold] = useState([0.2]);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [autoValidate, setAutoValidate] = useState(true);

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your configuration has been updated." });
  };

  const handleReset = () => {
    setModel("gemini-flash");
    setTemperature([0.3]);
    setMaxTokens([4096]);
    setNoiseThreshold([0.2]);
    setExportFormat("pdf");
    setIncludeMetadata(true);
    setIncludeSources(true);
    setAutoValidate(true);
    toast({ title: "Settings reset", description: "All settings restored to defaults." });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure AI model and export preferences</p>
      </div>

      {/* AI Model Settings */}
      <div className="stat-card space-y-5">
        <h2 className="text-base font-semibold">AI Model Settings</h2>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-flash">Gemini 3 Flash (Fast)</SelectItem>
              <SelectItem value="gemini-pro">Gemini 2.5 Pro (Best)</SelectItem>
              <SelectItem value="gpt5">GPT-5 (Premium)</SelectItem>
              <SelectItem value="gpt5-mini">GPT-5 Mini (Balanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Temperature</Label>
            <span className="text-sm font-mono text-muted-foreground">{temperature[0]}</span>
          </div>
          <Slider min={0} max={1} step={0.1} value={temperature} onValueChange={setTemperature} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Max Tokens</Label>
            <span className="text-sm font-mono text-muted-foreground">{maxTokens[0]}</span>
          </div>
          <Slider min={512} max={8192} step={512} value={maxTokens} onValueChange={setMaxTokens} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Noise Threshold</Label>
            <span className="text-sm font-mono text-muted-foreground">{noiseThreshold[0]}</span>
          </div>
          <Slider min={0} max={1} step={0.05} value={noiseThreshold} onValueChange={setNoiseThreshold} />
          <p className="text-xs text-muted-foreground">Documents with relevance below this score are discarded</p>
        </div>
      </div>

      {/* Export Preferences */}
      <div className="stat-card space-y-5">
        <h2 className="text-base font-semibold">Export Preferences</h2>

        <div className="space-y-2">
          <Label>Default Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="metadata">Include Metadata</Label>
          <Switch id="metadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sources">Include Sources</Label>
          <Switch id="sources" checked={includeSources} onCheckedChange={setIncludeSources} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autovalidate">Auto-Validate</Label>
          <Switch id="autovalidate" checked={autoValidate} onCheckedChange={setAutoValidate} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Reset Defaults
        </Button>
        <Button onClick={handleSave} className="gap-1.5">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
