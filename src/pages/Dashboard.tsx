import { FileText, Activity, Target, Database, TrendingUp, ArrowRight, Eye, Clock } from "lucide-react";
import { dashboardStats, recentBrds, pipelineSteps, noiseFilterStats } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const statCards = [
  { label: "Total BRDs", value: dashboardStats.totalBrds, icon: FileText, change: "+3 this week" },
  { label: "Active Pipelines", value: dashboardStats.activePipelines, icon: Activity, change: "2 processing" },
  { label: "Avg Accuracy", value: `${dashboardStats.avgAccuracy}%`, icon: Target, change: "+0.8%" },
  { label: "Docs Processed", value: dashboardStats.docsProcessed, icon: Database, change: "↑ 12K today" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor your AI requirement intelligence pipeline</p>
        </div>
        <Button onClick={() => navigate("/upload")} className="gap-2">
          <FileText className="h-4 w-4" /> New BRD
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" /> {card.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent BRDs */}
        <div className="stat-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent BRDs</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/brds")} className="gap-1 text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentBrds.map((brd) => (
              <div
                key={brd.id}
                className="flex items-center justify-between rounded-lg border bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/60"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{brd.name}</p>
                    <p className="text-xs text-muted-foreground">{brd.updated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {brd.status === "Complete" ? (
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      {brd.accuracy}%
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                      Running
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/brds")}
                    className="h-7 gap-1 text-xs"
                  >
                    {brd.status === "Complete" ? <><Eye className="h-3 w-3" /> View</> : <><Clock className="h-3 w-3" /> Watch</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Active Pipeline */}
          <div className="stat-card">
            <h2 className="mb-3 text-base font-semibold">Active Pipeline</h2>
            <div className="flex items-center gap-1.5">
              {pipelineSteps.map((step, i) => (
                <div key={step.name} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-7 items-center rounded-md px-2.5 text-xs font-medium ${
                      step.status === "complete"
                        ? "bg-success/15 text-success"
                        : step.status === "active"
                        ? "bg-primary/15 text-primary animate-pulse"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.status === "complete" ? "✓" : step.status === "active" ? "⟳" : "○"} {step.name}
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={45} className="mt-4 h-2" />
            <p className="mt-1.5 text-xs text-muted-foreground">Entity Extraction — 45% complete</p>
          </div>

          {/* Noise Filtering */}
          <div className="stat-card">
            <h2 className="mb-3 text-base font-semibold">Noise Filtering Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Input Emails</span>
                <span className="font-medium">{(noiseFilterStats.inputEmails).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Relevant Output</span>
                <span className="font-medium text-success">{(noiseFilterStats.outputRelevant).toLocaleString()}</span>
              </div>
              <Progress value={noiseFilterStats.percentRemoved} className="mt-2 h-3" />
              <p className="text-xs text-muted-foreground text-center">{noiseFilterStats.percentRemoved}% noise removed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
