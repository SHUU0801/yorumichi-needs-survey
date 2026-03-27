import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface SurveyInput {
  gender: string;
  age: string;
  stalker_exp: string;
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

  // 1. Send data to Google Forms silently in the background
  try {
    const GFORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf0RF7AwjT0Oz2945cNYuo6MBXOEgIu8ACaUaCHlxSoPH6bzw/formResponse';
    const formPayload = new URLSearchParams();
    formPayload.append('entry.588573645', data.gender);
    formPayload.append('entry.90677174', data.age);
    formPayload.append('entry.1918754234', data.stalker_exp);
    formPayload.append('entry.355598332', data.q1_use_app === 'yes' ? 'はい' : 'いいえ');
    formPayload.append('entry.2146405231', data.q2_why_app);
    formPayload.append('entry.1027558650', data.q3_use_device === 'yes' ? 'はい' : 'いいえ');
    formPayload.append('entry.1691152366', data.q4_why_device);
    formPayload.append('entry.1560845204', data.q5_price);
    formPayload.append('entry.875856758', data.q6_coupon_map);

    const gformRes = await fetch(GFORM_URL, {
      method: 'POST',
      body: formPayload,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (gformRes.ok) {
      console.log('✅ Data submitted to Google Forms successfully!');
    } else {
      console.error('❌ Google Forms returned:', gformRes.status);
    }
  } catch (err) {
    console.error('❌ Google Forms submission failed:', err);
  }

  // 2. Prepare Email Text
  const emailText = `
ヨルミチ ニーズ調査 - アンケート回答
=====================================
【回答者属性】
性別: ${data.gender}
年齢: ${data.age}
ストーカー被害の経験: ${data.stalker_exp}
-------------------------------------
質問1（夜間のルート検索にヨルミチを使いたいか）: ${data.q1_use_app === 'yes' ? 'はい' : 'いいえ'}
質問2（それはなぜですか）: ${data.q2_why_app}
質問3（デバイスを使いたいですか）: ${data.q3_use_device === 'yes' ? 'はい' : 'いいえ'}
質問4（それはなぜですか）: ${data.q4_why_device}
質問5（いくらなら購入したいですか）: ${data.q5_price}
質問6（クーポン連動マップについて）: ${data.q6_coupon_map}
=====================================
送信日時: ${timestamp}
  `;

  console.log('=== NEW SURVEY RESPONSE ===');
  console.log(emailText);
  console.log('===========================');

  // 3. Send Email via Gmail SMTP
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
        to: 'alisslabs.jp@gmail.com',
        subject: 'ヨルミチ ニーズ調査 - アンケート回答',
        text: emailText,
      });

      console.log('✅ Email sent successfully to alisslabs.jp@gmail.com');
    } catch (err) {
      console.error('❌ Email send failed:', err);
    }
  } else {
    console.log('SMTP_USER or SMTP_PASS not set - skipping email');
  }

  // Always return success to the user so they see the Thank You page
  return res.status(200).json({ success: true });
}
