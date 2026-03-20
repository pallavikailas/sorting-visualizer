// ============================================
// SORTVIZ — Big-O Growth Curve Chart
// Canvas-based complexity visualizer
// ============================================

function renderBigOChart(highlightAlgo) {
  const canvas = document.getElementById('bigOChart');
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 800;
  const H = 300;
  canvas.width = W;
  canvas.height = H;

  const pad = { top: 20, right: 120, bottom: 50, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Theme colours
  const bg = '#080b10';
  const gridColor = 'rgba(33,38,45,0.8)';
  const textColor = '#7d8590';
  const accentColor = '#00ff88';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const n = 50; // x-axis: n from 1 to 50
  const maxY = n * Math.log2(n) * 1.5;

  const xScale = x => pad.left + ((x - 1) / (n - 1)) * chartW;
  const yScale = y => pad.top + chartH - Math.min(y / maxY, 1) * chartH;

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const y = pad.top + chartH * (1 - t);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
  });
  [10, 20, 30, 40, 50].forEach(xv => {
    const x = xScale(xv);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + chartH);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(xv, x, pad.top + chartH + 16);
  });

  // Axis labels
  ctx.fillStyle = textColor;
  ctx.font = '11px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('n (input size)', pad.left + chartW / 2, H - 4);
  ctx.save();
  ctx.translate(14, pad.top + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('operations', 0, 0);
  ctx.restore();

  // Complexity functions
  const curves = [
    { label: 'O(1)',        fn: () => 1,                   color: '#3fb950', dash: [] },
    { label: 'O(log n)',    fn: x => Math.log2(x),         color: '#4fc3f7', dash: [] },
    { label: 'O(n)',        fn: x => x,                    color: '#e3b341', dash: [] },
    { label: 'O(n log n)',  fn: x => x * Math.log2(x),    color: '#ce93d8', dash: [] },
    { label: 'O(n²)',       fn: x => x * x,                color: '#f85149', dash: [] },
  ];

  // Determine which curves the highlighted algo uses
  const algoComplexities = {
    bubble:    ['O(n²)', 'O(n)'],
    selection: ['O(n²)'],
    insertion: ['O(n²)', 'O(n)'],
    merge:     ['O(n log n)'],
    quick:     ['O(n log n)', 'O(n²)'],
    heap:      ['O(n log n)'],
    shell:     ['O(n log n)'],
    counting:  ['O(n)'],
  };
  const highlighted = algoComplexities[highlightAlgo] || [];

  curves.forEach(curve => {
    const isHighlighted = highlighted.includes(curve.label);
    ctx.beginPath();
    ctx.strokeStyle = isHighlighted ? curve.color : curve.color + '44';
    ctx.lineWidth = isHighlighted ? 2.5 : 1;
    ctx.setLineDash(curve.dash);
    let first = true;
    for (let x = 1; x <= n; x++) {
      const y = curve.fn(x);
      const px = xScale(x);
      const py = yScale(y);
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Label at right edge
    const lastY = curve.fn(n);
    const labelY = Math.max(pad.top + 10, Math.min(yScale(lastY), pad.top + chartH - 4));
    ctx.fillStyle = isHighlighted ? curve.color : curve.color + '66';
    ctx.font = isHighlighted ? 'bold 11px Space Mono, monospace' : '10px Space Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(curve.label, pad.left + chartW + 8, labelY + 4);
  });

  ctx.setLineDash([]);

  // Axes
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.stroke();
}
