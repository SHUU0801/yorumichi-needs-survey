import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface SurveyInput {
  q1_use_app: 'yes' | 'no';
  q2_why_app: string;
  q3_use_device: 'yes' | 'no';
  q4_why_device: string;
  q5_price: string;
  q6_coupon_map: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body as SurveyInput;
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const emailText = `
ヨルミチ ニーズ調査 - アンケート回答
=====================================
質問1（アプリを使いたいですか）: ${data.q1_use_app === 'yes' ? 'はい' : 'いいえ'}
質問2（それはなぜですか）: ${data.q2_why_app}
質問3（デバイスを使いたいですか）: ${data.q3_use_device === 'yes' ? 'はい' : 'いいえ'}
質問4（それはなぜですか）: ${data.q4_why_device}
質問5（いくらなら購入したいですか）: ${data.q5_price}
質問6（クーポン連動マップについて）: ${data.q6_coupon_map}
=====================================
送信日時: ${timestamp}
  `;

  // Always log to Vercel dashboard logs
  console.log('=== NEW SURVEY RESPONSE ===');
  console.log(emailText);
  console.log('===========================');

  // Send email via Gmail SMTP (non-blocking - always return success to user)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"YORUMICHI Survey" <${smtpUser}>`,
        to: 'alisslab.jp@gmail.com',
        subject: 'ヨルミチ ニーズ調査 - アンケート回答',
        text: emailText,
      });

      console.log('✅ Email sent successfully to alisslab.jp@gmail.com');
    } catch (err) {
      console.error('❌ Email send failed:', err);
    }
  } else {
    console.log('SMTP_USER or SMTP_PASS not set - skipping email');
  }

  // Always return success
  return res.status(200).json({ success: true });
}
