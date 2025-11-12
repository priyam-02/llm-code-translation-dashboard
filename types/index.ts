export interface BenchmarkResult {
  translation_id: number;
  campaign: string;
  llm: string;
  prompt: string;
  problem: string;
  complexity: string;
  source_language: string;
  solution: string;
  target_language: string;
  translated_solution: string;
  compiles: boolean;
  runtime_error: boolean;
  passes_tests: boolean;
  number_tests_passed: number;
  total_tests: number;
  cc_solution: number | null;
  cc_translated: number | null;
  sloc_solution: number | null;
  sloc_translated: number | null;
  cc_var: number | null;
  log_cc: number | null;
  sloc_var: number | null;
  log_sloc: number | null;
}

export interface Filters {
  language: string;
  llm: string;
  prompt: string;
  complexity: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  description: string;
  trend?: number;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface StaticMetric {
  LLM: string;
  Prompt: string;
  Language: string;
  Complexity: string;
  Total: number;
  "No Compile": number;
  Compile: number;
  "No Run": number;
  Run: number;
  "No Pass": number;
  Pass: number;
  Max_CC_Var: number;
  Min_CC_Var: number;
  Avg_CC_Var: number;
  Max_SLLoC_Var: number;
  Min_SLoC_Var: number;
  Avg_SLoC_Var: number;
  _: null;
  language: string;
  "LLM.1": string;
  "Prompt.1": string;
  "Complexity.1": string;
  DeltaCClog: number;
  MinDeltaCC: number;
  MaxDeltaCC: number;
  DeltaLOC: number;
  MinDeltaLOC: number;
  MaxDeltaLOC: number;
}

export interface VariationData {
  name: string;
  deltaCClog: number;
  minDeltaCC: number;
  maxDeltaCC: number;
  deltaLOC: number;
  minDeltaLOC: number;
  maxDeltaLOC: number;
}
