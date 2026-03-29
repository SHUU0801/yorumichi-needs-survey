import type { Request, Response, Express } from "express";
import { randomUUID } from "crypto";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";

type SurveyInput = {
  gender: string;
  age: string;
  stalker_exp: string;
  q1_use_app: "yes" | "no";
  q2_why_app: string;
  q3_use_device: "yes" | "no";
  q4_why_device: string;
  q5_price: string;
  q6_coupon_map: string;
};

type RequestLike = {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  query?: Record<string, unknown>;
  socket?: {
    remoteAddress?: string | null;
  };
};

type ResponseLike = {
  status(code: number): ResponseLike;
  json(payload: unknown): ResponseLike;
  setHeader(name: string, value: string): void;
  end(): ResponseLike | void;
  send(payload: string): ResponseLike;
};

type SurveyFieldKey = keyof SurveyInput;

type SurveyFieldConfig = {
  entryId: string;
  label: string;
  formatValue?: (value: SurveyInput[SurveyFieldKey]) => string;
};

type StoredSurveyResponse = SurveyInput & {
  id: string;
  submittedAt: string;
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
    latitude: string | null;
    longitude: string | null;
  };
};

const GOOGLE_FORM_URL =
  process.env.GOOGLE_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSf0RF7AwjT0Oz2945cNYuo6MBXOEgIu8ACaUaCHlxSoPH6bzw/formResponse";

const SURVEY_CSV_HEADERS = [
  "id",
  "submittedAt",
  "gender",
  "age",
  "stalker_exp",
  "q1_use_app",
  "q2_why_app",
  "q3_use_device",
  "q4_why_device",
  "q5_price",
  "q6_coupon_map",
  "country",
  "region",
  "city",
  "latitude",
  "longitude",
] as const;

const surveyFieldConfigs: Record<SurveyFieldKey, SurveyFieldConfig> = {
  gender: {
    entryId: "entry.588573645",
    label: "性別",
  },
  age: {
    entryId: "entry.90677174",
    label: "年齢",
  },
  stalker_exp: {
    entryId: "entry.1918754234",
    label: "貴方自身や周りの人が付きまとい行為（ストーカー行為）にあったことはありますか？",
  },
  q1_use_app: {
    entryId: "entry.355598332",
    label: "夜間のルート検索をするときにGoogle Mapではなくヨルミチを使いたいと思いますか？",
    formatValue: value => (value === "yes" ? "はい" : "いいえ"),
  },
  q2_why_app: {
    entryId: "entry.2146405231",
    label: "上記のように回答したのはなぜですか？",
  },
  q3_use_device: {
    entryId: "entry.1027558650",
    label: "このヨルミチデバイスを使いたいですか？",
    formatValue: value => (value === "yes" ? "はい" : "いいえ"),
  },
  q4_why_device: {
    entryId: "entry.1691152366",
    label: "上記のように解答したのはなぜですか？",
  },
  q5_price: {
    entryId: "entry.1560845204",
    label: "デバイスはいくらなら購入したいと思いますか？",
  },
  q6_coupon_map: {
    entryId: "entry.875856758",
    label: "クーポン連動マップは、帰り道を変えるきっかけになりますか？",
  },
};

function normalizeMethod(method?: string): string {
  return (method ?? "").toUpperCase();
}

function getHeaderValue(req: RequestLike, name: string): string | null {
  const value = req.headers[name.toLowerCase()];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

function getFormattedSurveyValue<K extends SurveyFieldKey>(key: K, data: SurveyInput): string {
  const rawValue = data[key];
  const config = surveyFieldConfigs[key];
  return config.formatValue ? config.formatValue(rawValue) : rawValue;
}

function buildGoogleFormPayload(data: SurveyInput): URLSearchParams {
  const formPayload = new URLSearchParams();

  (Object.keys(surveyFieldConfigs) as SurveyFieldKey[]).forEach(key => {
    const config = surveyFieldConfigs[key];
    formPayload.append(config.entryId, getFormattedSurveyValue(key, data));
  });

  return formPayload;
}

function buildSurveyEmailText(data: SurveyInput, timestamp: string, geo: StoredSurveyResponse["geo"]): string {
  const orderedKeys: SurveyFieldKey[] = [
    "gender",
    "age",
    "stalker_exp",
    "q1_use_app",
    "q2_why_app",
    "q3_use_device",
    "q4_why_device",
    "q5_price",
    "q6_coupon_map",
  ];

  const lines = orderedKeys.map(key => {
    const config = surveyFieldConfigs[key];
    return `${config.label}: ${getFormattedSurveyValue(key, data)}`;
  });

  lines.push(`推定国: ${geo.country ?? ""}`);
  lines.push(`推定地域コード: ${geo.region ?? ""}`);
  lines.push(`推定市区町村: ${geo.city ?? ""}`);
  lines.push(`推定緯度: ${geo.latitude ?? ""}`);
  lines.push(`推定経度: ${geo.longitude ?? ""}`);

  return `
ヨルミチ ニーズ調査 - アンケート回答
=====================================
${lines.join("\n")}
=====================================
送信日時: ${timestamp}
  `;
}

function getGeoFromRequest(req: RequestLike): StoredSurveyResponse["geo"] {
  return {
    country: getHeaderValue(req, "x-vercel-ip-country"),
    region: getHeaderValue(req, "x-vercel-ip-country-region"),
    city: getHeaderValue(req, "x-vercel-ip-city"),
    latitude: getHeaderValue(req, "x-vercel-ip-latitude"),
    longitude: getHeaderValue(req, "x-vercel-ip-longitude"),
  };
}

function getSurveyCsvPath() {
  if (process.env.SURVEY_CSV_PATH) {
    return process.env.SURVEY_CSV_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/survey-responses.csv";
  }

  return path.join(process.cwd(), "data", "survey-responses.csv");
}

function toSurveyCsvRow(row: StoredSurveyResponse): string {
  return [
    row.id,
    row.submittedAt,
    row.gender,
    row.age,
    row.stalker_exp,
    row.q1_use_app,
    row.q2_why_app,
    row.q3_use_device,
    row.q4_why_device,
    row.q5_price,
    row.q6_coupon_map,
    row.geo.country,
    row.geo.region,
    row.geo.city,
    row.geo.latitude,
    row.geo.longitude,
  ]
    .map(toCsvCell)
    .join(",");
}

async function saveSurveyResponse(response: StoredSurveyResponse) {
  const csvPath = getSurveyCsvPath();
  await mkdir(path.dirname(csvPath), { recursive: true });

  const fileExists = await stat(csvPath)
    .then(() => true)
    .catch(() => false);

  const nextContent = `${fileExists ? "" : `\uFEFF${SURVEY_CSV_HEADERS.map(toCsvCell).join(",")}\n`}${toSurveyCsvRow(response)}\n`;
  await writeFile(csvPath, nextContent, { flag: fileExists ? "a" : "w" });
}

async function readSurveyCsv(): Promise<string> {
  const csvPath = getSurveyCsvPath();
  return readFile(csvPath, "utf8").catch(error => {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === "ENOENT") {
      return `\uFEFF${SURVEY_CSV_HEADERS.map(toCsvCell).join(",")}\n`;
    }
    throw error;
  });
}

