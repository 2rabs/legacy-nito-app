import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useLiff } from "@/components/LiffProvider";

const Login: NextPage = () => {
  const { liff, error } = useLiff();

  return (
    <div>
      <Head>
        <title>NITO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline">create-liff-app</h1>
        {liff && <p>LIFF init succeeded.</p>}
        {error && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{error.message}</code>
            </p>
          </>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
};

export default Login;
