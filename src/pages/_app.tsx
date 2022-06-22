import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { LiffProvider } from "@/components/LiffProvider";
import { useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { currentUserState } from "@/states/currentUser";
import { useRouter } from "next/router";

const AppInit = () => {
  const router = useRouter();
  const { user: authUser, isLoading } = useSupabaseUser();
  const setCurrentUser = useSetRecoilState(currentUserState);

  useEffect(() => {
    (async function () {
      if (isLoading) return;

      if (!authUser) {
        setCurrentUser(null);
        await router.replace('/auth');
        return;
      }

      try {
        const { data } = await supabaseClient
          .from('users')
          .select('*')
          .eq('uuid', authUser.id);

        if (!data) {
          setCurrentUser(null);
          await router.replace('/auth');
          return;
        }

        const user = data[0];
        setCurrentUser({
          userId: Number(user['id']),
          lineId: user['line_id'],
          nickname: user['nickname'],
        });
        await router.replace('/');
      } catch {
        setCurrentUser(null);
        await router.replace('/auth');
      }
    })();
  }, [authUser]);

  return null;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <UserProvider supabaseClient={supabaseClient}>
        <LiffProvider>
          <Component {...pageProps} />
          <AppInit />
        </LiffProvider>
      </UserProvider>
    </RecoilRoot>
  );
}

export default MyApp;
