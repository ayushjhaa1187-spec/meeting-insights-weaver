import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Clock, Loader2, Download, Share2, Edit3 } from "lucide-react";
import { sampleBrdSections, pipelineSteps as initialSteps } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type StepStatus = "complete" | "active" | "pending";

const BrdGenerationPage = () => {
  const [steps, setSteps] = useState(initialSteps.map(s => ({ ...s })));
  const [visibleSections, setVisibleSections] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [accuracy, setAccuracy] = useState(0);
  const { toast } = useToast();

  // Simulate pipeline progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const stepDelays = [800, 2500, 4500, 7000, 10000];
    
    stepDelays.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) => ({
              ...s,
              status: (idx <= i ? "complete" : idx === i + 1 ? "active" : "pending") as StepStatus,
            }))
          );
        }, delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Simulate section streaming
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    sampleBrdSections.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleSections(i + 1);
          if (i === sampleBrdSections.length - 1) {
            setTimeout(() => setIsStreaming(false), 1500);
          }
        }, 2000 + i * 2500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Simulate accuracy climbing
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 4 + 1;
      if (current >= 92.4) {
        current = 92.4;
        clearInterval(interval);
      }
      setAccuracy(Math.round(current * 10) / 10);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleExport = (format: string) => {
    toast({ title: `Exporting as ${format}`, description: "Your BRD document is being prepared..." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live BRD Generation</h1>
          <p className="text-sm text-muted-foreground">Enron Email Analysis — Project Alpha</p>
        </div>
        <div className="flex items-center gap-3">
          {isStreaming ? (
            <Badge className="gap-1.5 bg-primary/15 text-primary border-0 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" /> Streaming
            </Badge>
          ) : (
            <Badge className="gap-1.5 bg-success/15 text-success border-0">
              <CheckCircle2 className="h-3 w-3" /> Complete
            </Badge>
          )}
          <span className="text-sm font-medium">Accuracy: {accuracy}%</span>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="stat-card">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.name} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step.status === "complete"
                      ? "bg-success text-success-foreground"
                      : step.status === "active"
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "complete" ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium ${
                  step.status === "complete" ? "text-success" : step.status === "active" ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BRD Document */}
      <div className="stat-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Generated BRD Document</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleExport("PDF")}>
              <Download className="h-3 w-3" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleExport("DOCX")}>
              <Download className="h-3 w-3" /> DOCX
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast({ title: "Share link copied!" })}>
              <Share2 className="h-3 w-3" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast({ title: "Edit mode enabled" })}>
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {sampleBrdSections.slice(0, visibleSections).map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-lg border bg-secondary/20 p-5"
              >
                <h3 className="mb-3 text-base font-bold text-primary">{section.title}</h3>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isStreaming && visibleSections < sampleBrdSections.length && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating next section...
            </div>
          )}

          {!isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border-2 border-dashed border-success/30 bg-success/5 p-4 text-center"
            >
              <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
              <p className="mt-2 text-sm font-medium text-success">BRD Generation Complete — Accuracy: {accuracy}%</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrdGenerationPage;
