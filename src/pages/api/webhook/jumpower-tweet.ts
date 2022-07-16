import type { NextApiRequest, NextApiResponse } from 'next';

const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_MESSAGING_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_MESSAGING_CHANNEL_SECRET,
};

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.body.secret !== process.env.WEBHOOK_JUMPOWER_TWEET_SECRET) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  const client = new line.Client(config);

  try {
    await client.pushMessage(process.env.LINE_ADMIN_GROUP_ID, [
      {
        type: 'text',
        text: 'ジャンパワーの新しいツイートを受信しました。',
      },
      {
        type: 'text',
        text: req.body.tweet.text,
      },
      {
        type: 'text',
        text: req.body.tweet.linkToTweet,
      },
    ]);
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'OK',
  });
}
