import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { UserProvider, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { currentUserState } from "@/states/currentUser";
import { useRouter } from "next/router";
import { LayoutWrapper, LiffProvider } from '@/components';
import { ToastContainer } from "react-toastify";

const AppInit = () => {
  const router = useRouter();
  const { user: authUser, isLoading } = useSupabaseUser();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const effect = () => {
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
  }

  useEffect(effect, []);
  useEffect(effect, [authUser, isLoading]);

  return null;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <UserProvider supabaseClient={supabaseClient}>
        <LiffProvider>
          <LayoutWrapper>
            <Component {...pageProps} />
            <AppInit />
            <ToastContainer />
          </LayoutWrapper>
        </LiffProvider>
      </UserProvider>
    </RecoilRoot>
  );
}

export default MyApp;
