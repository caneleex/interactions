import { VercelResponse } from "@vercel/node";
import { APIApplicationCommandInteractionDataBasicOption, APIChatInputApplicationCommandInteraction, APIInteractionResponse, APIMessage, APIMessageApplicationCommandInteraction, APIUser, APIUserApplicationCommandInteraction, RESTGetAPIOAuth2CurrentApplicationResult, RouteBases, Routes } from "discord-api-types/v10";
import fetch from 'node-fetch'

const invite_url = (id: string, permissions: string) => `https://discord.com/oauth2/authorize?client_id=${id}&permissions=${permissions}&scope=bot+applications.commands`

// interactions

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

// other

export async function get_invite_url(): Promise<string> {
  const response = await fetch(`${RouteBases.api}${Routes.oauth2CurrentApplication()}`, {
    method: 'GET',
    headers: {'Authorization': process.env.SPIDEY_TOKEN}
  })
  const appResponse = await response.json() as RESTGetAPIOAuth2CurrentApplicationResult
  return invite_url(appResponse.id, appResponse.install_params.permissions)
}