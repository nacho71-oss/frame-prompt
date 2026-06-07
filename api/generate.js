/**
 * FRAME — /api/generate
 * Vercel serverless function.
 * Receives: { systemPrompt, userMessage }
 * Returns: { prompt, summary } or { error }
 *
 * The API key is read from ANTHROPIC_API_KEY environment variable (set in Vercel dashboard).
 * Never expose the key client-side.
 */

export default async function handler(req, res) {
  // ── CORS headers ──────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Validate env ──────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured. Set ANTHROPIC_API_KEY in Vercel environment variables.' });
  }

  // ── Parse body ────────────────────────────────────────────
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { systemPrompt, userMessage } = body ?? {};

  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: 'Missing systemPrompt or userMessage' });
  }

  // ── Call Anthropic API ────────────────────────────────────
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(502).json({
        error: `Anthropic API error: ${response.status}`,
        detail: errorText,
      });
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text ?? '';

    if (!rawText) {
      return res.status(502).json({ error: 'Empty response from Claude' });
    }

    // ── Parse out SUMMARY from the raw text ──────────────────
    const summaryMatch = rawText.match(/^SUMMARY:\s*(.+)$/m);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Full prompt = everything except the SUMMARY line
    const prompt = rawText.replace(/^SUMMARY:.*$/m, '').trim();

    return res.status(200).json({ prompt, summary, raw: rawText });

  } catch (err) {
    console.error('generate handler error:', err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
