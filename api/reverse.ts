import { APIUserApplicationCommandInteraction, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { handler } from '../lib/handler';
import { respond } from '../lib/utils';

const google_url = (url: string) => `https://www.google.com/searchbyimage?image_url=${url}`
const cdn_url = (endpoint: string) => `https://cdn.discordapp.com/${endpoint}?size=2048`
const default_url = (type: number) => `embed/avatars/${type}.png`
const avatar_url = (id: string, hash: string, ext: string) => `avatars/${id}/${hash}${ext}`

export default handler((interaction, res) => {
    const contextMenu = interaction as APIUserApplicationCommandInteraction
    const data = contextMenu.data
    const user = data.resolved.users[data.target_id]
    const user_id = user.id
    const avatar = user.avatar
    let url: string
    if (avatar === null) {
        url = default_url(+user.discriminator % 5)
    }
    else {
        url = avatar_url(user.id, avatar, avatar.startsWith('_a') ? '.gif' : '.png')
    }
    const reverse_url = google_url(cdn_url(url))
    respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `Click the button below to reverse search <@${user_id}>'s avatar.`,
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
                            url: `${reverse_url}`
                        }
                    ]
                }
            ]
        }
    }, res)
});