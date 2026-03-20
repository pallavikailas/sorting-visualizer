// ============================================
// SORTVIZ — Main App Controller
// Wires UI, visualizer, and algorithms together
// ============================================

(function () {
  const viz = new Visualizer();
  let currentAlgo = 'bubble';
  let currentArray = [];
  let arraySize = 40;
  let speed = 3;

  // ─── DOM refs ────────────────────────────────
  const algoTabs = document.getElementById('algoTabs');
  const generateBtn = document.getElementById('generateBtn');
  const sortBtn = document.getElementById('sortBtn');
  const stopBtn = document.getElementById('stopBtn');
  const sizeSlider = document.getElementById('sizeSlider');
  const speedSlider = document.getElementById('speedSlider');
  const sizeLabel = document.getElementById('sizeLabel');
  const speedLabel = document.getElementById('speedLabel');
  const algoName = document.getElementById('algoName');
  const algoDesc = document.getElementById('algoDesc');
  const bestCase = document.getElementById('bestCase');
  const worstCase = document.getElementById('worstCase');
  const avgCase = document.getElementById('avgCase');
  const spaceCase = document.getElementById('spaceCase');
  const pseudocode = document.getElementById('pseudocode');
  const algoTags = document.getElementById('algoTags');
  const comparisonTable = document.getElementById('comparisonTable');

  const speedLabels = { 1: 'Slow', 2: 'Steady', 3: 'Medium', 4: 'Fast', 5: 'Instant' };

  // ─── Init ─────────────────────────────────────
  function init() {
    loadAlgorithm(currentAlgo);
    generateArray();
    buildComparisonTable();
    addLegend();
    window.addEventListener('resize', () => renderBigOChart(currentAlgo));
  }

  // ─── Algorithm switching ──────────────────────
  function loadAlgorithm(key) {
    currentAlgo = key;
    const algo = ALGORITHMS[key];
    if (!algo) return;

    algoName.textContent = algo.name;
    algoDesc.textContent = algo.desc;
    bestCase.textContent = algo.best;
    worstCase.textContent = algo.worst;
    avgCase.textContent = algo.avg;
    spaceCase.textContent = algo.space;
    pseudocode.textContent = algo.pseudocode;

    algoTags.innerHTML = algo.tags.map(t => `<span class="tag">${t}</span>`).join('');

    // Update tab active state
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.algo === key);
    });

    // Update comparison table highlight
    document.querySelectorAll('#comparisonTable tr').forEach(row => {
      row.classList.toggle('active-algo', row.dataset.algo === key);
    });

    renderBigOChart(key);
  }

  // ─── Array generation ────────────────────────
  function generateArray() {
    currentArray = viz.generateArray(arraySize);
  }

  // ─── Sort execution ──────────────────────────
  async function startSort() {
    if (viz.isRunning) return;
    const algo = ALGORITHMS[currentAlgo];
    if (!algo) return;

    // Reset to fresh copy
    const arrCopy = [...currentArray];
    viz.renderBars(arrCopy);
    viz.resetStats();
    viz.sortedIndices.clear();

    setUIState('running');

    const generator = algo.sort(arrCopy);
    const completed = await viz.runSort(generator, speed);

    setUIState('idle');
    if (completed) {
      currentArray = arrCopy; // keep sorted array
    }
  }

  function stopSort() {
    viz.stop();
    setUIState('idle');
  }

  function setUIState(state) {
    const running = state === 'running';
    sortBtn.disabled = running;
    stopBtn.disabled = !running;
    generateBtn.disabled = running;
    sizeSlider.disabled = running;
    document.querySelectorAll('.tab').forEach(t => t.disabled = running);
  }

  // ─── Comparison table ────────────────────────
  const complexityClass = {
    'O(1)': 'badge-green',
    'O(log n)': 'badge-green',
    'O(n)': 'badge-green',
    'O(n log n)': 'badge-yellow',
    'O(n log² n)': 'badge-yellow',
    'O(n+k)': 'badge-green',
    'O(k)': 'badge-yellow',
    'O(n²)': 'badge-red',
    'O(log n)': 'badge-green',
  };

  function badge(text) {
    const cls = complexityClass[text] || 'badge-yellow';
    return `<span class="complexity-badge ${cls}">${text}</span>`;
  }

  function ratingPips(n) {
    const pips = Array.from({ length: 5 }, (_, i) =>
      `<div class="pip${i < n ? ' filled' : ''}"></div>`
    ).join('');
    return `<div class="rating-bar"><div class="rating-pips">${pips}</div></div>`;
  }

  function buildComparisonTable() {
    comparisonTable.innerHTML = '';
    Object.entries(ALGORITHMS).forEach(([key, algo]) => {
      const tr = document.createElement('tr');
      tr.dataset.algo = key;
      if (key === currentAlgo) tr.classList.add('active-algo');
      tr.innerHTML = `
        <td><strong>${algo.name}</strong></td>
        <td>${badge(algo.best)}</td>
        <td>${badge(algo.avg)}</td>
        <td>${badge(algo.worst)}</td>
        <td>${badge(algo.space)}</td>
        <td class="${algo.stable ? 'stable-yes' : 'stable-no'}">${algo.stable ? '✓ Yes' : '✗ No'}</td>
        <td>${ratingPips(algo.rating)}</td>
      `;
      tr.addEventListener('click', () => {
        if (!viz.isRunning) {
          loadAlgorithm(key);
          generateArray();
        }
      });
      tr.style.cursor = 'pointer';
      comparisonTable.appendChild(tr);
    });
  }

  // ─── Legend ──────────────────────────────────
  function addLegend() {
    const legend = document.createElement('div');
    legend.className = 'legend';
    const items = [
      { color: 'var(--bar-default)', label: 'Unsorted' },
      { color: 'var(--bar-compare)', label: 'Comparing' },
      { color: 'var(--bar-swap)', label: 'Swapping' },
      { color: 'var(--bar-sorted)', label: 'Sorted' },
      { color: 'var(--bar-pivot)', label: 'Pivot' },
      { color: 'var(--yellow)', label: 'Current' },
    ];
    legend.innerHTML = items.map(i =>
      `<div class="legend-item">
        <div class="legend-dot" style="background:${i.color}"></div>
        ${i.label}
      </div>`
    ).join('');
    document.querySelector('.visualizer').appendChild(legend);
  }

  // ─── Event listeners ─────────────────────────
  algoTabs.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (tab && !viz.isRunning) {
      loadAlgorithm(tab.dataset.algo);
      generateArray();
    }
  });

  generateBtn.addEventListener('click', () => {
    if (!viz.isRunning) generateArray();
  });

  sortBtn.addEventListener('click', startSort);
  stopBtn.addEventListener('click', stopSort);

  sizeSlider.addEventListener('input', () => {
    arraySize = parseInt(sizeSlider.value);
    sizeLabel.textContent = arraySize;
    generateArray();
  });

  speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value);
    speedLabel.textContent = speedLabels[speed];
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !viz.isRunning) startSort();
    if (e.key === 'Escape' && viz.isRunning) stopSort();
    if (e.key === 'r' || e.key === 'R') if (!viz.isRunning) generateArray();
  });

  init();
})();
