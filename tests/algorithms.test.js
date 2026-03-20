// ============================================================
// SortViz — Algorithm Correctness Tests (Node/Jest compatible)
// ============================================================

function* bubbleSort(arr) {
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

function* selectionSort(arr) {
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

function* insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = key;
    yield { type: 'step', arr: [...arr] };
  }
  yield { type: 'done', arr: [...arr] };
}

function* mergeSort(arr) {
  yield* mergeSortHelper(arr, 0, arr.length - 1);
  yield { type: 'done', arr: [...arr] };
}
function* mergeSortHelper(arr, l, r) {
  if (l >= r) return;
  const mid = Math.floor((l + r) / 2);
  yield* mergeSortHelper(arr, l, mid);
  yield* mergeSortHelper(arr, mid + 1, r);
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

function* quickSort(arr) {
  yield* quickSortHelper(arr, 0, arr.length - 1);
  yield { type: 'done', arr: [...arr] };
}
function* quickSortHelper(arr, low, high) {
  if (low < high) {
    let i = low - 1;
    const pivot = arr[high];
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    yield { type: 'partition', arr: [...arr] };
    yield* quickSortHelper(arr, low, pi - 1);
    yield* quickSortHelper(arr, pi + 1, high);
  }
}

function* heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield* heapify(arr, i, 0);
  }
  yield { type: 'done', arr: [...arr] };
}
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

function* shellSort(arr) {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) { arr[j] = arr[j - gap]; j -= gap; }
      arr[j] = temp;
      yield { type: 'step' };
    }
  }
  yield { type: 'done', arr: [...arr] };
}

function* countingSort(arr) {
  if (arr.length === 0) { yield { type: 'done', arr: [] }; return; }
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (const x of arr) count[x]++;
  let idx = 0;
  for (let v = 0; v <= max; v++) {
    while (count[v]-- > 0) { arr[idx++] = v; }
  }
  yield { type: 'done', arr: [...arr] };
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function runSort(generatorFn, input) {
  const arr = [...input];
  const gen = generatorFn(arr);
  let last = null;
  for (const step of gen) { last = step; }
  return last && last.arr ? last.arr : arr;
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

// ─── Test data ───────────────────────────────────────────────────────────────
const algorithms = [
  { name: 'Bubble Sort',    fn: bubbleSort },
  { name: 'Selection Sort', fn: selectionSort },
  { name: 'Insertion Sort', fn: insertionSort },
  { name: 'Merge Sort',     fn: mergeSort },
  { name: 'Quick Sort',     fn: quickSort },
  { name: 'Heap Sort',      fn: heapSort },
  { name: 'Shell Sort',     fn: shellSort },
  { name: 'Counting Sort',  fn: countingSort },
];

const testCases = [
  { name: 'random array',        input: [64, 34, 25, 12, 22, 11, 90] },
  { name: 'already sorted',      input: [1, 2, 3, 4, 5, 6, 7] },
  { name: 'reverse sorted',      input: [7, 6, 5, 4, 3, 2, 1] },
  { name: 'single element',      input: [42] },
  { name: 'two elements',        input: [2, 1] },
  { name: 'all equal',           input: [5, 5, 5, 5, 5] },
  { name: 'contains duplicates', input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3] },
];

// ─── Tests ───────────────────────────────────────────────────────────────────
algorithms.forEach(({ name, fn }) => {
  describe(name, () => {
    testCases.forEach(({ name: caseName, input }) => {
      test(`sorts correctly: ${caseName}`, () => {
        const result = runSort(fn, input);
        const expected = [...input].sort((a, b) => a - b);
        expect(result).toEqual(expected);
        expect(isSorted(result)).toBe(true);
      });
    });

    test('does not lose or gain elements', () => {
      const input = [5, 2, 8, 1, 9, 3, 7, 4, 6];
      const result = runSort(fn, input);
      expect(result.length).toBe(input.length);
      expect([...result].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
    });

    test('handles empty array without throwing', () => {
      expect(() => runSort(fn, [])).not.toThrow();
    });
  });
});

describe('Suite coverage', () => {
  test('all 8 algorithms are tested', () => {
    expect(algorithms).toHaveLength(8);
  });
});
