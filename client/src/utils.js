export function formatNumber(val) {
    if (val === null || val === undefined) return '—';
    return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatVolume(val) {
    if (!val) return '—';
    if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
    if (val >= 1000) return (val / 1000).toFixed(1) + ' K';
    return val.toLocaleString('en-IN');
}

export function formatMarketCap(val) {
    if (!val) return '—';
    if (val >= 10000000000000) return '₹' + (val / 10000000000000).toFixed(2) + 'L Cr';
    if (val >= 100000000000) return '₹' + (val / 100000000000).toFixed(2) + 'K Cr';
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(0) + ' Cr';
    return '₹' + val.toLocaleString('en-IN');
}

export function formatCompact(val) {
    if (!val) return '—';
    if (val >= 100000) return (val / 1000).toFixed(0) + 'K';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toFixed(0);
}

export function formatTime(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function getSignalClass(rec) {
    switch (rec) {
        case 'STRONG_BUY': return 'strong-buy';
        case 'BUY': return 'buy';
        case 'SELL': return 'sell';
        case 'STRONG_SELL': return 'strong-sell';
        default: return 'neutral';
    }
}

export function formatSignal(rec) {
    switch (rec) {
        case 'STRONG_BUY': return 'Strong Buy';
        case 'BUY': return 'Buy';
        case 'SELL': return 'Sell';
        case 'STRONG_SELL': return 'Strong Sell';
        default: return 'Neutral';
    }
}

export const CATEGORIES = [
    {
        group: 'Broad', items: [
            { id: 'nifty50', label: 'Nifty 50' },
            { id: 'niftynext50', label: 'Next 50' },
            { id: 'nifty100', label: 'Nifty 100' },
            { id: 'nifty200', label: 'Nifty 200' },
            { id: 'nifty500', label: 'Nifty 500' },
        ]
    },
    {
        group: 'Size', items: [
            { id: 'midcap50', label: 'MidCap 50' },
            { id: 'midcap100', label: 'MidCap 100' },
            { id: 'midcap150', label: 'MidCap 150' },
            { id: 'smallcap50', label: 'SmallCap 50' },
            { id: 'smallcap100', label: 'SmallCap 100' },
            { id: 'smallcap250', label: 'SmallCap 250' },
            { id: 'microcap250', label: 'MicroCap 250' },
            { id: 'largemidcap250', label: 'LargeMidCap 250' },
            { id: 'midsmall400', label: 'MidSmall 400' },
        ]
    },
    {
        group: 'Sector', items: [
            { id: 'banknifty', label: 'Bank Nifty' },
            { id: 'psubank', label: 'PSU Bank' },
            { id: 'privatebank', label: 'Pvt Bank' },
            { id: 'financial', label: 'Financial' },
            { id: 'niftyit', label: 'IT' },
            { id: 'pharma', label: 'Pharma' },
            { id: 'auto', label: 'Auto' },
            { id: 'fmcg', label: 'FMCG' },
            { id: 'metal', label: 'Metal' },
            { id: 'realty', label: 'Realty' },
            { id: 'energy', label: 'Energy' },
            { id: 'infra', label: 'Infra' },
            { id: 'media', label: 'Media' },
            { id: 'healthcare', label: 'Healthcare' },
            { id: 'consumer', label: 'Consumer' },
            { id: 'oilgas', label: 'Oil & Gas' },
            { id: 'pse', label: 'PSE' },
        ]
    },
    {
        group: 'Activity', items: [
            { id: 'gainers', label: '🟢 Gainers' },
            { id: 'losers', label: '🔴 Losers' },
            { id: 'mostactive', label: '🔥 Most Active' },
            { id: 'all', label: 'All' },
        ]
    }
];

export const SUB_FILTERS = [
    { id: 'all', label: '📋 All' },
    { id: 'mostactive', label: '🔥 Most Active' },
    { id: 'topgainers', label: '🟢 Top Gainers' },
    { id: 'toplosers', label: '🔴 Top Losers' },
];

export function applySubFilter(data, filter) {
    if (filter === 'all') return data;
    const TOP_N = 15;
    let filtered = [...data];
    switch (filter) {
        case 'mostactive':
            filtered.sort((a, b) => (b.volume || 0) - (a.volume || 0));
            return filtered.slice(0, TOP_N);
        case 'topgainers':
            filtered = filtered.filter(s => (s.change || 0) > 0);
            filtered.sort((a, b) => (b.change || 0) - (a.change || 0));
            return filtered.slice(0, TOP_N);
        case 'toplosers':
            filtered = filtered.filter(s => (s.change || 0) < 0);
            filtered.sort((a, b) => (a.change || 0) - (b.change || 0));
            return filtered.slice(0, TOP_N);
        default: return data;
    }
}
