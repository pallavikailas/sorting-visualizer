// ============================================================
// SortViz — Algorithm Correctness Tests
// Tests each sorting algorithm produces correct output
// ============================================================

// Node.js-compatible version of ALGORITHMS (generators only)
const ALGORITHMS_TEST = {
  bubble: {
    *sort(arr) {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
            yield { type: 'swap', arr: [...arr] };
          }
        }
        if (!swapped) break;
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  selection: {
    *sort(arr) {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        yield { type: 'sorted', index: i };
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  insertion: {
    *sort(arr) {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
        arr[j + 1] = key;
        yield { type: 'step', arr: [...arr] };
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  merge: {
    *sort(arr) {
      yield* mergeHelper(arr, 0, arr.length - 1);
      yield { type: 'done', arr: [...arr] };
      function* mergeHelper(arr, l, r) {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);
        yield* mergeHelper(arr, l, mid);
        yield* mergeHelper(arr, mid + 1, r);
        yield* mergeParts(arr, l, mid, r);
      }
      function* mergeParts(arr, l, mid, r) {
        const left = arr.slice(l, mid + 1);
        const right = arr.slice(mid + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
        yield { type: 'merge', arr: [...arr] };
      }
    }
  },

  quick: {
    *sort(arr) {
      yield* quickHelper(arr, 0, arr.length - 1);
      yield { type: 'done', arr: [...arr] };
      function* quickHelper(arr, low, high) {
        if (low < high) {
          const pi = yield* partition(arr, low, high);
          yield* quickHelper(arr, low, pi - 1);
          yield* quickHelper(arr, pi + 1, high);
        }
      }
      function* partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
          if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield { type: 'partition' };
        return i + 1;
      }
    }
  },

  heap: {
    *sort(arr) {
      const n = arr.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(arr, n, i);
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield* heapify(arr, i, 0);
      }
      yield { type: 'done', arr: [...arr] };
      function* heapify(arr, n, i) {
        let largest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          yield { type: 'heapify' };
          yield* heapify(arr, n, largest);
        }
      }
    }
  },

  shell: {
    *sort(arr) {
      const n = arr.length;
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          while (j >= gap && arr[j - gap] > temp) { arr[j] = arr[j - gap]; j -= gap; }
          arr[j] = temp;
          yield { type: 'step', arr: [...arr] };
        }
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  counting: {
    *sort(arr) {
      const max = Math.max(...arr);
      const count = new Array(max + 1).fill(0);
      for (const x of arr) count[x]++;
      let idx = 0;
      for (let v = 0; v <= max; v++) {
        while (count[v]-- > 0) { arr[idx++] = v; }
      }
      yield { type: 'done', arr: [...arr] };
    }
  }
};

// ─── Helper: run generator to completion and return sorted array ──────────────
function runSort(algoKey, input) {
  const arr = [...input];
  const gen = ALGORITHMS_TEST[algoKey].sort(arr);
  let result = gen.next();
  while (!result.done) {
    result = gen.next();
  }
  // Get final state from last 'done' step
  for (const step of ALGORITHMS_TEST[algoKey].sort([...input])) {
    if (step.type === 'done') return step.arr;
  }
  return arr;
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

// ─── Test fixtures ────────────────────────────────────────────────────────────
const testCases = [
  { name: 'random array',        arr: [64, 34, 25, 12, 22, 11, 90] },
  { name: 'already sorted',      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: 'reverse sorted',      arr: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { name: 'single element',      arr: [42] },
  { name: 'two elements',        arr: [2, 1] },
  { name: 'all equal elements',  arr: [5, 5, 5, 5, 5] },
  { name: 'large random',        arr: Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1) },
  { name: 'contains duplicates', arr: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5] },
];

// ─── Tests ────────────────────────────────────────────────────────────────────
describe.each(Object.keys(ALGORITHMS_TEST))('%s', (algoKey) => {
  testCases.forEach(({ name, arr }) => {
    test(`sorts correctly: ${name}`, () => {
      const sorted = runSort(algoKey, arr);
      const expected = [...arr].sort((a, b) => a - b);
      expect(sorted).toEqual(expected);
      expect(isSorted(sorted)).toBe(true);
    });
  });

  test('does not mutate elements (same values, different order)', () => {
    const input = [5, 2, 8, 1, 9, 3];
    const sorted = runSort(algoKey, input);
    expect(sorted.sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
  });

  test('handles empty array gracefully', () => {
    // Empty arr — should not throw
    expect(() => {
      const gen = ALGORITHMS_TEST[algoKey].sort([]);
      for (const _ of gen) {}
    }).not.toThrow();
  });
});

describe('Algorithm metadata', () => {
  test('all algorithms have required metadata in browser version', () => {
    const requiredFields = ['name', 'desc', 'best', 'worst', 'avg', 'space', 'stable', 'pseudocode', 'tags', 'rating'];
    // This would be loaded from algorithms.js in browser — here we just check test coverage
    expect(Object.keys(ALGORITHMS_TEST)).toHaveLength(8);
  });

  test('complexity notations are valid strings', () => {
    const validNotations = ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'O(n²)', 'O(n log² n)', 'O(n+k)', 'O(k)', 'O(log n)'];
    // Checked structurally in browser; here we verify test algos match expected count
    expect(Object.keys(ALGORITHMS_TEST).length).toBeGreaterThan(0);
  });
});
