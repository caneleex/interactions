import { APIChatInputApplicationCommandInteraction, InteractionResponseType, RESTPatchAPIGuildMemberJSONBody, RouteBases, Routes } from 'discord-api-types/v10';
import { handler } from '../../lib/handler';
import { get_boolean_option, respond } from '../../lib/utils';
import fetch from 'node-fetch'

const survive_template = (mention: string) => `The trigger is pulled. ${mention} survives!`
const death_template = (mention: string, expiration: number) => `The trigger is pulled. A bullet fired. Bye, ${mention}. We'll see you <t:${expiration}:R>.`
const max_timeout_basic_seconds = 1800
const max_timeout_extreme_seconds = 10800

export default handler(async (interaction, res) => {
  const guild_id = interaction.guild_id
  if (!guild_id) {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ This command is only available in servers.'
      }
    }, res)
    return
  }
  const survive = Math.random() < 0.5
  const mention = `<@${interaction.member.user.id}>`
  if (survive) {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: survive_template(mention),
        allowed_mentions: {
          parse: []
        }
      }
    }, res)
    return
  }
  const slash_command = interaction as APIChatInputApplicationCommandInteraction
  const max_timeout_duration = get_boolean_option(slash_command, 'extreme') ? max_timeout_extreme_seconds : max_timeout_basic_seconds
  const timeout_duration = Math.floor(Math.random() * ((max_timeout_duration + 1) - 1) + 1)
  const date = new Date()
  date.setTime(date.getTime() + timeout_duration * 1000)
  const response = await fetch(`${RouteBases.api}${Routes.guildMember(guild_id, interaction.member.user.id)}`, {
    method: 'PATCH',
    headers: {'Authorization': process.env.RUSSIAN_ROULETTE_TOKEN, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      communication_disabled_until: date.toISOString()
    } as RESTPatchAPIGuildMemberJSONBody)
  })
  if (response.ok) {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `${death_template(mention, Math.floor(date.getTime() / 1000))}`,
        allowed_mentions: {
          parse: []
        }
      }
    }, res)
  }
  else {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ An error occurred. I might not have the "Timeout Members" permission or your highest role is higher than mine.'
      }
    }, res)
  }
});