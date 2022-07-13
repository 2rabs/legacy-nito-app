import { Liff } from '@line/liff';
import React, { createContext, useContext, useEffect, useState } from 'react';

declare type LiffState = {
  liff: Liff | null;
  userId: string | undefined;
  nickname: string | undefined;
  email: string | undefined;
  error?: Error;
};

const LiffContext = createContext<LiffState | undefined>(undefined);

export interface Props {}

export const LiffProvider = (props: Props) => {
  if (!process.env.NEXT_PUBLIC_LIFF_ID) {
    throw new Error('NEXT_PUBLIC_LIFF_ID env variables are required!');
  }

  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    import('@line/liff')
      .then((liff) => liff.default)
      .then((liff) => {
        console.log('LIFF init...');
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log('LIFF init succeeded.');
            setLiffObject(liff);

            if (!liff.isLoggedIn()) return;

            const payload = liff.getDecodedIDToken();

            if (payload) {
              setEmail(payload.email);
            }

            liff.getProfile().then((profile) => {
              setUserId(profile.userId);
              setNickname(profile.displayName);
            });
          })
          .catch((error: Error) => {
            console.log('LIFF init failed.');
            setLiffError(error.toString());
          });
      });
  }, []);

  const value = {
    liff: liffObject,
    userId,
    nickname,
    email,
    liffError,
  };
  return (
    <LiffContext.Provider
      value={value}
      {...props}
    />
  );
};

export const useLiff: () => LiffState = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error(`useLiff must be used within a LiffProvider.`);
  }
  return context;
};
