// ═══════════════════════════════════════════════════════════════════════════
// INDIAN STOCK MARKET DASHBOARD — Frontend Application
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = '';
let currentCategory = 'nifty50';
let stocks = [];
let sortConfig = { key: null, order: 'desc' };
let refreshTimer = null;
let countdown = 30;
let searchTimeout = null;
let currentSubFilter = 'all';

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCategoryTabs();
  initSubFilters();
  initSearch();
  initRefreshButton();
  initSortHeaders();
  initModal();
  showSkeletonLoading();
  loadMarketStatus();
  loadIndices();
  loadStocks(currentCategory);
  startAutoRefresh();
});

// ─── Category Tabs ───────────────────────────────────────────────────────────
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      document.getElementById('categoryName').textContent = tab.textContent.replace(/[🟢🔴🔥]\s*/g, '');
      // Reset sub-filter to 'all' when switching category
      currentSubFilter = 'all';
      document.querySelectorAll('.sub-tab').forEach(st => st.classList.remove('active'));
      document.querySelector('.sub-tab[data-filter="all"]').classList.add('active');
      showSkeletonLoading();
      loadStocks(currentCategory);
      resetAutoRefresh();
    });
  });
}

// ─── Sub-Filter Tabs ─────────────────────────────────────────────────────────
function initSubFilters() {
  const subTabs = document.querySelectorAll('.sub-tab');
  subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSubFilter = tab.dataset.filter;
      sortAndRenderStocks();
    });
  });
}

function applySubFilter(data) {
  if (currentSubFilter === 'all') return data;

  let filtered = [...data];
  const TOP_N = 15;

  switch (currentSubFilter) {
    case 'mostactive':
      // Sort by volume descending, take top N
      filtered.sort((a, b) => (b.volume || 0) - (a.volume || 0));
      return filtered.slice(0, TOP_N);

    case 'topgainers':
      // Only positive change, sort by change% descending, take top N
      filtered = filtered.filter(s => (s.change || 0) > 0);
      filtered.sort((a, b) => (b.change || 0) - (a.change || 0));
      return filtered.slice(0, TOP_N);

    case 'toplosers':
      // Only negative change, sort by change% ascending, take top N
      filtered = filtered.filter(s => (s.change || 0) < 0);
      filtered.sort((a, b) => (a.change || 0) - (b.change || 0));
      return filtered.slice(0, TOP_N);

    default:
      return data;
  }
}

// ─── Sort Headers ────────────────────────────────────────────────────────────
function initSortHeaders() {
  const headers = document.querySelectorAll('.sortable');
  headers.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortConfig.key === key) {
        sortConfig.order = sortConfig.order === 'desc' ? 'asc' : 'desc';
      } else {
        sortConfig.key = key;
        sortConfig.order = 'desc';
      }

      headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.add(sortConfig.order === 'asc' ? 'sorted-asc' : 'sorted-desc');

      sortAndRenderStocks();
    });
  });
}

// ─── Search ──────────────────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = input.value.trim();
    if (q.length < 1) {
      results.classList.remove('active');
      return;
    }
    searchTimeout = setTimeout(() => searchStocks(q), 300);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 1) {
      results.classList.add('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      results.classList.remove('active');
    }
  });
}

async function searchStocks(query) {
  const results = document.getElementById('searchResults');
  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      results.innerHTML = data.data.slice(0, 10).map(s => `
        <div class="search-result-item" onclick="openStockModal('${s.symbol}')">
          <div>
            <div class="sr-symbol">${s.symbol}</div>
            <div class="sr-name">${s.name}</div>
          </div>
          <div class="sr-price">
            <div style="font-weight:600">₹${formatNumber(s.price)}</div>
            <div style="color: ${s.change >= 0 ? 'var(--green)' : 'var(--red)'}; font-size:0.75rem">
              ${s.change >= 0 ? '+' : ''}${s.change}%
            </div>
          </div>
        </div>
      `).join('');
      results.classList.add('active');
    } else {
      results.innerHTML = '<div style="padding:16px;color:var(--text-dim);text-align:center">No results found</div>';
      results.classList.add('active');
    }
  } catch (err) {
    results.innerHTML = '<div style="padding:16px;color:var(--red);text-align:center">Search failed</div>';
    results.classList.add('active');
  }
}

// ─── Refresh ─────────────────────────────────────────────────────────────────
function initRefreshButton() {
  document.getElementById('refreshBtn').addEventListener('click', () => {
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 600);
    loadStocks(currentCategory);
    loadIndices();
    loadMarketStatus();
    resetAutoRefresh();
  });
}

