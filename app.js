/* ─────────────────────────────────────────────
   Navigation scroll state
───────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
});

/* ─────────────────────────────────────────────
   Metric Tree: expand/collapse
───────────────────────────────────────────── */
function toggleNode(id) {
  const node = document.getElementById('node-' + id);
  const detail = document.getElementById('detail-' + id);
  const isExpanded = node.classList.contains('is-expanded');

  document.querySelectorAll('.tree-node--expandable').forEach(n => n.classList.remove('is-expanded'));
  document.querySelectorAll('.tree-detail').forEach(d => d.classList.remove('is-visible'));

  if (!isExpanded) {
    node.classList.add('is-expanded');
    detail.classList.add('is-visible');
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ─────────────────────────────────────────────
   Root Cause: accordion
───────────────────────────────────────────── */
function toggleRcaStep(num) {
  const step = document.getElementById('rca-step-' + num);
  const isOpen = step.classList.contains('is-open');

  document.querySelectorAll('.rca-step').forEach(s => s.classList.remove('is-open'));

  if (!isOpen) {
    step.classList.add('is-open');
    setTimeout(() => {
      step.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

/* ─────────────────────────────────────────────
   Scroll reveal
───────────────────────────────────────────── */
const revealTargets = [
  '.stat-card', '.metric-card', '.threshold-card', '.tree-node--l1',
  '.rca-step', '.decomp-card', '.hypothesis-card', '.comparison-col',
  '.finding-card', '.rec-card', '.method-card', '.callout',
  '.tree-verification', '.experiment-card'
];

function initReveals() {
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   Charts
───────────────────────────────────────────── */
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthlyConversion = [68.1, 51.9, 43.1, 41.0, 36.6, 33.0, 31.8, 30.5, 30.5, 29.5, 34.3, 30.0];
const c2p = [83.7, 69.7, 63.3, 61.2, 57.7, 54.8, 54.1, 53.0, 52.0, 51.7, 55.5, 52.5];
const p2o = [92.9, 85.8, 80.2, 77.1, 74.4, 70.2, 68.9, 67.8, 67.7, 66.7, 70.8, 66.8];
const oc  = [87.6, 86.9, 84.8, 86.9, 85.4, 85.9, 85.3, 85.0, 86.4, 85.6, 87.2, 85.6];

const chartFontFamily = '"Plus Jakarta Sans", sans-serif';
const chartColors = {
  primary: '#1A4B33',
  accent: '#F46A25',
  muted: 'rgba(250,250,250,0.4)',
  gridLine: 'rgba(255,255,255,0.08)',
  gridLineDark: 'rgba(255,255,255,0.15)',
  white: '#FAFAFA',
  green: '#16A34A',
  blue: '#3B82F6',
};

function initDeclineChart() {
  const ctx = document.getElementById('declineChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Checkout Conversion Rate',
        data: monthlyConversion,
        borderColor: chartColors.accent,
        backgroundColor: 'rgba(244, 106, 37, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: months.map((_, i) =>
          i === 10 ? chartColors.accent : i === 11 ? '#DC2626' : chartColors.white
        ),
        pointBorderColor: months.map((_, i) =>
          i === 10 ? chartColors.accent : i === 11 ? '#DC2626' : chartColors.primary
        ),
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: chartColors.primary,
          titleFont: { family: chartFontFamily, weight: '600' },
          bodyFont: { family: chartFontFamily },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        x: {
          grid: { color: chartColors.gridLine },
          ticks: { color: chartColors.muted, font: { family: chartFontFamily, size: 12 } },
          border: { color: chartColors.gridLineDark }
        },
        y: {
          min: 20,
          max: 75,
          grid: { color: chartColors.gridLine },
          ticks: {
            color: chartColors.muted,
            font: { family: chartFontFamily, size: 12 },
            callback: (v) => v + '%'
          },
          border: { color: chartColors.gridLineDark }
        }
      }
    }
  });
}

function initSubstepChart() {
  const ctx = document.getElementById('substepChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Checkout → Payment',
          data: c2p,
          borderColor: chartColors.accent,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: chartColors.accent,
          tension: 0.3,
        },
        {
          label: 'Payment → Order',
          data: p2o,
          borderColor: chartColors.blue,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: chartColors.blue,
          tension: 0.3,
        },
        {
          label: 'Order Completion',
          data: oc,
          borderColor: chartColors.green,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: chartColors.green,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: chartColors.muted,
            font: { family: chartFontFamily, size: 12 },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
          }
        },
        tooltip: {
          backgroundColor: chartColors.primary,
          titleFont: { family: chartFontFamily, weight: '600' },
          bodyFont: { family: chartFontFamily },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        x: {
          grid: { color: chartColors.gridLine },
          ticks: { color: chartColors.muted, font: { family: chartFontFamily, size: 12 } },
          border: { color: chartColors.gridLineDark }
        },
        y: {
          min: 45,
          max: 100,
          grid: { color: chartColors.gridLine },
          ticks: {
            color: chartColors.muted,
            font: { family: chartFontFamily, size: 12 },
            callback: (v) => v + '%'
          },
          border: { color: chartColors.gridLineDark }
        }
      }
    }
  });
}

/* ─────────────────────────────────────────────
   Init
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initDeclineChart();
  initSubstepChart();
  initReveals();
});
