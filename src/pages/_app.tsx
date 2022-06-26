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
        const { data: member } = await supabaseClient
          .from('members')
          .select('*')
          .eq('uuid', authUser.id)
          .limit(1)
          .single();

        if (!member) {
          setCurrentUser(null);
          await router.replace('/member/registration');
          return;
        }

        setCurrentUser({
          userId: Number(member['id']),
          lineId: member['line_id'],
          nickname: member['nickname'],
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
