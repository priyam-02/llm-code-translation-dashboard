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
  MetricCardSkeleton,
  ChartSkeleton,
  FilterPanelSkeleton,
} from "@/components/Skeleton";
import {
  filterData,
  calculateMetrics,
  calculateVariationMetrics,
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

  // Progressive loading states
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    language: "all",
    llm: "all",
    prompt: "all",
    complexity: "all",
    sourceLanguage: "all",
    version: "all",
  });

  const [languages, setLanguages] = useState<string[]>([]);
  const [llms, setLlms] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [complexities, setComplexities] = useState<string[]>([]);
  const [sourceLanguages, setSourceLanguages] = useState<string[]>([]);
  const [versions, setVersions] = useState<number[]>([]);

  useEffect(() => {
    // Load static metrics first (smaller payload - 324KB)
    fetch("/api/static-metrics")
      .then((res) => res.json())
      .then((metricsResponse) => {
        const metricsData: StaticMetric[] = metricsResponse.data;
        console.log("Static metrics source:", metricsResponse.source);

        if (metricsResponse.source === "fallback-json") {
          console.warn(
            "⚠️ Using fallback metrics data:",
            metricsResponse.warning
          );
        }

        setStaticMetrics(metricsData);
        setIsLoadingMetrics(false);
      })
      .catch((error) => {
        console.error("Error loading metrics:", error);
        setIsLoadingMetrics(false);
      });

    // Load benchmark data (larger payload - 29MB)
    fetch("/api/benchmark-data")
      .then((res) => res.json())
      .then((benchmarkResponse) => {
        const benchmarkData: BenchmarkResult[] = benchmarkResponse.data;
        console.log("Benchmark data source:", benchmarkResponse.source);

        if (benchmarkResponse.source === "fallback-json") {
          console.warn(
            "⚠️ Using fallback benchmark data:",
            benchmarkResponse.warning
          );
        }

        setData(benchmarkData);
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
        setSourceLanguages(
          Array.from(
            new Set(benchmarkData.map((d) => d.source_language))
          ).sort()
        );
        setVersions(
          Array.from(new Set(benchmarkData.map((d) => d.version || 1))).sort(
            (a, b) => a - b
          )
        );
        setIsLoadingData(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setIsLoadingData(false);
      });
  }, []);

  // Computed data - only calculate when data is available
  const staticLLMPerformance = data.length > 0 ? getLLMPerformance(data) : [];
  const staticComplexityPerformance =
    data.length > 0 ? getComplexityPerformance(data) : [];
  const staticLanguagePerformance =
    data.length > 0 ? getLanguagePerformance(data) : [];
  const staticPromptPerformance =
    data.length > 0 ? getPromptPerformance(data) : [];

  // Filtered data for charts and metrics
  const filteredData = data.length > 0 ? filterData(data, filters) : [];
  const metrics =
    data.length > 0
      ? calculateMetrics(filteredData)
      : {
          totalTranslations: 0,
          uniqueProblems: 0,
          compileFailRate: 0,
          runtimeFailRate: 0,
          testFailRate: 0,
          testPassRate: 0,
        };
  const variationMetrics =
    staticMetrics.length > 0
      ? calculateVariationMetrics(staticMetrics, filters)
      : {
          avgDeltaCClog: 0,
          avgDeltaLOC: 0,
          minDeltaCC: 0,
          maxDeltaCC: 0,
          minDeltaLOC: 0,
          maxDeltaLOC: 0,
        };
  const llmPerformance = data.length > 0 ? getLLMPerformance(filteredData) : [];
  const complexityPerformance =
    data.length > 0 ? getComplexityPerformance(filteredData) : [];
  const languagePerformance =
    data.length > 0 ? getLanguagePerformance(filteredData) : [];
  const promptPerformance =
    data.length > 0 ? getPromptPerformance(filteredData) : [];
  const heatmapData = data.length > 0 ? getHeatmapData(filteredData) : [];

  // Variation data from static metrics (static - for key insights)
  const staticComplexityVariation =
    staticMetrics.length > 0
      ? getComplexityVariationData(staticMetrics, {
          language: "all",
          llm: "all",
          prompt: "all",
          complexity: "all",
          sourceLanguage: "all",
          version: "all",
        })
      : [];
  const staticLanguageVariation =
    staticMetrics.length > 0
      ? getLanguageVariationData(staticMetrics, {
          language: "all",
          llm: "all",
          prompt: "all",
          complexity: "all",
          sourceLanguage: "all",
          version: "all",
        })
      : [];
  const staticPromptVariation =
    staticMetrics.length > 0
      ? getPromptVariationData(staticMetrics, {
          language: "all",
          llm: "all",
          prompt: "all",
          complexity: "all",
          sourceLanguage: "all",
          version: "all",
        })
      : [];

  // Variation data from static metrics (filtered)
  const complexityVariation =
    staticMetrics.length > 0
      ? getComplexityVariationData(staticMetrics, filters)
      : [];
  const languageVariation =
    staticMetrics.length > 0
      ? getLanguageVariationData(staticMetrics, filters)
      : [];
  const promptVariation =
    staticMetrics.length > 0
      ? getPromptVariationData(staticMetrics, filters)
      : [];
  const llmVariation =
    staticMetrics.length > 0 ? getLLMVariationData(staticMetrics, filters) : [];

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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-700 rounded-lg font-medium transition-all duration-200 border border-primary-200 hover:border-primary-300"
            >
              <span>📄</span>
              <span>Abstract</span>
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://figshare.com/s/555ff627c7b8944f4552"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-700 rounded-lg font-medium transition-all duration-200 border border-primary-200 hover:border-primary-300"
            >
              <span>📊</span>
              <span>Raw Data</span>
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">Authors:</span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              <a
                href="https://mpvieira.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:text-primary-700 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Marco Vieira
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/priyam-shah-software-developer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:text-primary-700 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Priyam Shah
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/bhavainshah/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:text-primary-700 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Bhavain Shah
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.linkedin.com/in/rrezartakrasniqi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:text-primary-700 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Rrezarta Krasniqi
              </a>
            </div>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed pb-2">
              This dashboard presents an interactive exploration of{" "}
              <strong className="text-gray-900">Polyglot</strong>, a
              multi-language framework for evaluating LLM performance in code
              translation. Leveraging the IBM CodeNet Project dataset, we assess
              translation quality through syntactic correctness, execution
              reliability, and semantic preservation. Use the filters below to
              explore how different models, prompting strategies, and problem
              complexities impact translation success across multiple target
              languages.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200/60">
              <p className="text-sm text-gray-600 italic flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
                This is a living dataset — new results and analyses will be
                added soon. Check back regularly for updates!
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 mb-10">
          {isLoadingData ? (
            <FilterPanelSkeleton />
          ) : (
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              languages={languages}
              llms={llms}
              prompts={prompts}
              complexities={complexities}
              sourceLanguages={sourceLanguages}
              versions={versions}
            />
          )}
        </div>

        <div className="mb-8 space-y-4">
          {isLoadingData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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

        {isLoadingData ? (
          <div className="space-y-8">
            <ChartSkeleton height="400px" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartSkeleton height="400px" />
              <ChartSkeleton height="400px" />
            </div>
            <ChartSkeleton height="400px" />
            <ChartSkeleton height="500px" />
          </div>
        ) : (
          <div className="space-y-8">
            <LLMPerformanceChart data={llmPerformance} filters={filters} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComplexityChart data={complexityPerformance} />
              <LanguageChart data={languagePerformance} filters={filters} />
            </div>

            <PromptChart data={promptPerformance} filters={filters} />
            <HeatmapChart data={heatmapData} />
          </div>
        )}

        {/* Code Variation Analysis Section */}
        <div className="mt-12 mb-10 glass rounded-2xl shadow-lg p-6 border border-white/20 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Code Variation Analysis
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Analyze how translated code differs from source code in terms of
            cyclomatic complexity (ΔCC) and source lines of code (ΔSLoC).
          </p>
          <div className="pt-4 border-t border-gray-200/60">
            <p className="text-sm text-gray-600 italic flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
              Metrics and charts in this section use pre-aggregated data across all versions. Version filter applies only to Performance Analysis above (this will be improved in the future).
            </p>
          </div>
        </div>

        {isLoadingMetrics ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartSkeleton height="500px" />
              <ChartSkeleton height="500px" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartSkeleton height="500px" />
              <ChartSkeleton height="500px" />
            </div>
          </div>
        ) : (
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
              <VariationByPromptChart
                data={promptVariation}
                filters={filters}
              />
              <VariationByLLMChart data={llmVariation} filters={filters} />
            </div>
          </div>
        )}
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
