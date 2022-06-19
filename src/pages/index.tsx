import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/ui";
import { useLiff } from "@/components/LiffProvider";

interface ProjectUser {
  userId: number;
  lineId: string | null;
  nickname: string;
}

const Login: NextPage = () => {
  const { nickname } = useLiff();

  const { user, error } = useUser();

  const [
    projectUser,
    setProjectUser
  ] = useState<ProjectUser | undefined>(undefined);

  const [
    userParticipationSchedule,
    setUserParticipationSchedule
  ] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    async function fetchProjectUser() {
      if (!user) return;

      const { data } = await supabaseClient
        .from('users')
        .select('*')
        .eq('uuid', user.id);

      if (data) {
        const user = data[0];
        setProjectUser({
          userId: Number(user['id']),
          lineId: user['line_id'],
          nickname: user['nickname'],
        });
      }
    }

    if (user) {
      fetchProjectUser();
    }
  }, [user]);

  useEffect(() => {
    async function fetchUserParticipationSchedule() {
      if (!projectUser) return;

      const { data } = await supabaseClient
        .from('user_participation_schedule')
        .select('*')
        .eq('user_id', projectUser.userId);

      if (data) {
        setUserParticipationSchedule(data);
      }
    }

    if (projectUser) {
      fetchUserParticipationSchedule();
    }
  }, [projectUser]);

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
