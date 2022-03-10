import { APIChatInputApplicationCommandInteraction, InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { handler } from '../lib/handler';
import { respond } from '../lib/utils';

export default handler((interaction, res) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = interaction as APIChatInputApplicationCommandInteraction
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: command.channel_id
      }
    }, res)
  }
});