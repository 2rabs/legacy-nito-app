import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { LiffProvider } from "@/components/LiffProvider";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <UserProvider supabaseClient={supabaseClient}>
        <LiffProvider>
          <Component {...pageProps} />
        </LiffProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
