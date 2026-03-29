import type { VercelRequest, VercelResponse } from "@vercel/node";
import { surveyExportHandler } from "../server/surveyHandlers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return surveyExportHandler(req, res);
}
