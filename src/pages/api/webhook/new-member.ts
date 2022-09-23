import type { NextApiRequest, NextApiResponse } from 'next';
import { lineBotClient } from '@/lib';

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.query.secret !== process.env.WEBHOOK_SUPABASE_TABLE_SECRET) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  try {
    await lineBotClient.pushMessage(process.env.LINE_ADMIN_GROUP_ID!, {
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
