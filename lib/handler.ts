import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyKey } from 'discord-interactions';
import { APIPingInteraction } from 'discord-api-types/payloads/v9/_interactions/ping'
import { APIApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType, InteractionType } from 'discord-api-types/v9';

export function handler(
  fn: (req: VercelRequest, res: VercelResponse) => void | Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const signature = req.headers['x-signature-ed25519'] as string
    const timestamp = req.headers['x-signature-timestamp'] as string
    if (!signature || !timestamp) {
      return sendUnauthorized(res);
    }
    const body = req.body
    if (!verifyKey(JSON.stringify(body), signature, timestamp, process.env.INVALIDATOR_PUB_KEY)) {
      return sendUnauthorized(res);
    }
    const interaction = body as APIPingInteraction | APIApplicationCommandInteraction
    if (interaction.type === InteractionType.Ping) {
      return respond({
        type: InteractionResponseType.Pong
      }, res)
    }
    fn(req, res);
  };
}

function sendUnauthorized(res: VercelResponse): VercelResponse {
  return res.status(401).send(null)
}

const respond = (response: APIInteractionResponse, res: VercelResponse) =>
  res.send(JSON.stringify(response)).setHeader('Content-Type', 'application/json')