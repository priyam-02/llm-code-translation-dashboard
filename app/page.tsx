"use client";

import { useState, useEffect } from "react";
import { BenchmarkResult, Filters } from "@/types";
import FilterPanel from "@/components/FilterPanel";
import MetricCard from "@/components/MetricCard";
import LLMPerformanceChart from "@/components/LLMPerformanceChart";
import ComplexityChart from "@/components/ComplexityChart";
import LanguageChart from "@/components/LanguageChart";
import PromptChart from "@/components/PromptChart";
import HeatmapChart from "@/components/HeatmapChart";
import {
  filterData,
  calculateMetrics,
  getLLMPerformance,
  getComplexityPerformance,
  getLanguagePerformance,
  getPromptPerformance,
  getHeatmapData,
} from "@/lib/utils";

export default function Dashboard() {
  const [data, setData] = useState<BenchmarkResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    language: "all",
    llm: "all",
    prompt: "all",
    complexity: "all",
  });

  const [languages, setLanguages] = useState<string[]>([]);
  const [llms, setLlms] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [complexities, setComplexities] = useState<string[]>([]);

  useEffect(() => {
    fetch("/benchmark_data.json")
      .then((res) => res.json())
      .then((jsonData: BenchmarkResult[]) => {
        setData(jsonData);
        setLanguages(
          Array.from(new Set(jsonData.map((d) => d.target_language))).sort()
        );
        setLlms(Array.from(new Set(jsonData.map((d) => d.llm))).sort());
        setPrompts(Array.from(new Set(jsonData.map((d) => d.prompt))).sort());
        setComplexities(["simple", "moderate", "complex"]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading benchmark data...</p>
        </div>
      </div>
    );
  }

  // Static insights - always use full dataset (all filters = "all")
  const staticLLMPerformance = getLLMPerformance(data);
  const staticComplexityPerformance = getComplexityPerformance(data);
  const staticLanguagePerformance = getLanguagePerformance(data);
  const staticPromptPerformance = getPromptPerformance(data);

  // Filtered data for charts and metrics
  const filteredData = filterData(data, filters);
  const metrics = calculateMetrics(filteredData);
  const llmPerformance = getLLMPerformance(filteredData);
  const complexityPerformance = getComplexityPerformance(filteredData);
  const languagePerformance = getLanguagePerformance(filteredData);
  const promptPerformance = getPromptPerformance(filteredData);
  const heatmapData = getHeatmapData(filteredData);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 glass rounded-2xl shadow-lg p-8 border border-white/20 fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            Polyglot: An Extensible Framework to Benchmark Code Translation with
            LLMs
          </h1>

          <div className="mb-6 flex flex-wrap gap-x-3 gap-y-2 items-center text-sm border-b border-gray-200 pb-4">
            <a
              href="https://conf.researchr.org/details/ase-2025/ase-2025-papers/89/Polyglot-An-Extensible-Framework-to-Benchmark-Code-Translation-with-LLMs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-all duration-200 border border-blue-200 hover:border-blue-300"
            >
              <span>📄</span>
              <span>Abstract</span>
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-medium">Authors:</span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              <a
                href="https://www.linkedin.com/in/mvieira1975/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Marco Vieira
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/priyam-shah-software-developer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Priyam Shah
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/bhavainshah/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Bhavain Shah
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/rrezartakrasniqi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Rrezarta Krasniqi
              </a>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed mb-3">
              We did research on LLM-based code translation by taking{" "}
              <strong className="text-gray-900">150 C programs</strong> and
              translating them into{" "}
              <strong className="text-gray-900">Python, Java, and Rust</strong>.
              We worked with{" "}
              <strong className="text-gray-900">
                seven open-source models
              </strong>{" "}
              (<strong className="text-indigo-700">Llama</strong>,{" "}
              <strong className="text-indigo-700">Qwen</strong>, and{" "}
              <strong className="text-indigo-700">DeepSeek</strong> families)
              and <strong className="text-gray-900">different prompts</strong>{" "}
              (0-Shot, CoT) and varying problem complexities. You can filter the
              data to explore the performance of each model.
            </p>
            <br />
            <p className="text-gray-700 leading-relaxed font-semibold mb-2">
              Here are few Key Insights:
            </p>
          </div>
          <div className="space-y-2">
            {staticLLMPerformance.length > 0 && (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                <p className="text-gray-700">
                  <strong>Best Performing LLM:</strong>{" "}
                  {staticLLMPerformance[0].name} with{" "}
                  {staticLLMPerformance[0].testPassRate.toFixed(2)}% test pass
                  rate
                </p>
              </div>
            )}
            {staticLanguagePerformance.length > 0 && (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                <p className="text-gray-700">
                  <strong>Easiest Target Language:</strong>{" "}
                  {staticLanguagePerformance[0].name} with{" "}
                  {staticLanguagePerformance[0].testPassRate.toFixed(2)}%
                  success rate
                </p>
              </div>
            )}
            {staticPromptPerformance.length > 0 && (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                <p className="text-gray-700">
                  <strong>Most Effective Prompt:</strong>{" "}
                  {staticPromptPerformance[0].name} with{" "}
                  {staticPromptPerformance[0].testPassRate.toFixed(2)}% test
                  pass rate
                </p>
              </div>
            )}
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
              <p className="text-gray-700">
                <strong>Complexity Impact:</strong> Performance drops from{" "}
                {staticComplexityPerformance[0]?.testPassRate.toFixed(2)}%
                (simple) to{" "}
                {staticComplexityPerformance[2]?.testPassRate.toFixed(2)}%
                (complex)
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 mb-10 glass rounded-xl shadow-lg border border-white/20">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            languages={languages}
            llms={llms}
            prompts={prompts}
            complexities={complexities}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Total Translations"
            value={metrics.totalTranslations.toLocaleString()}
            description="Total number of code translations in filtered dataset"
          />
          <MetricCard
            title="Unique Problems"
            value={metrics.uniqueProblems.toLocaleString()}
            description="Number of unique problems in filtered dataset"
          />
          <MetricCard
            title="Compilation Success"
            value={`${metrics.compileRate}%`}
            percentage={metrics.compileRate}
            description="Percentage of translations that compiled successfully"
          />
          <MetricCard
            title="Runtime Success"
            value={`${metrics.runtimeSuccessRate}%`}
            percentage={metrics.runtimeSuccessRate}
            description="Percentage of translations that ran without errors"
          />
          <MetricCard
            title="Test Pass Rate"
            value={`${metrics.testPassRate}%`}
            percentage={metrics.testPassRate}
            description="Percentage of translations that passed all tests"
          />
        </div>

        <div className="space-y-8">
          <LLMPerformanceChart data={llmPerformance} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComplexityChart data={complexityPerformance} />
            <LanguageChart data={languagePerformance} />
          </div>

          <PromptChart data={promptPerformance} />
          <HeatmapChart data={heatmapData} />
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/90 font-semibold text-lg">
            Polyglot Benchmark Results Dashboard
          </p>
          <p className="mt-2 text-white/70">
            Data from {data.length.toLocaleString()} code translations across 7
            LLMs
          </p>
          <p className="mt-4 text-xs text-white/50">
            Built with Next.js, React, and Recharts
          </p>
        </div>
      </footer>
    </div>
  );
}
