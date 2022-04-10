import { APIMessageComponentButtonInteraction, InteractionResponseType, MessageFlags, RESTPatchAPIGuildMemberJSONBody, RouteBases, Routes } from 'discord-api-types/v10';
import { handler } from '../../lib/handler'
import { respond } from '../../lib/utils';
import fetch from 'node-fetch';

export default handler(async (interaction, res) => {
  const data = (interaction as APIMessageComponentButtonInteraction).data
  const button_id = data.custom_id
  const member = interaction.member
  const member_roles = interaction.member.roles
  const hasRole = member_roles.includes(button_id)
  if (hasRole) {
    member_roles.splice(member_roles.indexOf(button_id), 1);
  }
  else {
    member_roles.push(button_id)
  }
  const response = await fetch(`${RouteBases.api}${Routes.guildMember(interaction.guild_id, member.user.id)}`, {
    method: 'PATCH',
    headers: {'Authorization': process.env.GEOKYLE_TOKEN, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      roles: member_roles
    } as RESTPatchAPIGuildMemberJSONBody)
  })
  let message: string
  if (!response.ok) {
    message = `❌ There was an error while toggling your role: ${response.status}`
  }
  else {
    if (hasRole) {
      message = `Successfully removed role <@&${button_id}> from you.`
    }
    else {
      message = `Successfully added role <@&${button_id}> to you.`
    }
  }
  respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: message,
      flags: MessageFlags.Ephemeral
    }
  }, res)
});