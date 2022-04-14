import { APIMessageApplicationCommandInteraction, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { handler } from '../lib/handler';
import { defer, followup, get_context_menu_target_message, respond } from '../lib/utils';
import { GistResponse, TokenPayload } from '../lib/types';
import fetch from 'node-fetch';

const token_regex = new RegExp('[A-Za-z\\d]{24}\\.[\\w-]{6}\\.[\\w-]{27}', 'g')
const gist_url = 'https://api.github.com/gists'

export default handler(async (interaction, res) => {
  const message = get_context_menu_target_message(interaction as APIMessageApplicationCommandInteraction)
  let tokens = message.content.match(token_regex)
  if (!tokens) {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'No tokens were found in the targeted message.',
        flags: MessageFlags.Ephemeral
      }
    }, res)
    return
  }
  defer(interaction)
  const payload: TokenPayload = {
    files: {
      'tokens.txt': {
        content: `${tokens.join("\n")}`
      }
    },
    description: 'Token Invalidator Bot by cane#8081.',
    public: true
  }
  const response = await fetch(gist_url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {'Authorization': process.env.GIST_TOKEN, 'Content-Type': 'application/vnd.github.v3+json', 'User-Agent': 'Token Invalidator Bot'}
  })
  const gistResponse = await response.json() as GistResponse
  followup({
    content: `The tokens have been sent to <${gistResponse.html_url}> to be invalidated.`,
    flags: MessageFlags.SuppressEmbeds // TODO this has no effect right now
  }, interaction, res)
});