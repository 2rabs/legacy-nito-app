import type { NextApiRequest, NextApiResponse } from 'next';
import { lineBotClient } from '@/lib';

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  console.log(req.headers.authorization);
  if (req.headers.authorization !== `Bearer ${process.env.WEBHOOK_SUPABASE_TABLE_SECRET}`) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  try {
    await lineBotClient.broadcast({
      type: 'text',
      text: `次回は ${req.body.record.date} です。\n参加希望の方は LIFF アプリから参加登録をお願いします 🙌`,
    });
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'OK',
  });
}
