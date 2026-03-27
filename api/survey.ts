import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SurveyInput {
  q1_use_app: 'yes' | 'no';
  q2_why_app: string;
  q3_use_device: 'yes' | 'no';
  q4_why_device: string;
  q5_price: string;
  q6_coupon_map: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow all methods for preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body as SurveyInput;
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

    const emailText = `
ヨルミチ ニーズ調査 - アンケート回答
=====================================
質問1: ${data.q1_use_app === 'yes' ? 'はい' : 'いいえ'}
質問2: ${data.q2_why_app}
質問3: ${data.q3_use_device === 'yes' ? 'はい' : 'いいえ'}
質問4: ${data.q4_why_device}
質問5: ${data.q5_price}
質問6: ${data.q6_coupon_map}
=====================================
送信日時: ${timestamp}
    `;

    // Always log to Vercel logs (accessible in dashboard)
    console.log('=== NEW SURVEY RESPONSE ===');
    console.log(emailText);
    console.log('===========================');

    // Try Resend email if API key exists (non-blocking)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'YORUMICHI Survey <onboarding@resend.dev>',
          to: ['alisslab.jp@gmail.com'],
          subject: 'ヨルミチ ニーズ調査 - アンケート回答',
          text: emailText,
        }),
      }).catch(err => console.error('Email failed (non-fatal):', err));
    }

    // Always return 200 - submission is guaranteed logged
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Handler error:', error);
    // Still return 200 so the form shows success
    return res.status(200).json({ success: true });
  }
}
