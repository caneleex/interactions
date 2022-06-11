import { VercelResponse } from "@vercel/node";
import { APIApplicationCommandInteractionDataBasicOption, APIChatInputApplicationCommandInteraction, APIInteraction, APIInteractionResponse, APIInteractionResponseCallbackData, APIMessage, APIMessageApplicationCommandInteraction, APIUser, APIUserApplicationCommandInteraction, MessageFlags, RESTPostAPIInteractionCallbackJSONBody, RouteBases, Routes } from "discord-api-types/v10";
import fetch from 'node-fetch';

export const respond = (response: APIInteractionResponse, res: VercelResponse) => res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response))
export const defer = async (interaction: APIInteraction, ephemeral: boolean) => {
  await fetch(`${RouteBases.api}${Routes.interactionCallback(interaction.id, interaction.token)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      type: 5,
      data: {
        flags: ephemeral ? MessageFlags.Ephemeral : 0
      }
    } as RESTPostAPIInteractionCallbackJSONBody)
  })
}
export const followup = async (response: APIInteractionResponseCallbackData, interaction: APIInteraction, res: VercelResponse) => {
  await fetch(`${RouteBases.api}${Routes.webhook(interaction.application_id, interaction.token)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(response)
  })
  res.status(204).send(null)
}

export function get_string_option(interaction: APIChatInputApplicationCommandInteraction, name: string): string | undefined {
  return get_option(interaction, name) as string
}

export function get_user_option(interaction: APIChatInputApplicationCommandInteraction, name: string): APIUser | undefined {
  return interaction.data!.resolved!.users![get_string_option(interaction, name)!]
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