import type { NextApiRequest, NextApiResponse } from 'next';
import { lineBotClient } from '@/lib';

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.body.secret !== process.env.WEBHOOK_JUMPOWER_TWEET_SECRET) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  try {
    await lineBotClient.pushMessage(process.env.LINE_ADMIN_GROUP_ID!, {
      type: 'text',
      text: `ジャンパワーの新しいツイートを受信しました。\n\n${req.body.tweet.text}\n\n${req.body.tweet.linkToTweet}`,
    });
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'OK',
  });
}
