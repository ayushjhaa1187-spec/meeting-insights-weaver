import { useState, useCallback } from "react";
import { Mail, Mic, MessageSquare, Database, Upload as UploadIcon, X, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { datasets } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface QueueItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

const uploadCards = [
  { type: "email", label: "Email Upload", icon: Mail, description: "Drop CSV/JSON email exports", accept: ".csv,.json" },
  { type: "transcript", label: "Transcript Upload", icon: Mic, description: "Drop TXT/JSON transcripts", accept: ".txt,.json" },
  { type: "chat", label: "Chat Upload", icon: MessageSquare, description: "Drop chat log files", accept: ".txt,.json,.csv" },
];

const UploadPage = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [useDemo, setUseDemo] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = useCallback((type: string) => {
    // Simulate file selection
    const fakeFile: QueueItem = {
      id: crypto.randomUUID(),
      name: `${type}_data_${Date.now()}.csv`,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)}MB`,
      progress: 0,
      status: "uploading",
    };
    setQueue((prev) => [...prev, fakeFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setQueue((prev) =>
          prev.map((item) =>
            item.id === fakeFile.id ? { ...item, progress: 100, status: "complete" } : item
          )
        );
        toast({ title: "Upload complete", description: `${fakeFile.name} uploaded successfully` });
      } else {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === fakeFile.id ? { ...item, progress: Math.min(progress, 100) } : item
          )
        );
      }
    }, 400);
  }, [toast]);

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleDataset = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    setUseDemo(true);
  };

  const handleStartProcessing = () => {
    toast({ title: "Pipeline started", description: "Processing documents through the BRD pipeline..." });
    setTimeout(() => navigate("/brds"), 1500);
  };

  const canProcess = queue.some((q) => q.status === "complete") || selectedDatasets.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Data Sources</h1>
        <p className="text-sm text-muted-foreground">Upload emails, transcripts, or use demo datasets</p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {uploadCards.map((card, i) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card flex flex-col items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => handleFileSelect(card.type)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <card.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">{card.label}</h3>
            <p className="text-center text-xs text-muted-foreground">{card.description}</p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <UploadIcon className="h-3.5 w-3.5" /> Browse Files
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Demo Datasets */}
      <div className="stat-card">
        <h2 className="mb-4 text-base font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" /> Use Demo Datasets
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {datasets.map((ds) => (
            <div
              key={ds.id}
              onClick={() => toggleDataset(ds.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                selectedDatasets.includes(ds.id)
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{ds.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{ds.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{ds.type}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{ds.records}</span>
                <span>•</span>
                <span>{ds.size}</span>
                {ds.license && (
                  <>
                    <span>•</span>
                    <span>{ds.license}</span>
                  </>
                )}
              </div>
              <a
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {ds.source} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Queue */}
      {queue.length > 0 && (
        <div className="stat-card">
          <h2 className="mb-4 text-base font-semibold">Upload Queue</h2>
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border bg-secondary/30 p-3">
                <UploadIcon className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{item.size}</span>
                      <button onClick={() => removeFromQueue(item.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Progress value={item.progress} className="mt-2 h-1.5" />
                </div>
                {item.status === "complete" && (
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-xs">Done</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Processing */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2"
          disabled={!canProcess}
          onClick={handleStartProcessing}
        >
          <Play className="h-4 w-4" /> Start Processing Pipeline
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;
