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
  if (req.query.secret !== process.env.WEBHOOK_SUPABASE_TABLE_SECRET) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  const client = new LineBotClient(config);

  try {
    await client.pushMessage(process.env.LINE_ADMIN_GROUP_ID!, {
      type: 'text',
      text: `${req.body.record.nickname} さんがメンバーに加わりました 🎉`,
    });
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'OK',
  });
}
