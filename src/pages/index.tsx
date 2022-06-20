import type { NextPage } from "next";
import styles from "@/styles/Home.module.css";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/ui";
import { useLiff } from "@/components/LiffProvider";
import useUser from "@/hooks/user";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import Head from "@/components/Head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const LandingScreen: NextPage = () => {
  const router = useRouter();

  const onNavigateToAuthClick = () => {
    router.push('/auth');
  };

  return (
    <div>
      <Head/>

      <main className={ styles.main }>
        <h1>NITO</h1>
        <p>NITO はトランポリン活動グループの参加予定ツールです。</p>
        <button onClick={ () => onNavigateToAuthClick() }>NITO を利用する</button>
      </main>
    </div>
  );
};

export default LandingScreen;
