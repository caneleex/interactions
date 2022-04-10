import { VercelRequest, VercelResponse } from '@vercel/node';
import { get_invite_url } from '../../lib/utils'

export default async function (req: VercelRequest, res: VercelResponse) {
  res.send(await get_invite_url())
}