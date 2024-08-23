import axios from 'axios';
import { format } from 'date-fns';

interface Error {
  name: string;
  stack: string;
  message: string;
}

export interface DiscordMessage {
  content?: string;
  avatar_url?: string;
  embeds: DiscordEmbed[];
}

export interface DiscordEmbed {
  title: string;
  color: number;
  description: string;
  fields?: DiscordEmbedField[];
}

export interface DiscordEmbedField {
  name: string;
  value: string;
}

class DiscordUtils {
  private static url = process.env.DISCORD_WEBHOOK;

  static async sendErrorMessage(error: Error) {
    await DiscordUtils.sendMessage({
      embeds: [
        {
          title: 'Detalhes do Erro',
          color: 16711680,
          description: error.name ?? 'Sem descrição',
          fields: [
            {
              name: 'Mensagem de Erro',
              value: error.message ?? '',
            },
            {
              name: 'Stack Trace',
              value: `\`\`\`${JSON.stringify(error.stack ?? {})}\`\`\``,
            },
          ],
        },
      ],
    });
  }

  static async sendStartMessage() {
    await DiscordUtils.sendMessage({
      embeds: [
        {
          title: 'Servidor iniciou com sucesso',
          color: 0x00ff00,
          description: format(new Date(), 'dd/MM/yyyy HH:mm'),
        },
      ],
    });
  }

  static async sendMessage(message: DiscordMessage) {
    try {
      if (DiscordUtils.url) {
        return axios.post(DiscordUtils.url, {
          ...message,
          avatar_url:
            'https://pbs.twimg.com/profile_images/1701356759812554752/Ya-XMqEe_400x400.jpg',
        });
      }
    } catch (e) {
      console.log('[DISCORD] Error on send message: ', e);
    }
  }
}

export { DiscordUtils };
