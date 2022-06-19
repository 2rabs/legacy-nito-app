import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/ui";
import { useLiff } from "@/components/LiffProvider";
import useUser from "@/hooks/user";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";

const Login: NextPage = () => {
  const { nickname } = useLiff();

  const { user, error } = useSupabaseUser();
  const { user: projectUser, userParticipationSchedule } = useUser();

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
          { nickname && <p>LINE Nickname: {nickname}</p> }
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

      <button onClick={ () => supabaseClient.auth.signOut() }>Sign out</button>

      { projectUser && <p>UserName: { projectUser.nickname }</p> }

      { userParticipationSchedule && <>
          <p>UserParticipationSchedule</p>
          <pre>{ JSON.stringify(userParticipationSchedule, null, 2) }</pre>
      </> }
    </div>
  );
};

export default Login;
