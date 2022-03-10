import { VercelResponse } from "@vercel/node";
import { APIInteractionResponse } from "discord-api-types/v10";

export const respond = (response: APIInteractionResponse, res: VercelResponse) =>
  res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response))