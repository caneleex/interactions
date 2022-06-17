import { APIMessageComponentButtonInteraction, MessageFlags, RESTPatchAPIGuildMemberJSONBody, RouteBases, Routes } from 'discord-api-types/v10';
import { handler } from '../lib/handler'
import { defer, followup } from '../lib/utils';
import fetch from 'node-fetch';

export default handler(async (interaction, res) => {
  defer(interaction, true)
  const data = (interaction as APIMessageComponentButtonInteraction).data
  const button_id = data.custom_id
  const member = interaction.member!
  const member_roles = member.roles
  const has_role = member_roles.includes(button_id)
  if (has_role) {
    member_roles.splice(member_roles.indexOf(button_id), 1);
  }
  else {
    member_roles.push(button_id)
  }
  const response = await fetch(`${RouteBases.api}${Routes.guildMember(interaction.guild_id!, member.user.id)}`, {
    method: 'PATCH',
    headers: {'Authorization': process.env.GEOKYLE_TOKEN!, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      roles: member_roles
    } as RESTPatchAPIGuildMemberJSONBody)
  })
  let message: string
  if (!response.ok) {
    message = `❌ There was an error while toggling your role: ${response.status}`
  }
  else {
    if (has_role) {
      message = `Successfully removed role <@&${button_id}> from you.`
    }
    else {
      message = `Successfully added role <@&${button_id}> to you.`
    }
  }
  followup({
    content: message,
    flags: MessageFlags.Ephemeral
  }, interaction, res)
});