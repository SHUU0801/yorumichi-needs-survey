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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body as SurveyInput;

    // Validate required fields
    if (!data.q2_why_app || !data.q4_why_device || !data.q5_price || !data.q6_coupon_map) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const emailText = `
ヨルミチ ニーズ調査 - アンケート回答
=====================================

質問1: このアプリを使いたいですか？
${data.q1_use_app === 'yes' ? 'はい' : 'いいえ'}

質問2: それはなぜですか？
${data.q2_why_app}

質問3: このデバイスを使いたいですか？
${data.q3_use_device === 'yes' ? 'はい' : 'いいえ'}

質問4: それはなぜですか？
${data.q4_why_device}

質問5: いくらなら使いたいと思いますか？
${data.q5_price}

質問6: クーポン連動マップは、帰り道を変えるきっかけになりますか？
${data.q6_coupon_map}

=====================================
送信日時: ${timestamp}
    `;

    // Log all survey data so it's always visible in Vercel logs
    console.log('=== NEW SURVEY RESPONSE ===');
    console.log(emailText);
    console.log('===========================');

    // Try to send email via Resend if API key is set
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'YORUMICHI Survey <onboarding@resend.dev>',
            to: ['alisslab.jp@gmail.com'],
            subject: 'ヨルミチ ニーズ調査 - アンケート回答',
            text: emailText,
          }),
        });
        if (emailRes.ok) {
          console.log('Email sent via Resend');
        } else {
          const err = await emailRes.text();
          console.error('Resend error (non-fatal):', err);
        }
      } catch (emailErr) {
        // Email failure is non-fatal - survey is already logged above
        console.error('Email send failed (non-fatal):', emailErr);
      }
    } else {
      console.log('RESEND_API_KEY not set - survey response saved to logs only');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Survey handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
