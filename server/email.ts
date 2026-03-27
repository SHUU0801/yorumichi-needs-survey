interface SurveyInput {
  q1_use_app: 'yes' | 'no';
  q2_why_app: string;
  q3_use_device: 'yes' | 'no';
  q4_why_device: string;
  q5_price: string;
  q6_coupon_map: string;
}

export async function sendSurveyEmail(surveyData: SurveyInput): Promise<void> {
  const emailContent = formatSurveyEmailPlainText(surveyData);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    throw new Error('Email configuration missing');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'YORUMICHI Survey <onboarding@resend.dev>',
      to: ['alisslab.jp@gmail.com'],
      subject: 'ヨルミチ ニーズ調査 - アンケート回答',
      text: emailContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }

  const data = await response.json();
  console.log('Survey email sent successfully:', data);
}

function formatSurveyEmailPlainText(data: SurveyInput): string {
  const timestamp = new Date().toLocaleString('ja-JP');

  return `
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
© 2026 YORUMICHI Project
  `;
}
