"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { VariationData } from "@/types";
import { Filters } from "@/types";

interface ComplexityVariationChartProps {
  data: VariationData[];
  filters: Filters;
}

export default function ComplexityVariationChart({
  data,
  filters,
}: ComplexityVariationChartProps) {
  const showSortingNote = filters.complexity === "all";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-gray-700">
            ΔCC (log): {data.deltaCClog.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Range: [{data.minDeltaCC}, {data.maxDeltaCC}]
          </p>
          <p className="text-sm text-gray-700 mt-1">
            ΔSLoC: {data.deltaLOC.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Range: [{data.minDeltaLOC}, {data.maxDeltaLOC}]
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl shadow-lg p-8 border border-white/20 card-hover fade-in">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Code Variation by Complexity
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        How cyclomatic complexity and code length change across problem
        complexity levels.
        {showSortingNote && (
          <span className="italic"> Showing all complexity levels.</span>
        )}
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Variation", angle: -90, position: "insideLeft" }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
          <Bar
            dataKey="deltaCClog"
            fill="#6366f1"
            name="ΔCC (log)"
            maxBarSize={80}
          />
          <Line
            type="monotone"
            dataKey="deltaLOC"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 6, fill: "#f59e0b" }}
            name="ΔSLoC"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
