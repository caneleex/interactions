import { APIApplicationCommandInteractionData, APIChatInputApplicationCommandInteraction, APIUser, APIUserApplicationCommandInteraction, InteractionResponseType, MessageFlags, RouteBases } from 'discord-api-types/v10';
import { handler } from '../lib/handler';
import { get_context_menu_target_user, get_user_option, respond } from '../lib/utils';

const google_url = (url: string) => `https://www.google.com/searchbyimage?image_url=${url}`
const cdn_url = (endpoint: string) => `${RouteBases.cdn}/${endpoint}?size=2048`
const default_url = (type: number) => `embed/avatars/${type}.png`
const avatar_url = (id: string, hash: string, ext: string) => `avatars/${id}/${hash}.${ext}`

export default handler((interaction, res) => {
  const interaction_data = interaction.data as APIApplicationCommandInteractionData
  const command = interaction_data.name
  let user: APIUser
  if (command === 'reverse') {
    user = get_user_option(interaction as APIChatInputApplicationCommandInteraction, 'user')
  }
  else if (command === 'Reverse Avatar Search') {
    user = get_context_menu_target_user(interaction as APIUserApplicationCommandInteraction)
  }
  respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Click the button below to reverse search <@${user.id}>'s avatar.`,
      flags: MessageFlags.Ephemeral,
      allowed_mentions: {
        parse: []
      },
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Open reverse image search',
              style: 5,
              url: `${get_reverse_url(user)}`
            }
          ]
        }
      ]
    }
  }, res)
});

function get_reverse_url(user: APIUser): string {
  const avatar = user.avatar
  let url: string
  if (avatar === null) {
    url = default_url(+user.discriminator % 5)
  }
  else {
    url = avatar_url(user.id, avatar, avatar.startsWith('a_') ? 'gif' : 'png')
  }
  return google_url(cdn_url(url))
}