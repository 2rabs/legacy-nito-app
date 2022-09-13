import { Client as LineBotClient } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_MESSAGING_CHANNEL_TOKEN!,
  channelSecret: process.env.LINE_MESSAGING_CHANNEL_SECRET!,
};

export const lineBotClient = new LineBotClient(config);
