import { BenchmarkResult, Filters } from "@/types";

export function filterData(
  data: BenchmarkResult[],
  filters: Filters
): BenchmarkResult[] {
  return data.filter((item) => {
    if (filters.language !== "all" && item.target_language !== filters.language)
      return false;
    if (filters.llm !== "all" && item.llm !== filters.llm) return false;
    if (filters.prompt !== "all" && item.prompt !== filters.prompt)
      return false;
    if (filters.complexity !== "all" && item.complexity !== filters.complexity)
      return false;
    return true;
  });
}

export function calculateMetrics(data: BenchmarkResult[]) {
  if (data.length === 0) {
    return {
      totalTranslations: 0,
      uniqueProblems: 0,
      compileRate: 0,
      runtimeSuccessRate: 0,
      testPassRate: 0,
    };
  }

  const compileRate =
    (data.filter((d) => d.compiles).length / data.length) * 100;
  const runtimeSuccessRate =
    (data.filter((d) => !d.runtime_error).length / data.length) * 100;
  const testPassRate =
    (data.filter((d) => d.passes_tests).length / data.length) * 100;
  const uniqueProblems = Array.from(new Set(data.map((d) => d.problem))).length;

  return {
    totalTranslations: data.length,
    uniqueProblems,
    compileRate: Math.round(compileRate * 100) / 100,
    runtimeSuccessRate: Math.round(runtimeSuccessRate * 100) / 100,
    testPassRate: Math.round(testPassRate * 100) / 100,
  };
}

export function getLLMPerformance(data: BenchmarkResult[]) {
  const llmGroups: { [key: string]: BenchmarkResult[] } = {};

  data.forEach((item) => {
    if (!llmGroups[item.llm]) {
      llmGroups[item.llm] = [];
    }
    llmGroups[item.llm].push(item);
  });

  return Object.entries(llmGroups)
    .map(([name, items]) => {
      const metrics = calculateMetrics(items);
      return {
        name: formatLLMName(name),
        compileRate: metrics.compileRate,
        runtimeSuccessRate: metrics.runtimeSuccessRate,
        testPassRate: metrics.testPassRate,
        count: items.length,
      };
    })
    .sort((a, b) => b.testPassRate - a.testPassRate);
}

export function getComplexityPerformance(data: BenchmarkResult[]) {
  const complexityOrder = ["simple", "moderate", "complex"];
  const complexityGroups: { [key: string]: BenchmarkResult[] } = {};

  data.forEach((item) => {
    if (!complexityGroups[item.complexity]) {
      complexityGroups[item.complexity] = [];
    }
    complexityGroups[item.complexity].push(item);
  });

  return complexityOrder.map((complexity) => {
    const items = complexityGroups[complexity] || [];
    const metrics = calculateMetrics(items);
    return {
      name: complexity.charAt(0).toUpperCase() + complexity.slice(1),
      compileRate: metrics.compileRate,
      runtimeSuccessRate: metrics.runtimeSuccessRate,
      testPassRate: metrics.testPassRate,
      count: items.length,
    };
  });
}

export function getLanguagePerformance(data: BenchmarkResult[]) {
  const languageGroups: { [key: string]: BenchmarkResult[] } = {};

  data.forEach((item) => {
    if (!languageGroups[item.target_language]) {
      languageGroups[item.target_language] = [];
    }
    languageGroups[item.target_language].push(item);
  });

  return Object.entries(languageGroups)
    .map(([name, items]) => {
      const metrics = calculateMetrics(items);
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        compileRate: metrics.compileRate,
        runtimeSuccessRate: metrics.runtimeSuccessRate,
        testPassRate: metrics.testPassRate,
        count: items.length,
      };
    })
    .sort((a, b) => b.testPassRate - a.testPassRate);
}

export function getPromptPerformance(data: BenchmarkResult[]) {
  const promptGroups: { [key: string]: BenchmarkResult[] } = {};

  data.forEach((item) => {
    if (!promptGroups[item.prompt]) {
      promptGroups[item.prompt] = [];
    }
    promptGroups[item.prompt].push(item);
  });

  return Object.entries(promptGroups)
    .map(([name, items]) => {
      const metrics = calculateMetrics(items);
      return {
        name: formatPromptName(name),
        compileRate: metrics.compileRate,
        runtimeSuccessRate: metrics.runtimeSuccessRate,
        testPassRate: metrics.testPassRate,
        count: items.length,
      };
    })
    .sort((a, b) => b.testPassRate - a.testPassRate);
}

export function getHeatmapData(data: BenchmarkResult[]) {
  const llms = Array.from(new Set(data.map((d) => d.llm))).sort();
  const languages = Array.from(new Set(data.map((d) => d.target_language))).sort();

  const heatmapData: any[] = [];

  llms.forEach((llm) => {
    languages.forEach((language) => {
      const filtered = data.filter(
        (d) => d.llm === llm && d.target_language === language
      );
      const metrics = calculateMetrics(filtered);

      heatmapData.push({
        llm: formatLLMName(llm),
        language: language.charAt(0).toUpperCase() + language.slice(1),
        value: metrics.testPassRate,
        count: filtered.length,
      });
    });
  });

  return heatmapData;
}

export function formatLLMName(name: string): string {
  const nameMap: { [key: string]: string } = {
    "qwen2.5-coder_32b": "Qwen2.5-Coder 32B",
    "qwen2.5_32b": "Qwen2.5 32B",
    "qwen2.5-coder": "Qwen2.5-Coder 7B",
    "deepseek-coder-v2": "DeepSeek-Coder-V2 16B",
    "deepseek-coder_33b": "DeepSeek-Coder 33B",
    "llama3.1_70b": "Llama3.1 70B",
    "llama3.1": "Llama3.1 8B",
  };

  return nameMap[name] || name;
}

export function formatPromptName(name: string): string {
  const nameMap: { [key: string]: string } = {
    "standard zero-shot": "Standard Zero-Shot",
    "curated zero-shot": "Curated Zero-Shot",
    "chain-of-thought": "Chain-of-Thought",
  };

  return nameMap[name] || name;
}

export function getSuccessColor(value: number): string {
  if (value >= 60) return "text-green-600";
  if (value >= 30) return "text-yellow-600";
  return "text-red-600";
}

export function getSuccessBgColor(value: number): string {
  if (value >= 60) return "bg-green-100";
  if (value >= 30) return "bg-yellow-100";
  return "bg-red-100";
}
