import { Client as LineBotClient } from '@line/bot-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const config = {
  channelAccessToken: process.env.LINE_MESSAGING_CHANNEL_TOKEN!,
  channelSecret: process.env.LINE_MESSAGING_CHANNEL_SECRET!,
};

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.body.secret !== process.env.API_TOKEN) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  const messageText = req.body.messageText ?? '';
  const notificationDisabled = req.body.notificationDisabled ?? false;

  const client = new LineBotClient(config);

  try {
    await client.broadcast(
      {
        type: 'text',
        text: messageText,
      },
      notificationDisabled,
    );
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'OK',
  });
}
