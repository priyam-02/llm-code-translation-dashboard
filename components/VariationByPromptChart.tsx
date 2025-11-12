"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VariationData } from "@/types";
import { Filters } from "@/types";

interface VariationByPromptChartProps {
  data: VariationData[];
  filters: Filters;
}

export default function VariationByPromptChart({
  data,
  filters,
}: VariationByPromptChartProps) {
  const showSortingNote = filters.prompt === "all";

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
        Code Variation by Prompt Strategy
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        How different prompting strategies affect code complexity and length
        variations.
        {showSortingNote && (
          <span className="italic"> Showing all strategies.</span>
        )}
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={140} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="deltaCClog"
            fill="#6366f1"
            name="ΔCC (log)"
            maxBarSize={20}
          />
          <Bar dataKey="deltaLOC" fill="#f59e0b" name="ΔSLoC" maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
