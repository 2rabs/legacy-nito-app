import { NextPage } from "next";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import Head from "@/components/Head";
import styles from "@/styles/Home.module.css";
import { Auth } from "@supabase/ui";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import useUser from "@/hooks/user";

const AuthScreen: NextPage = () => {
  const { user: authUser, error } = useSupabaseUser();
  const { user } = useUser();

  return (
    <div>
      <Head pageName={ 'Auth' }/>

      <main className={ styles.main }>
        { error && <p>{ error.message }</p> }
        <Auth
          supabaseClient={ supabaseClient }
          // providers={ ['google'] }
          socialLayout="horizontal"
          socialButtonSize="xlarge"
        />
      </main>
    </div>
  );
};

export default AuthScreen;
