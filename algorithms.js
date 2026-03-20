// ============================================
// SORTVIZ — Sorting Algorithm Implementations
// Each algorithm yields steps for visualization
// ============================================

const ALGORITHMS = {

  bubble: {
    name: 'Bubble Sort',
    desc: 'Repeatedly compares adjacent elements and swaps them if out of order. Simple but inefficient — every pass "bubbles" the largest unsorted element to its final position.',
    best: 'O(n)', worst: 'O(n²)', avg: 'O(n²)', space: 'O(1)',
    stable: true, inPlace: true, tags: ['Stable', 'In-Place', 'Comparison'],
    rating: 1,
    pseudocode: `for i = 0 to n-1:
  swapped = false
  for j = 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
      swapped = true
  if not swapped:
    break  // Already sorted`,
    *sort(arr) {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          yield { type: 'compare', indices: [j, j + 1], msg: `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}` };
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
            yield { type: 'swap', indices: [j, j + 1], arr: [...arr], msg: `Swapped → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}` };
          }
        }
        yield { type: 'sorted', index: n - i - 1, arr: [...arr] };
        if (!swapped) break;
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  selection: {
    name: 'Selection Sort',
    desc: 'Finds the minimum element from the unsorted portion and places it at the beginning. Makes at most n-1 swaps, but always runs in O(n²) regardless of input.',
    best: 'O(n²)', worst: 'O(n²)', avg: 'O(n²)', space: 'O(1)',
    stable: false, inPlace: true, tags: ['In-Place', 'Comparison', 'Unstable'],
    rating: 1,
    pseudocode: `for i = 0 to n-1:
  minIdx = i
  for j = i+1 to n-1:
    if arr[j] < arr[minIdx]:
      minIdx = j
  if minIdx != i:
    swap(arr[i], arr[minIdx])`,
    *sort(arr) {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          yield { type: 'compare', indices: [minIdx, j], msg: `Finding min: comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}` };
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            yield { type: 'current', index: minIdx, msg: `New minimum found at index ${minIdx}: ${arr[minIdx]}` };
          }
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          yield { type: 'swap', indices: [i, minIdx], arr: [...arr], msg: `Placing min ${arr[i]} at position ${i}` };
        }
        yield { type: 'sorted', index: i, arr: [...arr] };
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  insertion: {
    name: 'Insertion Sort',
    desc: 'Builds the sorted array one element at a time by inserting each new element into its correct position. Efficient for small datasets and nearly-sorted arrays.',
    best: 'O(n)', worst: 'O(n²)', avg: 'O(n²)', space: 'O(1)',
    stable: true, inPlace: true, tags: ['Stable', 'In-Place', 'Adaptive'],
    rating: 2,
    pseudocode: `for i = 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
    *sort(arr) {
      const n = arr.length;
      yield { type: 'sorted', index: 0, arr: [...arr] };
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        yield { type: 'current', index: i, msg: `Inserting key=${key} into sorted portion` };
        while (j >= 0 && arr[j] > key) {
          yield { type: 'compare', indices: [j, j + 1], msg: `arr[${j}]=${arr[j]} > key=${key}, shifting right` };
          arr[j + 1] = arr[j];
          yield { type: 'swap', indices: [j, j + 1], arr: [...arr], msg: `Shifted arr[${j}]=${arr[j+1]} right` };
          j--;
        }
        arr[j + 1] = key;
        yield { type: 'sorted', index: j + 1, arr: [...arr], msg: `Placed key=${key} at index ${j+1}` };
      }
      yield { type: 'done', arr: [...arr] };
    }
  },

  merge: {
    name: 'Merge Sort',
    desc: 'Divides the array in half, recursively sorts each half, then merges them. Guaranteed O(n log n) performance but requires O(n) extra space.',
    best: 'O(n log n)', worst: 'O(n log n)', avg: 'O(n log n)', space: 'O(n)',
    stable: true, inPlace: false, tags: ['Stable', 'Divide & Conquer', 'Recursive'],
    rating: 4,
    pseudocode: `mergeSort(arr, l, r):
  if l < r:
    mid = (l + r) / 2
    mergeSort(arr, l, mid)
    mergeSort(arr, mid+1, r)
    merge(arr, l, mid, r)

merge(arr, l, mid, r):
  copy left and right subarrays
  merge back in sorted order`,
    *sort(arr) {
      yield* mergeHelper(arr, 0, arr.length - 1);
      yield { type: 'done', arr: [...arr] };

      function* mergeHelper(arr, l, r) {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);
        yield* mergeHelper(arr, l, mid);
        yield* mergeHelper(arr, mid + 1, r);
        yield* merge(arr, l, mid, r);
      }

      function* merge(arr, l, mid, r) {
        const left = arr.slice(l, mid + 1);
        const right = arr.slice(mid + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          yield { type: 'compare', indices: [l + i, mid + 1 + j], msg: `Merging: comparing ${left[i]} and ${right[j]}` };
          if (left[i] <= right[j]) {
            arr[k] = left[i++];
          } else {
            arr[k] = right[j++];
          }
          yield { type: 'swap', indices: [k], arr: [...arr], msg: `Placed ${arr[k]} at index ${k}` };
          yield { type: 'sorted', index: k, arr: [...arr] };
          k++;
        }
        while (i < left.length) {
          arr[k] = left[i++];
          yield { type: 'sorted', index: k, arr: [...arr] };
          k++;
        }
        while (j < right.length) {
          arr[k] = right[j++];
          yield { type: 'sorted', index: k, arr: [...arr] };
          k++;
        }
      }
    }
  },

  quick: {
    name: 'Quick Sort',
    desc: 'Picks a pivot element, partitions array so smaller elements go left and larger go right, then recursively sorts each partition. Fast in practice but O(n²) worst case.',
    best: 'O(n log n)', worst: 'O(n²)', avg: 'O(n log n)', space: 'O(log n)',
    stable: false, inPlace: true, tags: ['In-Place', 'Divide & Conquer', 'Unstable'],
    rating: 5,
    pseudocode: `quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)

partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high-1:
    if arr[j] <= pivot:
      i++; swap(arr[i], arr[j])
  swap(arr[i+1], arr[high])
  return i + 1`,
    *sort(arr) {
      yield* quickHelper(arr, 0, arr.length - 1);
      yield { type: 'done', arr: [...arr] };

      function* quickHelper(arr, low, high) {
        if (low < high) {
          const pivotIdx = yield* partition(arr, low, high);
          yield { type: 'sorted', index: pivotIdx, arr: [...arr] };
          yield* quickHelper(arr, low, pivotIdx - 1);
          yield* quickHelper(arr, pivotIdx + 1, high);
        } else if (low === high) {
          yield { type: 'sorted', index: low, arr: [...arr] };
        }
      }

      function* partition(arr, low, high) {
        const pivot = arr[high];
        yield { type: 'pivot', index: high, msg: `Pivot = ${pivot} at index ${high}` };
        let i = low - 1;
        for (let j = low; j < high; j++) {
          yield { type: 'compare', indices: [j, high], msg: `Comparing arr[${j}]=${arr[j]} with pivot=${pivot}` };
          if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield { type: 'swap', indices: [i, j], arr: [...arr], msg: `Swapped arr[${i}] and arr[${j}]` };
          }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield { type: 'swap', indices: [i + 1, high], arr: [...arr], msg: `Placed pivot at index ${i+1}` };
        return i + 1;
      }
    }
  },

  heap: {
    name: 'Heap Sort',
    desc: 'Builds a max-heap from the data, then repeatedly extracts the maximum element. Guarantees O(n log n) with O(1) space — combines the speed of merge sort with the memory efficiency of selection sort.',
    best: 'O(n log n)', worst: 'O(n log n)', avg: 'O(n log n)', space: 'O(1)',
    stable: false, inPlace: true, tags: ['In-Place', 'Tree-based', 'Unstable'],
    rating: 4,
    pseudocode: `heapSort(arr):
  buildMaxHeap(arr)
  for i = n-1 to 1:
    swap(arr[0], arr[i])
    heapify(arr, 0, i)

heapify(arr, i, n):
  largest = i
  left = 2i+1; right = 2i+2
  if left<n and arr[left]>arr[largest]: largest=left
  if right<n and arr[right]>arr[largest]: largest=right
  if largest != i:
    swap(arr[i], arr[largest])
    heapify(arr, largest, n)`,
    *sort(arr) {
      const n = arr.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
      }
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { type: 'swap', indices: [0, i], arr: [...arr], msg: `Placed max ${arr[i]} at position ${i}` };
        yield { type: 'sorted', index: i, arr: [...arr] };
        yield* heapify(arr, i, 0);
      }
      yield { type: 'sorted', index: 0, arr: [...arr] };
      yield { type: 'done', arr: [...arr] };

      function* heapify(arr, n, i) {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n) yield { type: 'compare', indices: [l, largest], msg: `Heapify: comparing children of node ${i}` };
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n) yield { type: 'compare', indices: [r, largest], msg: `Heapify: comparing right child` };
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          yield { type: 'swap', indices: [i, largest], arr: [...arr], msg: `Heap fix: swapped indices ${i} and ${largest}` };
          yield* heapify(arr, n, largest);
        }
      }
    }
  },

  shell: {
    name: 'Shell Sort',
    desc: 'An improved insertion sort that compares elements far apart first, gradually reducing the gap. Breaks through the O(n²) barrier for medium-sized arrays.',
    best: 'O(n log n)', worst: 'O(n log² n)', avg: 'O(n log² n)', space: 'O(1)',
    stable: false, inPlace: true, tags: ['In-Place', 'Adaptive', 'Unstable'],
    rating: 3,
    pseudocode: `gap = n / 2
while gap > 0:
  for i = gap to n-1:
    temp = arr[i]
    j = i
    while j >= gap and arr[j-gap] > temp:
      arr[j] = arr[j-gap]
      j -= gap
    arr[j] = temp
  gap = gap / 2`,
    *sort(arr) {
      const n = arr.length;
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          yield { type: 'current', index: i, msg: `Gap=${gap}: inserting arr[${i}]=${temp}` };
          while (j >= gap && arr[j - gap] > temp) {
            yield { type: 'compare', indices: [j, j - gap], msg: `Gap=${gap}: arr[${j-gap}]=${arr[j-gap]} > ${temp}` };
            arr[j] = arr[j - gap];
            yield { type: 'swap', indices: [j, j - gap], arr: [...arr] };
            j -= gap;
          }
          arr[j] = temp;
          yield { type: 'current', index: j, arr: [...arr], msg: `Placed ${temp} at index ${j}` };
        }
      }
      for (let i = 0; i < n; i++) yield { type: 'sorted', index: i, arr: [...arr] };
      yield { type: 'done', arr: [...arr] };
    }
  },

  counting: {
    name: 'Counting Sort',
    desc: 'A non-comparison sort that counts the occurrences of each element. Extremely fast for integer data with a small range — runs in O(n+k) where k is the range of input.',
    best: 'O(n+k)', worst: 'O(n+k)', avg: 'O(n+k)', space: 'O(k)',
    stable: true, inPlace: false, tags: ['Stable', 'Non-Comparison', 'Integer Sort'],
    rating: 5,
    pseudocode: `find max element k
count[0..k] = 0
for each x in arr: count[x]++
for i = 1 to k: count[i] += count[i-1]
output[count[arr[i]]-1] = arr[i]
count[arr[i]]--
copy output to arr`,
    *sort(arr) {
      const max = Math.max(...arr);
      const count = new Array(max + 1).fill(0);
      for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
        yield { type: 'compare', indices: [i], msg: `Counting: arr[${i}]=${arr[i]}, count[${arr[i]}]=${count[arr[i]]}` };
      }
      let idx = 0;
      for (let v = 0; v <= max; v++) {
        while (count[v]-- > 0) {
          arr[idx] = v;
          yield { type: 'sorted', index: idx, arr: [...arr], msg: `Placing value ${v} at index ${idx}` };
          idx++;
        }
      }
      yield { type: 'done', arr: [...arr] };
    }
  }
};
