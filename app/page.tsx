"use client";

import { useState, useEffect } from "react";
import { BenchmarkResult, Filters, StaticMetric } from "@/types";
import FilterPanel from "@/components/FilterPanel";
import MetricCard from "@/components/MetricCard";
import LLMPerformanceChart from "@/components/LLMPerformanceChart";
import ComplexityChart from "@/components/ComplexityChart";
import LanguageChart from "@/components/LanguageChart";
import PromptChart from "@/components/PromptChart";
import HeatmapChart from "@/components/HeatmapChart";
import ComplexityVariationChart from "@/components/ComplexityVariationChart";
import VariationByLanguageChart from "@/components/VariationByLanguageChart";
import VariationByPromptChart from "@/components/VariationByPromptChart";
import VariationByLLMChart from "@/components/VariationByLLMChart";
import {
  filterData,
  calculateMetrics,
  getLLMPerformance,
  getComplexityPerformance,
  getLanguagePerformance,
  getPromptPerformance,
  getHeatmapData,
  getComplexityVariationData,
  getLanguageVariationData,
  getPromptVariationData,
  getLLMVariationData,
} from "@/lib/utils";

export default function Dashboard() {
  const [data, setData] = useState<BenchmarkResult[]>([]);
  const [staticMetrics, setStaticMetrics] = useState<StaticMetric[]>([]);
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
    // Load both benchmark data and static metrics in parallel from API routes
    Promise.all([
      fetch("/api/benchmark-data").then((res) => res.json()),
      fetch("/api/static-metrics").then((res) => res.json()),
    ])
      .then(([benchmarkResponse, metricsResponse]) => {
        // Extract data from API response
        const benchmarkData: BenchmarkResult[] = benchmarkResponse.data;
        const metricsData: StaticMetric[] = metricsResponse.data;

        // Log data source for debugging
        console.log("Benchmark data source:", benchmarkResponse.source);
        console.log("Static metrics source:", metricsResponse.source);

        // Show warning if using fallback data
        if (benchmarkResponse.source === "fallback-json") {
          console.warn(
            "⚠️ Using fallback benchmark data:",
            benchmarkResponse.warning
          );
        }
        if (metricsResponse.source === "fallback-json") {
          console.warn(
            "⚠️ Using fallback metrics data:",
            metricsResponse.warning
          );
        }

        setData(benchmarkData);
        setStaticMetrics(metricsData);
        setLanguages(
          Array.from(
            new Set(benchmarkData.map((d) => d.target_language))
          ).sort()
        );
        setLlms(Array.from(new Set(benchmarkData.map((d) => d.llm))).sort());
        setPrompts(
          Array.from(new Set(benchmarkData.map((d) => d.prompt))).sort()
        );
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

  // Variation data from static metrics (static - for key insights)
  const staticComplexityVariation = getComplexityVariationData(staticMetrics, {
    language: "all",
    llm: "all",
    prompt: "all",
    complexity: "all",
  });
  const staticLanguageVariation = getLanguageVariationData(staticMetrics, {
    language: "all",
    llm: "all",
    prompt: "all",
    complexity: "all",
  });
  const staticPromptVariation = getPromptVariationData(staticMetrics, {
    language: "all",
    llm: "all",
    prompt: "all",
    complexity: "all",
  });

  // Variation data from static metrics (filtered)
  const complexityVariation = getComplexityVariationData(
    staticMetrics,
    filters
  );
  const languageVariation = getLanguageVariationData(staticMetrics, filters);
  const promptVariation = getPromptVariationData(staticMetrics, filters);
  const llmVariation = getLLMVariationData(staticMetrics, filters);

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
            <span className="text-gray-400">|</span>
            <a
              href="https://figshare.com/s/555ff627c7b8944f4552"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-all duration-200 border border-blue-200 hover:border-blue-300"
            >
              <span>📊</span>
              <span>Results</span>
            </a>
            <span className="text-gray-400">|</span>
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
            {staticPromptPerformance.length > 0 &&
              staticPromptVariation.length > 0 && (
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                  <p className="text-gray-700">
                    <strong>Most Effective Prompt Strategy:</strong>{" "}
                    {staticPromptPerformance[0].name} achieves{" "}
                    {staticPromptPerformance[0].testPassRate.toFixed(2)}% pass
                    rate while producing{" "}
                    {staticPromptVariation[0].deltaLOC > 0
                      ? "longer"
                      : "more concise"}{" "}
                    code ({staticPromptVariation[0].deltaLOC > 0 ? "+" : ""}
                    {staticPromptVariation[0].deltaLOC.toFixed(2)}Δ SLoC)
                  </p>
                </div>
              )}
            {staticComplexityPerformance.length > 0 &&
              staticComplexityVariation.length > 0 && (
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                  <p className="text-gray-700">
                    <strong>Complexity Impact:</strong> Performance drops from{" "}
                    {staticComplexityPerformance[0]?.testPassRate.toFixed(2)}%
                    (simple) to{" "}
                    {staticComplexityPerformance[2]?.testPassRate.toFixed(2)}%
                    (complex), with simple problems showing greater cyclomatic
                    complexity increase (
                    {staticComplexityVariation[0]?.deltaCClog.toFixed(2)}Δ vs{" "}
                    {staticComplexityVariation[2]?.deltaCClog.toFixed(2)}Δ)
                  </p>
                </div>
              )}
            {staticLanguageVariation.length > 0 && (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></span>
                <p className="text-gray-700">
                  <strong>Code Length Variation:</strong>{" "}
                  {staticLanguageVariation[0].name} translations show{" "}
                  {staticLanguageVariation[0].deltaLOC > 0
                    ? "an increase"
                    : "a decrease"}{" "}
                  ({staticLanguageVariation[0].deltaLOC > 0 ? "+" : ""}
                  {staticLanguageVariation[0].deltaLOC.toFixed(2)}Δ) in source
                  lines of code
                </p>
              </div>
            )}
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

        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Fail Compilation"
              value={`${metrics.compileFailRate}%`}
              percentage={metrics.compileFailRate}
              isFailureMetric={true}
              description="Percentage of translations that failed to compile"
            />
            <MetricCard
              title="Fail Running"
              value={`${metrics.runtimeFailRate}%`}
              percentage={metrics.runtimeFailRate}
              isFailureMetric={true}
              description="Percentage of translations that failed during runtime"
            />
            <MetricCard
              title="Fail Test"
              value={`${metrics.testFailRate}%`}
              percentage={metrics.testFailRate}
              isFailureMetric={true}
              description="Percentage of translations that failed at least one test case"
            />
            <MetricCard
              title="Test Pass Rate"
              value={`${metrics.testPassRate}%`}
              percentage={metrics.testPassRate}
              isFailureMetric={false}
              description="Percentage of translations that passed all test cases (100% pass required)"
            />
          </div>
        </div>

        {/* Performance Analysis Section */}
        <div className="mt-12 mb-10 glass rounded-2xl shadow-lg p-6 border border-white/20 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Performance Analysis
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Analysis of translation quality across compilation failures, runtime
            errors, test failures, and overall test pass rates.
          </p>
        </div>

        <div className="space-y-8">
          <LLMPerformanceChart data={llmPerformance} filters={filters} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComplexityChart data={complexityPerformance} />
            <LanguageChart data={languagePerformance} filters={filters} />
          </div>

          <PromptChart data={promptPerformance} filters={filters} />
          <HeatmapChart data={heatmapData} />
        </div>

        {/* Code Variation Analysis Section */}
        <div className="mt-12 mb-10 glass rounded-2xl shadow-lg p-6 border border-white/20 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Code Variation Analysis
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Analyze how translated code differs from source code in terms of
            cyclomatic complexity (ΔCC) and source lines of code (ΔSLoC).
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComplexityVariationChart
              data={complexityVariation}
              filters={filters}
            />
            <VariationByLanguageChart
              data={languageVariation}
              filters={filters}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VariationByPromptChart data={promptVariation} filters={filters} />
            <VariationByLLMChart data={llmVariation} filters={filters} />
          </div>
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
