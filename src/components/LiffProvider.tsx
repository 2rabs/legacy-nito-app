import React, { createContext, useContext, useEffect, useState } from "react";
import { Liff } from "@line/liff";

declare type LiffState = {
  liff: Liff | null;
  error?: Error;
};

const LiffContext = createContext<LiffState | undefined>(undefined);

export interface Props {

}

export const LiffProvider = (props: Props) => {
  if (!process.env.NEXT_PUBLIC_LIFF_ID) {
    throw new Error(
      'NEXT_PUBLIC_LIFF_ID env variables are required!'
    );
  }

  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({liffId: process.env.NEXT_PUBLIC_LIFF_ID!})
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  const value = {
    liff: liffObject,
    liffError,
  };
  return <LiffContext.Provider value={value} {...props} />;
}

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error(`useLiff must be used within a LiffProvider.`);
  }
  return context;
};