function getSurveyInput(body: unknown): SurveyInput {
  const data = (body ?? {}) as Partial<SurveyInput>;

  return {
    gender: data.gender ?? "",
    age: data.age ?? "",
    stalker_exp: data.stalker_exp ?? "",
    q1_use_app: data.q1_use_app === "no" ? "no" : "yes",
    q2_why_app: data.q2_why_app ?? "",
    q3_use_device: data.q3_use_device === "no" ? "no" : "yes",
    q4_why_device: data.q4_why_device ?? "",
    q5_price: data.q5_price ?? "",
    q6_coupon_map: data.q6_coupon_map ?? "",
  };
}

function getExportToken(req: RequestLike): string | null {
  const authHeader = getHeaderValue(req, "authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const queryToken = req.query?.token;
  return typeof queryToken === "string" ? queryToken : null;
}

function toCsvCell(value: unknown): string {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

async function persistToGoogleForms(data: SurveyInput) {
  try {
    const formPayload = buildGoogleFormPayload(data);

    const gformRes = await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body: formPayload,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (gformRes.ok) {
      console.log("✅ Data submitted to Google Forms successfully!");
    } else {
      console.error("❌ Google Forms returned:", gformRes.status);
    }
  } catch (error) {
    console.error("❌ Google Forms submission failed:", error);
  }
}

async function persistToEmail(data: SurveyInput, timestamp: string, geo: StoredSurveyResponse["geo"]) {
  const emailText = buildSurveyEmailText(data, timestamp, geo);

  console.log("=== NEW SURVEY RESPONSE ===");
  console.log(emailText);
  console.log("===========================");

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log("SMTP_USER or SMTP_PASS not set - skipping email");
    return;
  }

  try {
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

    console.log("✅ Email sent successfully to alisslabs.jp@gmail.com");
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
}

export async function surveyHandler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (normalizeMethod(req.method) === "OPTIONS") {
    return res.status(200).end();
  }
  if (normalizeMethod(req.method) !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = getSurveyInput(req.body);
  const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const geo = getGeoFromRequest(req);
  const storedResponse: StoredSurveyResponse = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    ...data,
    geo,
  };

  await Promise.allSettled([
    persistToGoogleForms(data),
    persistToEmail(data, timestamp, geo),
    saveSurveyResponse(storedResponse),
  ]).then(results => {
    results.forEach(result => {
      if (result.status === "rejected") {
        console.error("❌ Survey side-effect failed:", result.reason);
      }
    });
  });

  return res.status(200).json({ success: true, id: storedResponse.id });
}

export async function surveyExportHandler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (normalizeMethod(req.method) === "OPTIONS") {
    return res.status(200).end();
  }
  if (normalizeMethod(req.method) !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedToken = process.env.SURVEY_EXPORT_TOKEN;
  if (!expectedToken) {
    return res.status(503).json({ error: "SURVEY_EXPORT_TOKEN is not configured" });
  }

  const providedToken = getExportToken(req);
  if (!providedToken || providedToken !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const csv = await readSurveyCsv();
    const filename = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("❌ Survey export failed:", error);
    return res.status(500).json({ error: "Failed to export survey responses" });
  }
}

export function registerSurveyRoutes(app: Express, routePrefix = "/api") {
  app.post(`${routePrefix}/survey`, (req: Request, res: Response) => {
    void surveyHandler(req, res);
  });
  app.get(`${routePrefix}/survey-export`, (req: Request, res: Response) => {
    void surveyExportHandler(req, res);
  });
}
