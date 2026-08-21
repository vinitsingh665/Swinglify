import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key-to-pass-nextjs-build',
});

/**
 * Generates a concise, 2-sentence technical swing trading insight for a stock.
 * Uses Llama 3 8B because it is blazing fast and excellent at pure data summarization.
 */
export async function generateStockInsight(ticker, currentPrice, rsi, technicalScore) {
  try {
    const prompt = `You are an expert swing trader. I am looking at the Indian stock ${ticker}. \n
    Current Price: ${currentPrice}\n
    RSI (14): ${rsi}\n
    Platform Technical Signal: ${technicalScore}\n\n
    In EXACTLY two concise, professional sentences, give a technical outlook for a swing trader. Mention the momentum based on the RSI and the overall signal. CRITICAL RULES: If RSI is between 40 and 60, state that the market momentum is currently sideways/neutral. DO NOT infer or hallucinate a buying opportunity unless the RSI implies it and the trend explicitly aligns. Do not mention TradingView or external data providers. Do not use financial disclaimer boilerplate. Be hyper-analytical.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
      temperature: 0.3, // Low temperature for consistent, analytical responses
      max_tokens: 150,
    });

    return chatCompletion.choices[0]?.message?.content || 'No insight could be generated at this time.';
  } catch (error) {
    console.error('Groq Stock Insight Error:', error);
    return 'AI analysis is currently unavailable.';
  }
}

export async function generateSectorAnalysis(sectorDataString) {
  try {
    const prompt = `You are a strict technical market analyst. Based on this sector performance data: \n${sectorDataString}\n
    Write a highly professional 2-paragraph analysis. 
    Focus on: Which sectors saw the heaviest money flow (advancing vs declining) and which sectors broke down today.
    Do NOT use disclaimers like "This is not financial advice". Do NOT invent data. Keep it analytical and concise. Use markdown formatting (bolding key sector names).`;
    const res = await groq.chat.completions.create({ messages: [{ role: 'user', content: prompt }], model: 'openai/gpt-oss-120b', temperature: 0.3, max_tokens: 350 });
    return res.choices[0]?.message?.content || 'Sector data unavailable.';
  } catch (err) { return null; }
}

export async function generateMoversAnalysis(moversDataString) {
  try {
    const prompt = `You are an expert momentum trader. Analyze these top 3 gaining stocks from today:\n${moversDataString}\n
    In 2 paragraphs, explain what their price change and RSI implies for swing traders. For example, if RSI is above 75, warn of overbought conditions. If volume is high, mention conviction.
    No fluff. No generic disclaimers. Use markdown to highlight stock symbols.`;
    const res = await groq.chat.completions.create({ messages: [{ role: 'user', content: prompt }], model: 'openai/gpt-oss-120b', temperature: 0.3, max_tokens: 350 });
    return res.choices[0]?.message?.content || 'Mover data unavailable.';
  } catch (err) { return null; }
}

export async function generateSensexUpdate(sensexDataString) {
  try {
    const prompt = `You are predicting broad market health. Review today's major indices (Nifty, Sensex, BankNifty, VIX):\n${sensexDataString}\n
    Write an engaging 2-paragraph update for retail swing traders. Explain what the Nifty/Sensex change paired with the VIX change means for overall market volatility and trend stability.
    Do not use introductory/concluding pleasantries or disclaimers. Only actionable breakdown. Use markdown.`;
    const res = await groq.chat.completions.create({ messages: [{ role: 'user', content: prompt }], model: 'openai/gpt-oss-120b', temperature: 0.3, max_tokens: 350 });
    return res.choices[0]?.message?.content || 'Index data unavailable.';
  } catch (err) { return null; }
}

export async function generateTomorrowForecast(breadthData, emaData) {
  try {
    const prompt = `You are an advanced quantitative trader formatting a forecast for tomorrow's open.
    Today's Market Breadth (Advancing vs Declining): ${breadthData}
    EMA 20/50 Support holding: ${emaData}\n
    Write exactly 2 paragraphs predicting what swing traders should watch for tomorrow morning. Use the Advance/Decline ratio to determine underlying momentum. Should they look for breakouts or prepare for a pullback?
    Be authoritative, use markdown, and no generic financial advice disclaimers.`;
    const res = await groq.chat.completions.create({ messages: [{ role: 'user', content: prompt }], model: 'openai/gpt-oss-120b', temperature: 0.3, max_tokens: 350 });
    return res.choices[0]?.message?.content || 'Forecast unavailable.';
  } catch (err) { return null; }
}
/**
 * Generates smart alert suggestions based on live market movers.
 * Returns a JSON array of 3 suggestions.
 */
export async function generateSmartSuggestions(topMovers) {
  try {
    const moversText = topMovers.map(s =>
      `${s.symbol}: Price ₹${s.price}, Change ${s.change}%, RSI ${s.rsi || 'N/A'}, Signal ${s.recommendation || 'Neutral'}`
    ).join('\n');

    const prompt = `You are a professional swing trading alert advisor for Indian stocks. Based on today's most active stocks, suggest exactly 3 price alerts a swing trader should set.

Today's top movers:
${moversText}

For each suggestion, respond ONLY with a valid JSON array. Each object must have these exact keys:
- "symbol": the stock ticker (e.g. "RELIANCE")
- "comparison": either "Above" or "Below"
- "value": the target price as a string (e.g. "2500")
- "type": "price"
- "reason": one short sentence explaining why this alert matters (max 15 words, no disclaimers)

Respond with ONLY the JSON array, no markdown, no explanation.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
      temperature: 0.3,
      max_tokens: 400,
    });

    const raw = chatCompletion.choices[0]?.message?.content || '[]';
    // Extract JSON array from the response
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (error) {
    console.error('Groq Smart Suggestions Error:', error);
    return [];
  }
}