function startAutoRefresh() {
  countdown = 30;
  updateCountdown();
  refreshTimer = setInterval(() => {
    countdown--;
    updateCountdown();
    if (countdown <= 0) {
      loadStocks(currentCategory);
      loadIndices();
      loadMarketStatus();
      countdown = 30;
    }
  }, 1000);
}

function resetAutoRefresh() {
  clearInterval(refreshTimer);
  startAutoRefresh();
}

function updateCountdown() {
  document.getElementById('countdown').textContent = `${countdown}s`;
}

// ─── Load Market Status ──────────────────────────────────────────────────────
async function loadMarketStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/market-status`);
    const data = await res.json();
    const el = document.getElementById('marketStatus');

    el.className = 'market-status';
    if (data.isOpen) {
      el.classList.add('open');
      el.querySelector('.status-text').textContent = 'Market Open';
    } else if (data.isPreMarket) {
      el.classList.add('pre-market');
      el.querySelector('.status-text').textContent = 'Pre-Market';
    } else {
      el.classList.add('closed');
      el.querySelector('.status-text').textContent = 'Market Closed';
    }
  } catch (err) {
    console.error('Market status error:', err);
  }
}

// ─── Load Indices ────────────────────────────────────────────────────────────
async function loadIndices() {
  try {
    const res = await fetch(`${API_BASE}/api/indices`);
    const data = await res.json();
    const container = document.getElementById('tickerContent');

    if (data.success && data.data.length > 0) {
      container.innerHTML = data.data.map((idx, i) => {
        const changeClass = idx.change >= 0 ? 'positive' : 'negative';
        const changeSign = idx.change >= 0 ? '+' : '';
        return `
          ${i > 0 ? '<div class="ticker-divider"></div>' : ''}
          <div class="ticker-item">
            <span class="ti-name">${idx.name || idx.symbol}</span>
            <span class="ti-value">${formatNumber(idx.value)}</span>
            <span class="ti-change ${changeClass}">${changeSign}${idx.change}%</span>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Indices error:', err);
  }
}

