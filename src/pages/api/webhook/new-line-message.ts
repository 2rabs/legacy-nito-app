import { WebhookEvent } from '@line/bot-sdk';
import { MessageEvent, TextEventMessage, User, WebhookRequestBody } from '@line/bot-sdk/lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

type Message = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  console.log(JSON.stringify(req.body));

  const createSuccessResponse = () => {
    res.json({
      message: 'OK',
    });
  };

  const validationResult = validate(req.body);
  if (validationResult.type === 'error') {
    createSuccessResponse();
    return;
  }
  console.log(validationResult);

  const { user, message } = validationResult;

  const { data: member, error: searchMemberError } = await supabase
    .from('members')
    .select('id, nickname')
    .eq('line_id', user.userId)
    .single();

  console.log(member);

  if (searchMemberError) {
    createSuccessResponse();
    return;
  }

  const { error: insertMessageError } = await supabase.from('messages').insert({
    member_id: member.id,
    message: message.text,
  });

  console.log(insertMessageError);

  if (insertMessageError) {
    createSuccessResponse();
    return;
  }

  res.json({
    message: 'OK',
  });
}

type BaseValidationResult = {
  type: 'ok' | 'error';
};

type ValidationResult = ValidationResultOk | ValidationResultError;

type ValidationResultOk = {
  type: 'ok';
  user: User;
  message: TextEventMessage;
} & BaseValidationResult;

type ValidationResultError = {
  type: 'error';
} & BaseValidationResult;

const validate: (body: WebhookRequestBody) => ValidationResult = (body) => {
  const firstMessageEvent = body.events.find((event: WebhookEvent) => event.type === 'message');

  // NOTE: メッセージイベント以外の場合は何もしない
  if (!firstMessageEvent) {
    return {
      type: 'error',
    };
  }

  const messageEvent = firstMessageEvent as MessageEvent;
  // 送信者がユーザー以外の場合
  if (messageEvent.source.type !== 'user') {
    return {
      type: 'error',
    };
  }
  // メッセージタイプがテキスト以外の場合
  if (messageEvent.message.type !== 'text') {
    return {
      type: 'error',
    };
  }

  return {
    type: 'ok',
    user: messageEvent.source,
    message: messageEvent.message,
  };
};
