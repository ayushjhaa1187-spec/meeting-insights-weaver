import { metricsData } from "@/lib/mockData";
import { Target, Crosshair, RotateCcw, Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const metricCards = [
  { label: "Accuracy", value: metricsData.accuracy, icon: Target, color: "text-primary" },
  { label: "Precision", value: metricsData.precision, icon: Crosshair, color: "text-success" },
  { label: "Recall", value: metricsData.recall, icon: RotateCcw, color: "text-warning" },
  { label: "F1 Score", value: metricsData.f1Score, icon: Activity, color: "text-info" },
];

const COLORS = ["hsl(215, 90%, 52%)", "hsl(210, 20%, 85%)"];

const MetricsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Performance</h1>
        <p className="text-sm text-muted-foreground">Validation & accuracy metrics across all BRD generations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card text-center"
          >
            <card.icon className={`mx-auto h-5 w-5 ${card.color}`} />
            <p className="mt-2 text-3xl font-bold">{card.value}%</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accuracy Over Time */}
        <div className="stat-card">
          <h2 className="mb-4 text-base font-semibold">Accuracy Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metricsData.accuracyOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(215, 90%, 52%)" strokeWidth={2.5} dot={{ fill: "hsl(215, 90%, 52%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Noise Removal Pie */}
        <div className="stat-card">
          <h2 className="mb-4 text-base font-semibold">Noise Removal</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={metricsData.noiseRemoval}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="category"
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
              >
                {metricsData.noiseRemoval.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Distribution */}
        <div className="stat-card">
          <h2 className="mb-4 text-base font-semibold">Latency Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metricsData.latencyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(215, 90%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-BRD Comparison Table */}
        <div className="stat-card">
          <h2 className="mb-4 text-base font-semibold">Per-BRD Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">BRD Name</th>
                  <th className="pb-2 font-medium">Accuracy</th>
                  <th className="pb-2 font-medium">Ground Truth</th>
                  <th className="pb-2 font-medium">Latency</th>
                  <th className="pb-2 font-medium">Reqs</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.perBrdComparison.map((row) => (
                  <tr key={row.name} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{row.name}</td>
                    <td className="py-2.5 text-success font-semibold">{row.accuracy}%</td>
                    <td className="py-2.5 text-muted-foreground">{row.groundTruth}</td>
                    <td className="py-2.5">{row.latency}</td>
                    <td className="py-2.5">{row.requirements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;
