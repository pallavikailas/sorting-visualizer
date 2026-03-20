// ============================================
// SORTVIZ — Visualizer Engine
// Manages bar rendering and animation loop
// ============================================

class Visualizer {
  constructor() {
    this.container = document.getElementById('barContainer');
    this.stepInfo = document.getElementById('stepInfo');
    this.bars = [];
    this.sortedIndices = new Set();
    this.isRunning = false;
    this.stopFlag = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.startTime = null;
  }

  generateArray(size) {
    this.sortedIndices.clear();
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 95) + 5);
    }
    this.renderBars(arr);
    this.resetStats();
    this.setStepInfo('Press Sort to begin');
    return arr;
  }

  renderBars(arr) {
    this.container.innerHTML = '';
    this.bars = [];
    const max = Math.max(...arr);
    arr.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${(val / max) * 100}%`;
      if (this.sortedIndices.has(i)) bar.classList.add('sorted');
      this.container.appendChild(bar);
      this.bars.push(bar);
    });
  }

  updateBars(arr) {
    const max = Math.max(...arr);
    arr.forEach((val, i) => {
      if (this.bars[i]) {
        this.bars[i].style.height = `${(val / max) * 100}%`;
      }
    });
  }

  clearHighlights() {
    this.bars.forEach((bar, i) => {
      bar.className = 'bar';
      if (this.sortedIndices.has(i)) bar.classList.add('sorted');
    });
  }

  highlightCompare(indices) {
    indices.forEach(i => {
      if (this.bars[i]) this.bars[i].classList.add('comparing');
    });
    this.comparisons++;
    this.updateStats();
  }

  highlightSwap(indices) {
    indices.forEach(i => {
      if (this.bars[i]) this.bars[i].classList.add('swapping');
    });
    this.swaps++;
    this.updateStats();
  }

  highlightSorted(index) {
    this.sortedIndices.add(index);
    if (this.bars[index]) {
      this.bars[index].className = 'bar sorted';
    }
  }

  highlightPivot(index) {
    if (this.bars[index]) this.bars[index].classList.add('pivot');
  }

  highlightCurrent(index) {
    if (this.bars[index]) this.bars[index].classList.add('current');
  }

  setStepInfo(msg) {
    this.stepInfo.textContent = msg;
  }

  resetStats() {
    this.comparisons = 0;
    this.swaps = 0;
    this.startTime = null;
    this.updateStats();
    document.getElementById('elapsed').textContent = '0ms';
  }

  updateStats() {
    document.getElementById('comparisons').textContent = this.comparisons.toLocaleString();
    document.getElementById('swaps').textContent = this.swaps.toLocaleString();
    if (this.startTime) {
      document.getElementById('elapsed').textContent = `${Date.now() - this.startTime}ms`;
    }
  }

  getDelay(speed) {
    const delays = { 1: 300, 2: 100, 3: 40, 4: 10, 5: 1 };
    return delays[speed] || 40;
  }

  async runSort(generator, speed) {
    this.isRunning = true;
    this.stopFlag = false;
    this.startTime = Date.now();
    this.sortedIndices.clear();
    const delay = this.getDelay(speed);

    for (const step of generator) {
      if (this.stopFlag) break;

      this.clearHighlights();

      if (step.arr) this.updateBars(step.arr);
      if (step.msg) this.setStepInfo(step.msg);

      switch (step.type) {
        case 'compare':
          this.highlightCompare(step.indices || [step.index]);
          break;
        case 'swap':
          this.highlightSwap(step.indices || [step.index]);
          break;
        case 'sorted':
          if (step.index !== undefined) this.highlightSorted(step.index);
          break;
        case 'pivot':
          this.highlightPivot(step.index);
          break;
        case 'current':
          this.highlightCurrent(step.index);
          break;
        case 'done':
          this.allSorted();
          break;
      }

      if (delay > 0) {
        await sleep(delay);
      } else {
        // Yield to browser every ~100 steps to keep UI responsive
        if (this.comparisons % 100 === 0) await sleep(0);
      }
    }

    this.updateStats();
    this.isRunning = false;
    return !this.stopFlag;
  }

  allSorted() {
    this.bars.forEach((bar, i) => {
      bar.className = 'bar sorted';
      this.sortedIndices.add(i);
    });
    this.setStepInfo('✓ Sorted! All elements are in order.');
  }

  stop() {
    this.stopFlag = true;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
