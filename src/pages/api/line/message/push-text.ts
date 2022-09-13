import type { NextApiRequest, NextApiResponse } from 'next';
import { lineBotClient } from '@/lib';

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.body.secret !== process.env.API_TOKEN) {
    return res.status(401).json({ message: 'Your secret is invalid !' });
  }

  const lineId = req.body.lineId;
  const messageText = req.body.messageText ?? '';
  const notificationDisabled = req.body.notificationDisabled ?? false;

  if (!lineId) {
    return res.status(401).json({ message: 'LineId is required !' });
  }

  try {
    await lineBotClient.pushMessage(
      lineId,
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
