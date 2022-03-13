import { VercelResponse } from "@vercel/node";
import { APIApplicationCommandInteractionDataBasicOption, APIChatInputApplicationCommandInteraction, APIInteractionResponse, APIMessage, APIMessageApplicationCommandInteraction, APIUser, APIUserApplicationCommandInteraction } from "discord-api-types/v10";

export const respond = (response: APIInteractionResponse, res: VercelResponse) =>
res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response))

export function get_user_option(interaction: APIChatInputApplicationCommandInteraction, name: string): APIUser | undefined {
  return interaction.data.resolved.users[get_option(interaction, name) as string]
}

export function get_boolean_option(interaction: APIChatInputApplicationCommandInteraction, name: string): boolean | undefined {
  return get_option(interaction, name) as boolean
}

export function get_context_menu_target_user(interaction: APIUserApplicationCommandInteraction): APIUser {
  const data = interaction.data
  return data.resolved.users[data.target_id]
}

export function get_context_menu_target_message(interaction: APIMessageApplicationCommandInteraction): APIMessage {
  const data = interaction.data
  return data.resolved.messages[data.target_id]
}

function get_option(interaction: APIChatInputApplicationCommandInteraction, name: string): any | undefined {
  const options = interaction.data.options
  if (!options) {
    return undefined
  }
  return (Object.values(options).find(option => option.name === name) as APIApplicationCommandInteractionDataBasicOption)?.value
}