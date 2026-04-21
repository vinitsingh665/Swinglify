import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Alert from '../../../../models/Alert';
import { fetchFromTradingView, parseStockData, FIELDS } from '../../../../lib/api-core';

// Security: same pattern as market-wrap cron
const CRON_SECRET = process.env.CRON_SECRET || 'swinglify_cron_run';

export const maxDuration = 30;

export async function GET(req) {
  try {
    // ── Auth ──
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');

    const isAuthorized = authHeader === `Bearer ${CRON_SECRET}` || querySecret === CRON_SECRET;
    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Weekend / Off-hours guard ──
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const day = ist.getUTCDay();
    const hours = ist.getUTCHours();
    const mins = ist.getUTCMinutes();
    const timeInMins = hours * 60 + mins;

    // Skip weekends
    if (day < 1 || day > 5) {
      return NextResponse.json({ message: 'Market closed (weekend). Skipping.' }, { status: 200 });
    }

    // Skip outside market hours (9:00 AM – 3:45 PM IST, with buffer)
    if (timeInMins < 9 * 60 || timeInMins > 15 * 60 + 45) {
      return NextResponse.json({ message: 'Market closed (off-hours). Skipping.' }, { status: 200 });
    }

    // ── Fetch active alerts ──
    await dbConnect();
    const activeAlerts = await Alert.find({ triggered: false, expired: false }).lean();

    if (activeAlerts.length === 0) {
      return NextResponse.json({ message: 'No active alerts to check.', checked: 0, triggered: 0 });
    }

    // ── Get unique symbols ──
    const uniqueSymbols = [...new Set(activeAlerts.map(a => a.symbol.toUpperCase()))];

    // ── Fetch live prices from TradingView (batch) ──
    const tickers = uniqueSymbols.map(s => s.includes(':') ? s : `NSE:${s}`);
    
    let stocks = [];
    // TradingView has limits, so batch in groups of 50
    for (let i = 0; i < tickers.length; i += 50) {
      const batch = tickers.slice(i, i + 50);
      const body = {
        symbols: { tickers: batch },
        columns: FIELDS,
        options: { lang: 'en' }
      };

      try {
        const tvData = await fetchFromTradingView(body);
        const parsed = parseStockData(tvData);
        stocks = stocks.concat(parsed);
      } catch (e) {
        console.error(`TradingView batch ${i} failed:`, e.message);
      }
    }

    if (stocks.length === 0) {
      return NextResponse.json({ message: 'Failed to fetch live prices.', checked: 0, triggered: 0 }, { status: 200 });
    }

    // ── Build symbol → data lookup ──
    const priceMap = {};
    for (const stock of stocks) {
      priceMap[stock.symbol.toUpperCase()] = stock;
    }

    // ── Evaluate each alert ──
    const triggeredIds = [];

    for (const alert of activeAlerts) {
      const stock = priceMap[alert.symbol.toUpperCase()];
      if (!stock) continue;

      let currentValue;
      if (alert.type === 'volume') {
        currentValue = stock.volume;
      } else if (alert.type === 'rsi') {
        currentValue = stock.rsi;
      } else {
        // Default: price
        currentValue = stock.price;
      }

      if (currentValue === null || currentValue === undefined) continue;

      const targetValue = parseFloat(alert.value);
      if (isNaN(targetValue)) continue;

      let isTriggered = false;

      switch (alert.comparison) {
        case 'Above':
          isTriggered = currentValue >= targetValue;
          break;
        case 'Below':
          isTriggered = currentValue <= targetValue;
          break;
        case 'Crosses':
          // For "Crosses", trigger if price is within 1% of target (close enough to have crossed)
          isTriggered = Math.abs(currentValue - targetValue) / targetValue <= 0.01;
          break;
        default:
          isTriggered = currentValue >= targetValue;
      }

      if (isTriggered) {
        triggeredIds.push({
          id: alert._id,
          symbol: alert.symbol,
          type: alert.type,
          comparison: alert.comparison,
          targetValue,
          currentValue
        });
      }
    }

    // ── Bulk update triggered alerts ──
    if (triggeredIds.length > 0) {
      const ids = triggeredIds.map(t => t.id);
      await Alert.updateMany(
        { _id: { $in: ids } },
        { $set: { triggered: true, triggeredAt: new Date() } }
      );
    }

    console.log(`[check-alerts] Checked ${activeAlerts.length} alerts, ${triggeredIds.length} triggered.`);

    return NextResponse.json({
      success: true,
      checked: activeAlerts.length,
      triggered: triggeredIds.length,
      details: triggeredIds.map(t => ({
        symbol: t.symbol,
        type: t.type,
        comparison: t.comparison,
        target: t.targetValue,
        current: t.currentValue
      }))
    });
  } catch (error) {
    console.error('Check-Alerts Cron Error:', error);
    return NextResponse.json({ error: 'Failed to check alerts', details: error.message }, { status: 500 });
  }
}
