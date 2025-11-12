# Polyglot Benchmark Dashboard

An interactive web dashboard for visualizing code translation benchmark results from C to Python, Java, and Rust across multiple LLM models.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To check if you have them installed:

```bash
node --version
npm --version
```

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd polyglot-dashboard
```

Or download as ZIP and extract:

```bash
# After downloading ZIP
unzip polyglot-dashboard.zip
cd polyglot-dashboard
```

### Step 2: Install Dependencies

Install all required packages (this will take 1-2 minutes):

```bash
npm install
```

### Step 3: Configure Google Sheets (Optional)

The dashboard can fetch live data from Google Sheets or use static JSON files as fallback.

**Option A: Use Static Data (No Setup Required)**
- Skip this step - dashboard works immediately with included JSON files

**Option B: Enable Live Google Sheets Integration**
1. Copy `.env.example` to `.env.local`
2. Add your Google API key and Sheet ID
3. See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for detailed instructions

The dashboard automatically falls back to static JSON if Google Sheets is unavailable.

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

Once you see "Ready in XXXXms", open your web browser and navigate to:

```
http://localhost:3000
```

The dashboard should now be visible! 🎉

## 🎯 Features

- **Live Data Integration**: Fetches data from Google Sheets with automatic fallback to static JSON
- **4 Interactive Filters**: Language, LLM Model, Prompt Type, and Problem Complexity (sticky on scroll)
- **Real-time Updates**: All visualizations update instantly when filters change
- **8 Metric Cards**: Total translations, unique problems, compilation failures, runtime errors, test failures, and pass rates
- **10 Visualizations**:
  - **Performance Analysis**: LLM performance, complexity impact, language comparison, prompt effectiveness, heatmap
  - **Code Variation Analysis**: Complexity variation, language variation, prompt variation, LLM variation
- **5 Key Insights**: Automatically calculated from full dataset
- **Color-coded Results**: Green (≥60%), Yellow (30-60%), Red (<30%)
- **Modern Glass Morphism UI**: Elegant, conference-ready design with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Automatic Fallback**: Seamlessly switches to static data if API fails

## 📊 Data

The dashboard analyzes **56,637 code translations** from the benchmark results:

- **7 LLM Models**: deepseek-coder-v2, deepseek-coder_33b, llama3.1, llama3.1_70b, qwen2.5-coder, qwen2.5-coder_32b, qwen2.5_32b
- **3 Target Languages**: Python, Java, Rust
- **3 Prompt Types**: chain-of-thought, curated zero-shot, standard zero-shot
- **3 Complexity Levels**: simple, moderate, complex
- **150 Unique Problems**

## 🛠️ Troubleshooting

### Port 3000 is already in use

If you see an error about port 3000 being in use:

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or run on a different port:

```bash
npm run dev -- -p 3001
```

Then open `http://localhost:3001`

### Module not found errors

Make sure you ran `npm install` first. If issues persist:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Browser shows blank page

1. Check the terminal for any error messages
2. Open browser console (F12) and check for errors
3. Try hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

## 📁 Project Structure

```
polyglot-dashboard/
├── app/
│   ├── api/
│   │   ├── benchmark-data/
│   │   │   └── route.ts         # API endpoint for benchmark data
│   │   └── static-metrics/
│   │       └── route.ts         # API endpoint for static metrics
│   ├── globals.css              # Global styles with animations
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── FilterPanel.tsx          # Filter controls (sticky)
│   ├── MetricCard.tsx           # Metric display cards
│   ├── LLMPerformanceChart.tsx  # LLM comparison chart
│   ├── ComplexityChart.tsx      # Complexity performance chart
│   ├── LanguageChart.tsx        # Language performance chart
│   ├── PromptChart.tsx          # Prompt strategy chart
│   ├── HeatmapChart.tsx         # Heatmap visualization
│   ├── ComplexityVariationChart.tsx    # Code variation by complexity
│   ├── VariationByLanguageChart.tsx    # Code variation by language
│   ├── VariationByPromptChart.tsx      # Code variation by prompt
│   └── VariationByLLMChart.tsx         # Code variation by LLM
├── lib/
│   ├── utils.ts                 # Data processing utilities
│   └── google-sheets.ts         # Google Sheets API integration
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/
│   ├── benchmark_data.json      # Fallback: Benchmark data (56K+ translations)
│   └── static_metrics.json      # Fallback: Static metrics data
├── .env.local                   # Environment variables (not committed)
├── .env.example                 # Environment variables template
├── CLAUDE.md                    # Claude Code guidance
├── GOOGLE_SHEETS_SETUP.md       # Google Sheets integration guide
├── package.json
└── README.md
```

## 🎨 Customization

### Changing the Background Gradient

Edit `app/globals.css`:

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Modifying Chart Colors

Edit individual chart components in the `components/` directory. For example, in `LLMPerformanceChart.tsx`:

```tsx
<Bar dataKey="compileRate" fill="#3b82f6" name="Compile Rate (%)" />
<Bar dataKey="runtimeSuccessRate" fill="#8b5cf6" name="Runtime Success (%)" />
<Bar dataKey="testPassRate" fill="#10b981" name="Test Pass Rate (%)" />
```

### Adding More Filters

Edit `app/page.tsx` and `components/FilterPanel.tsx` to add additional filter dimensions.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

The production build will be faster and more optimized.

## 📦 Technologies Used

- **Next.js 16** - React framework with App Router and API routes
- **React 19** - Latest React features
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first CSS with custom animations
- **Recharts 3** - Responsive chart library
- **Google Sheets API** - Live data integration with googleapis
- **Glass Morphism Design** - Modern UI with backdrop blur effects

## 🔄 Data Management

The dashboard supports two data sources:

1. **Google Sheets (Live Data)** - Automatically fetches latest data from your Google Sheet
2. **Static JSON Files (Fallback)** - Local JSON files used when API is unavailable

**Automatic Fallback:** If Google Sheets API fails (no API key, rate limit, network error), the dashboard seamlessly switches to static JSON files. Users always see data, never errors.

**Setup:** See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for complete Google Sheets integration guide.

## 💡 Tips for Conference Presentation

1. **Full Screen**: Press F11 in your browser for full-screen mode
2. **Pre-select Filters**: Before presenting, pre-filter to highlight specific findings
3. **Zoom**: Use Ctrl/Cmd + Plus/Minus to adjust zoom level for better visibility
4. **Multiple Views**: Open multiple browser tabs with different filter combinations
5. **Sticky Filters**: Filters remain accessible while scrolling through visualizations
6. **Interactive Demo**: Use the live filtering during Q&A to answer audience questions in real-time

## 📧 Support

If you encounter any issues, check the terminal output for error messages and refer to the troubleshooting section above.
