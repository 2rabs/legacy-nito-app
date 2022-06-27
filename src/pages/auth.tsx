import { NextPage } from "next";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import Head from "@/components/Head";
import styles from "@/styles/Home.module.css";
import { Auth } from "@supabase/ui";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AuthScreen: NextPage = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const { user: authUser, error } = useSupabaseUser();

  return (
    <div>
      <Head pageName={ 'Auth' }/>

      <main className={ styles.main }>
        <Auth
          supabaseClient={ supabaseClient }
          // providers={ ['google'] }
          socialLayout="horizontal"
          socialButtonSize="xlarge"
          view='magic_link'
        />
      </main>
    </div>
  );
};

export default AuthScreen;
