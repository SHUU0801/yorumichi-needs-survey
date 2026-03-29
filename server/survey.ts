import type { Express, Request, Response } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";

const surveySchema = z.object({
  gender: z.string().min(1),
  age: z.string().min(1),
  stalker_exp: z.string().min(1),
  q1_use_app: z.enum(["yes", "no"]),
  q2_why_app: z.string().min(1),
  q3_use_device: z.enum(["yes", "no"]),
  q4_why_device: z.string().min(1),
  q5_price: z.string().min(1),
  q6_coupon_map: z.string().min(1),
});

type SurveyInput = z.infer<typeof surveySchema>;

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf0RF7AwjT0Oz2945cNYuo6MBXOEgIu8ACaUaCHlxSoPH6bzw/formResponse";

export function registerSurveyRoute(app: Express) {
  app.options("/api/survey", (_req, res) => {
    res.status(200).end();
  });

  app.post("/api/survey", async (req, res) => {
    const parsed = surveySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid survey payload",
        details: parsed.error.flatten(),
      });
    }

    try {
      await submitSurvey(parsed.data);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Survey submission failed:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to submit survey",
      });
    }
  });
}

async function submitSurvey(data: SurveyInput) {
  const timestamp = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const emailText = formatSurveyEmail(data, timestamp);

  await submitToGoogleForms(data);

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    await sendViaResend(emailText, resendApiKey);
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    await sendViaSmtp(emailText, smtpUser, smtpPass);
    return;
  }

  console.log("Survey email delivery skipped because no mail provider is configured");
  console.log(emailText);
}

async function submitToGoogleForms(data: SurveyInput) {
  const formPayload = new URLSearchParams();
  formPayload.append("entry.588573645", data.gender);
  formPayload.append("entry.90677174", data.age);
  formPayload.append("entry.1918754234", data.stalker_exp);
  formPayload.append("entry.355598332", data.q1_use_app === "yes" ? "はい" : "いいえ");
  formPayload.append("entry.2146405231", data.q2_why_app);
  formPayload.append("entry.1027558650", data.q3_use_device === "yes" ? "はい" : "いいえ");
  formPayload.append("entry.1691152366", data.q4_why_device);
  formPayload.append("entry.1560845204", data.q5_price);
  formPayload.append("entry.875856758", data.q6_coupon_map);

  const response = await fetch(GOOGLE_FORM_URL, {
    method: "POST",
    body: formPayload,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    throw new Error(`Google Forms returned status ${response.status}`);
  }
}

async function sendViaResend(emailText: string, apiKey: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "YORUMICHI Survey <onboarding@resend.dev>",
      to: ["alisslabs.jp@gmail.com"],
      subject: "ヨルミチ ニーズ調査 - アンケート回答",
      text: emailText,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
}

async function sendViaSmtp(emailText: string, smtpUser: string, smtpPass: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"YORUMICHI Survey" <${smtpUser}>`,
    to: "alisslabs.jp@gmail.com",
    subject: "ヨルミチ ニーズ調査 - アンケート回答",
    text: emailText,
  });
}

function formatSurveyEmail(data: SurveyInput, timestamp: string) {
  return `
ヨルミチ ニーズ調査 - アンケート回答
=====================================
【回答者属性】
性別: ${data.gender}
年齢: ${data.age}
ストーカー被害の経験: ${data.stalker_exp}
-------------------------------------
質問1（夜間のルート検索にヨルミチを使いたいか）: ${data.q1_use_app === "yes" ? "はい" : "いいえ"}
質問2（それはなぜですか）: ${data.q2_why_app}
質問3（デバイスを使いたいですか）: ${data.q3_use_device === "yes" ? "はい" : "いいえ"}
質問4（それはなぜですか）: ${data.q4_why_device}
質問5（いくらなら購入したいですか）: ${data.q5_price}
質問6（クーポン連動マップについて）: ${data.q6_coupon_map}
=====================================
送信日時: ${timestamp}
  `;
}
