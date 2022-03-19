import { VercelRequest, VercelResponse } from '@vercel/node';
import { APIInteraction, InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { respond } from '../lib/utils';

export function handler(
  fn: (interaction: APIInteraction, res: VercelResponse) => void | Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const signature = req.headers['x-signature-ed25519'] as string
    const timestamp = req.headers['x-signature-timestamp'] as string
    if (!signature || !timestamp) {
      return res.redirect('https://github.com/caneleex');
    }
    const body = req.body
    const url = req.url
    const endpoint = url.substring(url.lastIndexOf('/') + 1).toUpperCase() // PagMan
    if (!verifyKey(JSON.stringify(body), signature, timestamp, process.env[endpoint + '_PUB_KEY'])) {
      return res.status(401).send(null);
    }
    const interaction = body as APIInteraction
    if (interaction.type === InteractionType.Ping) {
      return respond({
        type: InteractionResponseType.Pong
      }, res)
    }
    fn(interaction, res);
  };
}