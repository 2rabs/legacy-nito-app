import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/ui";
import { useLiff } from "@/components/LiffProvider";

const Login: NextPage = () => {
  const { nickname } = useLiff();

  const { user, error } = useUser();
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*');
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) {
      loadData();
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <Head>
          <title>NITO</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={ styles.main }>
          { error && <p>{ error.message }</p> }
          { nickname && <p>`$LINE Nickname: {nickname}`</p> }
          <Auth
            supabaseClient={ supabaseClient }
            // providers={ ['google'] }
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>NITO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Login;
