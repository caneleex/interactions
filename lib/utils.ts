import { VercelResponse } from "@vercel/node";
import { APIApplicationCommandInteractionDataBasicOption, APIChatInputApplicationCommandInteraction, APIInteractionResponse, APIUser, APIUserApplicationCommandInteraction } from "discord-api-types/v10";

export const respond = (response: APIInteractionResponse, res: VercelResponse) =>
  res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response))

export function get_user_option(interaction: APIChatInputApplicationCommandInteraction, name: string): APIUser {
  return interaction.data.resolved.users[get_option(interaction, name) as string]
}

export function get_context_menu_target_user(interaction: APIUserApplicationCommandInteraction) {
  const data = interaction.data
  return data.resolved.users[data.target_id]
}

function get_option(interaction: APIChatInputApplicationCommandInteraction, name: string) {
  return (Object.values(interaction.data.options).find(option => option.name === name) as APIApplicationCommandInteractionDataBasicOption).value
}