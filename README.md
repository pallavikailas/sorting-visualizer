# 🔢 SortViz — Sorting Algorithm Visualizer

[![CI/CD Pipeline](https://github.com/pallavikailas/sorting-visualizer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/pallavikailas/sorting-visualizer/actions/workflows/ci-cd.yml)
[![Deploy to Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue?logo=github)](https://pallavikailas.github.io/sorting-visualizer)

An interactive, step-by-step sorting algorithm visualizer. Watch algorithms work in real time, compare time complexities, and explore Big-O growth curves — all in the browser with zero dependencies.

**🚀 [Live Demo →](https://pallavikailas.github.io/sorting-visualizer)**

---
<!-- LIGHTHOUSE_START -->
## 🏠 Lighthouse Scores
> Last updated: Fri, 20 Mar 2026 18:33:11 GMT

| Category | Score |
|---|---|
| Performance | 🟡 88 |
| Accessibility | 🟡 81 |
| Best Practices | 🟢 96 |
| SEO | 🟢 90 |
| **Average** | **🟡 89** |
<!-- LIGHTHOUSE_END -->

## ✨ Features

- **8 Sorting Algorithms** visualized step-by-step:
  - Bubble Sort · Selection Sort · Insertion Sort
  - Merge Sort · Quick Sort · Heap Sort
  - Shell Sort · Counting Sort
- **Real-time complexity stats** — comparisons, swaps, elapsed time
- **Big-O growth curve chart** — highlights relevant curves per algorithm
- **Algorithm comparison table** — side-by-side best/worst/average/space complexity
- **Pseudocode panel** — see the algorithm logic as it runs
- **Adjustable speed** — from slow motion to instant
- **Adjustable array size** — 10 to 100 elements
- **Keyboard shortcuts**: `Enter` to sort, `Escape` to stop, `R` to regenerate

---

## 🏗️ Project Structure

```
sorting-visualizer/
├── index.html                  # Main entry point
├── src/
│   ├── style.css               # All styles (CSS variables, dark theme)
│   ├── algorithms.js           # Algorithm generators (yield-based steps)
│   ├── visualizer.js           # Bar rendering & animation engine
│   ├── bigochart.js            # Canvas-based Big-O chart
│   └── app.js                  # Main controller / event wiring
├── tests/
│   └── algorithms.test.js      # Jest unit tests for all 8 algorithms
├── scripts/
│   └── build.js                # Production build (inlines assets)
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # Main CI/CD pipeline
├── lighthouserc.js             # Lighthouse CI thresholds
├── package.json          
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every push and pull request:

```
Push / PR
    │
    ├─► 🔍 Lint & Validate
    │       HTML (HTMLHint) · CSS (Stylelint) · JS (ESLint)
    │       File structure check
    │
    ├─► 🧪 Algorithm Tests (Jest)
    │       8 algorithms × 8 test cases = 64+ correctness checks
    │       Edge cases: empty, single, duplicate, already-sorted, reverse
    │       Coverage report uploaded as artifact
    │
    ├─► 🏠 Lighthouse Audit
    │       Performance ≥ 85 · Accessibility ≥ 90
    │       Best Practices ≥ 85 · SEO ≥ 80
    │
    ├─► 🔨 Build & Bundle
    │       Inlines CSS/JS into single HTML file
    │       Bundle size check (< 1MB)
    │       Uploads to GitHub Pages artifact store
    │
    └─► 🚀 Deploy (main branch only)
            GitHub Pages deployment
            🔥 Smoke test: verifies live URL returns 200
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/pallavikailas/sorting-visualizer.git
cd sorting-visualizer

# Install dev dependencies
npm install

# Start dev server with live reload
npm run dev
# → Opens http://localhost:3000
```

### Running Tests

```bash
# Run all algorithm tests
npm test

# With coverage report
npm test -- --coverage
```

### Build for Production

```bash
npm run build
# → Creates dist/index.html (fully self-contained)

# Preview the production build
npm run preview
```

### Linting

```bash
npm run lint          # Run all linters
npm run lint:html     # HTML only
npm run lint:css      # CSS only
npm run lint:js       # JavaScript only
```

---

## ⚙️ Setting Up GitHub Actions

### 1. Enable GitHub Pages

Go to your repo → **Settings** → **Pages** → Source: **GitHub Actions**

### 2. Required Secrets (optional)

| Secret | Purpose |
|--------|---------|
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI GitHub integration (optional) |

### 3. Branch Protection (recommended)

In **Settings → Branches**, protect `main` with:
- ✅ Require status checks: `lint`, `test`, `build`
- ✅ Require up-to-date branches
- ✅ Dismiss stale reviews on push

---

## 📊 Algorithm Complexity Reference

| Algorithm      | Best        | Average      | Worst        | Space    | Stable |
|----------------|-------------|--------------|--------------|----------|--------|
| Bubble Sort    | O(n)        | O(n²)        | O(n²)        | O(1)     | ✅ Yes |
| Selection Sort | O(n²)       | O(n²)        | O(n²)        | O(1)     | ❌ No  |
| Insertion Sort | O(n)        | O(n²)        | O(n²)        | O(1)     | ✅ Yes |
| Merge Sort     | O(n log n)  | O(n log n)   | O(n log n)   | O(n)     | ✅ Yes |
| Quick Sort     | O(n log n)  | O(n log n)   | O(n²)        | O(log n) | ❌ No  |
| Heap Sort      | O(n log n)  | O(n log n)   | O(n log n)   | O(1)     | ❌ No  |
| Shell Sort     | O(n log n)  | O(n log² n)  | O(n log² n)  | O(1)     | ❌ No  |
| Counting Sort  | O(n+k)      | O(n+k)       | O(n+k)       | O(k)     | ✅ Yes |

---

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🔵 Dark blue | Unsorted element |
| 🟠 Orange | Being compared |
| 🟢 Green | Being swapped |
| 🔷 Cyan | Sorted (in final position) |
| 🟣 Purple | Pivot (Quick Sort) |
| 🟡 Yellow | Current element |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Start sorting |
| `Escape` | Stop sorting |
| `R` | Generate new random array |

---

## 🛠️ How the Visualizer Works

Each sorting algorithm is implemented as a JavaScript **generator function** (`function*`). Instead of sorting all at once, each step `yield`s a description object:

```javascript
{ type: 'compare', indices: [3, 4], msg: 'Comparing arr[3] and arr[4]' }
{ type: 'swap',    indices: [3, 4], arr: [...], msg: 'Swapped!' }
{ type: 'sorted',  index: 4,        arr: [...] }
{ type: 'done',    arr: [...] }
```

The visualizer consumes these steps in an async loop with a configurable delay, updating bar heights and colours on each frame.

---
