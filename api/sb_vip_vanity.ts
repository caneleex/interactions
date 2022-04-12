import { handler } from '../lib/handler';
import { followup, get_string_option } from '../lib/utils';
import { CFMetadataResponse } from '../lib/types'
import fetch from 'node-fetch';
import FormData from 'form-data'
import { APIChatInputApplicationCommandInteraction, MessageFlags, RESTPostAPIInteractionCallbackJSONBody, RouteBases, Routes } from 'discord-api-types/v10';

const metadata_api_url = (key: string) => `https://api.cloudflare.com/client/v4/accounts/6dccc8a823380a32fe8792904b2cd886/storage/kv/namespaces/b44b93e4cc174443aca099a3763b29ff/metadata/${key}`
const value_api_url = (key: string) => `https://api.cloudflare.com/client/v4/accounts/6dccc8a823380a32fe8792904b2cd886/storage/kv/namespaces/b44b93e4cc174443aca099a3763b29ff/values/${key}`
const public_id_regex = new RegExp(/^[a-f0-9]{64}$/);

export default handler(async (interaction, res) => {
  await fetch(`${RouteBases.api}${Routes.interactionCallback(interaction.id, interaction.token)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      type: 5,
      data: {
        flags: MessageFlags.Ephemeral
      }
    } as RESTPostAPIInteractionCallbackJSONBody)
  })
  const slash_command = interaction as APIChatInputApplicationCommandInteraction
  const vanity = get_string_option(slash_command, 'vanity').toLowerCase()
  const metadata_response = await fetch(metadata_api_url(vanity), {
    method: 'GET',
    headers: {'Authorization': process.env.CF_TOKEN}
  })
  const user_id = interaction.member.user.id
  if (metadata_response.ok) {
    const cf_response = await metadata_response.json() as CFMetadataResponse
    if (cf_response.result.id !== user_id) {
      followup({
        content: 'This vanity is already taken.'
      }, interaction, res)
      return
    }
  }
  const sb_user_id = get_string_option(slash_command, 'sb_user_id')
  if (!public_id_regex.test(sb_user_id)) {
    followup({
      content: 'Provided user id is not a valid public user id.',
    }, interaction, res)
    return
  }
  const form_data = new FormData()
  form_data.append('value', sb_user_id)
  form_data.append('metadata', JSON.stringify({
    id: user_id
  }))
  const value_response = await fetch(value_api_url(vanity), {
    method: 'PUT',
    headers: {'Authorization': process.env.CF_TOKEN},
    body: form_data
  })
  if (value_response.ok) {
    followup({
      content: `Vanity \`${vanity}\` associated with user id \`${sb_user_id}\` has been successfully added.`
    }, interaction, res)
  }
});