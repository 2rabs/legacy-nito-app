import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useLiff } from "@/hooks/core/liff";
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { liffObject, liffError } = useLiff(process.env.NEXT_PUBLIC_LIFF_ID!);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <>
      <UserProvider supabaseClient={supabaseClient}>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
