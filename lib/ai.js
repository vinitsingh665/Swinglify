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
    In EXACTLY two concise, professional sentences, give a technical outlook for a swing trader. Mention the momentum based on the RSI and the overall signal. Do not mention TradingView or any external data providers. Do not use financial disclaimer boilerplate. Be direct and analytical.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3, // Low temperature for consistent, analytical responses
      max_tokens: 150,
    });

    return chatCompletion.choices[0]?.message?.content || 'No insight could be generated at this time.';
  } catch (error) {
    console.error('Groq Stock Insight Error:', error);
    return 'AI analysis is currently unavailable.';
  }
}

/**
 * Generates an end-of-day market wrap-up based on broad market indices.
 * Uses Mixtral or Llama 3 70B for higher quality narrative generation.
 */
export async function generateMarketWrapUp(niftyChange, bankNiftyChange, advanceDeclineRatio) {
  try {
    const prompt = `You are the lead market analyst at a premium trading firm. Write a highly engaging, professional 3-paragraph "Daily Market Wrap-Up" for retail swing traders.\n
    Today's Data:\n
    Nifty 50 Change: ${niftyChange}%\n
    Bank Nifty Change: ${bankNiftyChange}%\n
    Advance/Decline Ratio (Breadth): ${advanceDeclineRatio}\n\n
    Paragraph 1: Summarize the day's price action on the major indices.\n
    Paragraph 2: Interpret the market breadth (Advance/Decline ratio). Are buyers or sellers in control of the broader market?\n
    Paragraph 3: Give a quick 1-sentence tip on what swing traders should watch for tomorrow based on this momentum.\n
    Do not use generic disclaimers. Use Markdown for formatting (bolding key terms). Keep it punchy and insightful.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // 70B model is better for writing articles
      temperature: 0.5,
      max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || 'Today\'s market wrap-up could not be generated.';
  } catch (error) {
    console.error('Groq Market Wrap-Up Error:', error);
    return null;
  }
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
      model: 'llama-3.1-8b-instant',
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
