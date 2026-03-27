import nodemailer from "nodemailer";

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

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE !== "false", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"YORUMICHI Needs Survey" <${process.env.SMTP_USER || "noreply@yorumichi-survey.com"}>`,
      to: 'alisslab.jp@gmail.com',
      subject: 'ヨルミチ ニーズ調査 - アンケート回答',
      text: emailContent,
    });

    console.log('Survey email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending survey email:', error);
    throw error;
  }
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
