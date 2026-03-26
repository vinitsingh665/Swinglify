import { NextResponse } from 'next/server';
import { CATEGORY_FILTERS } from '../../../lib/api-core';

export async function GET() {
    function getCategoryDescription(key) {
        const descriptions = {
            nifty50: 'Top 50 companies by market cap on NSE',
            niftynext50: 'Nifty 51-100 ranked by market cap',
            nifty100: 'Top 100 companies by market cap on NSE',
            nifty200: 'Top 200 companies by market cap on NSE',
            nifty500: 'Top 500 companies by market cap on NSE',
            midcap50: 'Top 50 mid-cap companies',
            midcap100: 'Top 100 mid-cap companies',
            midcap150: 'Top 150 mid-cap companies',
            smallcap50: 'Top 50 small-cap companies',
            smallcap100: 'Top 100 small-cap companies',
            smallcap250: 'Top 250 small-cap companies',
            microcap250: 'Top 250 micro-cap companies',
            largemidcap250: 'Top 250 large + mid-cap companies',
            midsmall400: 'Top 400 mid + small-cap companies (₹2K–80K Cr)',
            banknifty: 'Major banking stocks on NSE',
            psubank: 'Public sector bank stocks',
            privatebank: 'Private sector bank stocks',
            financial: 'Financial services sector stocks',
            niftyit: 'Information technology sector stocks',
            pharma: 'Pharmaceutical sector stocks',
            auto: 'Automobile sector stocks',
            fmcg: 'Fast moving consumer goods stocks',
            metal: 'Metals & mining sector stocks',
            realty: 'Real estate sector stocks',
            energy: 'Energy & utilities sector stocks',
            infra: 'Infrastructure sector stocks',
            media: 'Media & entertainment sector stocks',
            healthcare: 'Healthcare sector stocks',
            consumer: 'Consumer durables sector stocks',
            oilgas: 'Oil & gas sector stocks',
            pse: 'Public sector enterprises',
            gainers: 'Top gainers of the day (large caps)',
            losers: 'Top losers of the day (large caps)',
            mostactive: 'Most actively traded stocks by volume',
            all: 'All NSE stocks above ₹5K Cr market cap'
        };
        return descriptions[key] || '';
    }

    return NextResponse.json({
        success: true,
        categories: Object.keys(CATEGORY_FILTERS).map(key => ({
            id: key,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            description: getCategoryDescription(key)
        }))
    });
}
