import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useLiff } from "@/hooks/core/liff";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { liffObject, liffError } = useLiff(process.env.NEXT_PUBLIC_LIFF_ID!);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
