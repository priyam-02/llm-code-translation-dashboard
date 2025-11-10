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

### Step 3: Start the Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

Once you see "Ready in XXXXms", open your web browser and navigate to:

```
http://localhost:3000
```

The dashboard should now be visible! 🎉

## 🎯 Features

- **4 Interactive Filters**: Language, LLM Model, Prompt Type, and Problem Complexity (sticky on scroll)
- **Real-time Updates**: All visualizations update instantly when filters change
- **5 Key Metrics Cards**: Total translations, unique problems, compilation rate, runtime success, and test pass rate
- **6 Visualizations**:
  1. LLM Performance Comparison (bar chart)
  2. Performance by Complexity Level (line chart)
  3. Performance by Target Language (bar chart)
  4. Prompt Strategy Effectiveness (pie chart)
  5. LLM × Language Performance Heatmap
  6. Key Insights Summary
- **Color-coded Results**: Green (≥60%), Yellow (30-60%), Red (<30%)
- **Modern Glass Morphism UI**: Elegant, conference-ready design with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile

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
│   ├── globals.css              # Global styles with animations
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── FilterPanel.tsx          # Filter controls (sticky)
│   ├── MetricCard.tsx           # Metric display cards
│   ├── LLMPerformanceChart.tsx  # LLM comparison bar chart
│   ├── ComplexityChart.tsx      # Complexity line chart
│   ├── LanguageChart.tsx        # Language bar chart
│   ├── PromptChart.tsx          # Prompt strategy pie chart
│   └── HeatmapChart.tsx         # Heatmap visualization
├── lib/
│   └── utils.ts                 # Data processing utilities
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/
│   └── benchmark_data.json      # Benchmark data (56K+ translations)
├── CLAUDE.md                    # Claude Code guidance
├── DASHBOARD_OVERVIEW.md        # High-level dashboard documentation
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

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first CSS with custom animations
- **Recharts 3** - Responsive chart library
- **Glass Morphism Design** - Modern UI with backdrop blur effects

## 💡 Tips for Conference Presentation

1. **Full Screen**: Press F11 in your browser for full-screen mode
2. **Pre-select Filters**: Before presenting, pre-filter to highlight specific findings
3. **Zoom**: Use Ctrl/Cmd + Plus/Minus to adjust zoom level for better visibility
4. **Multiple Views**: Open multiple browser tabs with different filter combinations
5. **Sticky Filters**: Filters remain accessible while scrolling through visualizations
6. **Interactive Demo**: Use the live filtering during Q&A to answer audience questions in real-time

## 📧 Support

If you encounter any issues, check the terminal output for error messages and refer to the troubleshooting section above.