// ─── Load Stocks ─────────────────────────────────────────────────────────────
async function loadStocks(category) {
  try {
    const res = await fetch(`${API_BASE}/api/stocks/${category}`);
    const data = await res.json();

    if (data.success) {
      stocks = data.data;
      document.getElementById('stockCount').textContent = data.count;
      document.getElementById('lastUpdated').textContent = formatTime(data.lastUpdated);

      // Calculate avg change
      const avgChange = stocks.reduce((sum, s) => sum + (s.change || 0), 0) / stocks.length;
      const avgEl = document.getElementById('avgChange');
      avgEl.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`;
      avgEl.style.color = avgChange >= 0 ? 'var(--green)' : 'var(--red)';

      sortAndRenderStocks();
    } else {
      showError(data.error || 'Failed to load stocks');
    }
  } catch (err) {
    console.error('Load stocks error:', err);
    showError('Failed to connect to API. Please make sure the server is running.');
  }
}

function sortAndRenderStocks() {
  // First apply sub-filter
  let filtered = applySubFilter(stocks);

  // Then apply sort
  if (sortConfig.key) {
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      aVal = aVal || 0;
      bVal = bVal || 0;
      return sortConfig.order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  // Update stock count to reflect filtered count
  document.getElementById('stockCount').textContent = filtered.length;

  renderStocks(filtered);
}

function renderStocks(data) {
  const tbody = document.getElementById('stockTableBody');
  tbody.innerHTML = data.map((s, i) => {
    const changeClass = (s.change || 0) >= 0 ? 'positive' : 'negative';
    const changeSign = (s.change || 0) >= 0 ? '+' : '';
    const absSign = (s.changeAbs || 0) >= 0 ? '+' : '';

    // 52-week range
    const w52Low = s.week52Low || s.low || 0;
    const w52High = s.week52High || s.high || 1;
    const w52Range = w52High - w52Low;
    const w52Pos = w52Range > 0 ? ((s.price - w52Low) / w52Range * 100) : 50;
    const rangeColorClass = w52Pos > 60 ? 'in-green' : w52Pos < 40 ? 'in-red' : 'in-neutral';

    // Logo
    const logoHtml = s.logo
      ? `<img class="stock-logo" src="${s.logo}" alt="${s.symbol}" onerror="this.style.display='none'">`
      : '';

    return `
      <tr onclick="openStockModal('${s.symbol}')" style="animation-delay: ${Math.min(i * 0.02, 0.5)}s">
        <td class="td-rank">${i + 1}</td>
        <td class="td-symbol">${logoHtml}${s.symbol}</td>
        <td class="td-name" title="${s.name}">${s.name}</td>
        <td class="td-price">₹${formatNumber(s.price)}</td>
        <td class="td-change ${changeClass}">${changeSign}${(s.change || 0).toFixed(2)}%</td>
        <td class="td-change-abs ${changeClass}">${absSign}₹${formatNumber(Math.abs(s.changeAbs || 0))}</td>
        <td class="td-volume">${formatVolume(s.volume)}</td>
        <td class="td-mcap">${formatMarketCap(s.marketCap)}</td>
        <td class="td-pe">${s.pe ? s.pe.toFixed(1) : '—'}</td>
        <td class="td-52w">
          <div class="range-bar">
            <div class="range-values">
              <div class="range-track">
                <div class="range-fill ${rangeColorClass}" style="width: ${Math.max(0, Math.min(100, w52Pos))}%"></div>
              </div>
              <div class="range-labels">
                <span>₹${formatCompact(w52Low)}</span>
                <span>₹${formatCompact(w52High)}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="td-rec">
          <span class="signal-badge ${getSignalClass(s.recommendation)}">${formatSignal(s.recommendation)}</span>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── Stock Modal ─────────────────────────────────────────────────────────────
function initModal() {
  const overlay = document.getElementById('stockModal');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('active');
  });
}

async function openStockModal(symbol) {
  const overlay = document.getElementById('stockModal');
  const content = document.getElementById('modalContent');
  overlay.classList.add('active');

  // Close search
  document.getElementById('searchResults').classList.remove('active');
  document.getElementById('searchInput').value = '';

  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Loading...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/stock/${symbol}`);
    const data = await res.json();

    if (data.success) {
      const s = data.data;
      const changeClass = (s.change || 0) >= 0 ? 'positive' : 'negative';
      const changeSign = (s.change || 0) >= 0 ? '+' : '';
      const changeColor = (s.change || 0) >= 0 ? 'var(--green)' : 'var(--red)';

      content.innerHTML = `
        <div class="modal-header">
          <div>
            ${s.logo ? `<img class="stock-logo" src="${s.logo}" alt="${s.symbol}" style="width:36px;height:36px;margin-bottom:8px" onerror="this.style.display='none'">` : ''}
            <div class="modal-symbol">${s.symbol}</div>
            <div class="modal-name">${s.name} · ${s.exchange} · ${s.sector || 'N/A'}</div>
          </div>
        </div>

        <div class="modal-price-block">
          <div class="modal-price">₹${formatNumber(s.price)}</div>
          <div class="modal-change" style="color: ${changeColor}">
            ${changeSign}${(s.change || 0).toFixed(2)}% (${changeSign}₹${formatNumber(Math.abs(s.changeAbs || 0))})
          </div>
        </div>

        <div class="modal-grid">
          <div class="modal-stat">
            <div class="modal-stat-label">Open</div>
            <div class="modal-stat-value">₹${formatNumber(s.open)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">High</div>
            <div class="modal-stat-value">₹${formatNumber(s.high)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">Low</div>
            <div class="modal-stat-value">₹${formatNumber(s.low)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">Volume</div>
            <div class="modal-stat-value">${formatVolume(s.volume)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">Market Cap</div>
            <div class="modal-stat-value">${formatMarketCap(s.marketCap)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">P/E Ratio</div>
            <div class="modal-stat-value">${s.pe ? s.pe.toFixed(2) : '—'}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">EPS</div>
            <div class="modal-stat-value">${s.eps ? '₹' + s.eps.toFixed(2) : '—'}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">52W High</div>
            <div class="modal-stat-value">₹${formatNumber(s.week52High)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">52W Low</div>
            <div class="modal-stat-value">₹${formatNumber(s.week52Low)}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">RSI (14)</div>
            <div class="modal-stat-value">${s.rsi ? s.rsi.toFixed(1) : '—'}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">ADX</div>
            <div class="modal-stat-value">${s.adx ? s.adx.toFixed(1) : '—'}</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-label">Signal</div>
            <div class="modal-stat-value">
              <span class="signal-badge ${getSignalClass(s.recommendation)}">${formatSignal(s.recommendation)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top:20px">
          <h4 style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">Performance</h4>
          <div class="modal-grid" style="grid-template-columns: repeat(6,1fr)">
            ${renderPerfStat('1 Week', s.perfWeek)}
            ${renderPerfStat('1 Month', s.perfMonth)}
            ${renderPerfStat('3 Month', s.perf3Month)}
            ${renderPerfStat('6 Month', s.perf6Month)}
            ${renderPerfStat('YTD', s.perfYTD)}
            ${renderPerfStat('1 Year', s.perfYear)}
          </div>
        </div>

        <div style="margin-top:20px">
          <h4 style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">Moving Averages</h4>
          <div class="modal-grid" style="grid-template-columns: repeat(3,1fr)">
            ${renderMAStat('EMA 20', s.ema20, s.price)}
            ${renderMAStat('SMA 50', s.sma50, s.price)}
            ${renderMAStat('SMA 200', s.sma200, s.price)}
          </div>
        </div>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red)">${data.error || 'Failed to load stock data'}</div>`;
    }
  } catch (err) {
    content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red)">Failed to load stock data</div>';
  }
}

function renderPerfStat(label, value) {
  const color = value > 0 ? 'var(--green)' : value < 0 ? 'var(--red)' : 'var(--text-muted)';
  const sign = value > 0 ? '+' : '';
  return `
    <div class="modal-stat" style="text-align:center">
      <div class="modal-stat-label">${label}</div>
      <div class="modal-stat-value" style="color:${color}">${value != null ? sign + value.toFixed(1) + '%' : '—'}</div>
    </div>
  `;
}

function renderMAStat(label, maValue, price) {
  const above = maValue && price ? price > maValue : null;
  const color = above === true ? 'var(--green)' : above === false ? 'var(--red)' : 'var(--text-muted)';
  return `
    <div class="modal-stat">
      <div class="modal-stat-label">${label}</div>
      <div class="modal-stat-value" style="color:${color}">₹${maValue ? formatNumber(maValue) : '—'}</div>
    </div>
  `;
}

// ─── Skeleton Loading ────────────────────────────────────────────────────────
function showSkeletonLoading() {
  const tbody = document.getElementById('stockTableBody');
  tbody.innerHTML = Array.from({ length: 15 }, (_, i) => `
    <tr class="skeleton-row">
      <td><div class="skeleton skeleton-block" style="width:20px;height:14px"></div></td>
      <td><div class="skeleton skeleton-block" style="width:80px;height:14px"></div></td>
      <td><div class="skeleton skeleton-block" style="width:140px;height:14px"></div></td>
      <td><div class="skeleton skeleton-block" style="width:70px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:55px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:55px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:60px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:70px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:40px;height:14px;margin-left:auto"></div></td>
      <td><div class="skeleton skeleton-block" style="width:120px;height:14px"></div></td>
      <td><div class="skeleton skeleton-block" style="width:50px;height:20px;margin:0 auto;border-radius:100px"></div></td>
    </tr>
  `).join('');
}

function showError(message) {
  const tbody = document.getElementById('stockTableBody');
  tbody.innerHTML = `
    <tr>
      <td colspan="11" style="text-align:center;padding:60px 20px">
        <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
        <div style="color:var(--red);font-weight:600;margin-bottom:8px">${message}</div>
        <button onclick="loadStocks('${currentCategory}')" style="
          padding:8px 20px;background:var(--accent-blue);color:white;border:none;
          border-radius:100px;font-family:var(--font-sans);font-size:0.85rem;
          cursor:pointer;font-weight:600
        ">Retry</button>
      </td>
    </tr>
  `;
}

// ─── Formatting Utilities ────────────────────────────────────────────────────
function formatNumber(val) {
  if (val === null || val === undefined) return '—';
  return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(val) {
  if (!val) return '—';
  if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
  if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
  if (val >= 1000) return (val / 1000).toFixed(1) + ' K';
  return val.toLocaleString('en-IN');
}

function formatMarketCap(val) {
  if (!val) return '—';
  if (val >= 10000000000000) return '₹' + (val / 10000000000000).toFixed(2) + 'L Cr';
  if (val >= 100000000000) return '₹' + (val / 100000000000).toFixed(2) + 'K Cr';
  if (val >= 10000000) return '₹' + (val / 10000000).toFixed(0) + ' Cr';
  return '₹' + val.toLocaleString('en-IN');
}

function formatCompact(val) {
  if (!val) return '—';
  if (val >= 100000) return (val / 1000).toFixed(0) + 'K';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
  return val.toFixed(0);
}

function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getSignalClass(rec) {
  switch (rec) {
    case 'STRONG_BUY': return 'strong-buy';
    case 'BUY': return 'buy';
    case 'SELL': return 'sell';
    case 'STRONG_SELL': return 'strong-sell';
    default: return 'neutral';
  }
}

function formatSignal(rec) {
  switch (rec) {
    case 'STRONG_BUY': return 'Strong Buy';
    case 'BUY': return 'Buy';
    case 'SELL': return 'Sell';
    case 'STRONG_SELL': return 'Strong Sell';
    default: return 'Neutral';
  }
}
