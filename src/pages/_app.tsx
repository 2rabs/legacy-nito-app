import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider, useUser } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot, useRecoilState } from 'recoil';
import { LiffProvider } from '@/components';
import { memberState } from '@/states/member';

const AppInit: React.FC = () => {
  const { push, replace, pathname } = useRouter();
  const { user, isLoading } = useUser();
  const [member, setCurrentMember] = useRecoilState(memberState);

  const validateSession = async () => {
    if (isLoading) return;

    const isRequireMemberScreen = pathname === '/dashboard' || pathname === '/that-day';
    const isRequireAuthScreen = isRequireMemberScreen || pathname === '/member/registration';
    const isEveryoneScreen = pathname === '/' || pathname === '/auth';

    if (member) {
      if (isEveryoneScreen) {
        replace('/dashboard');
      }
    } else if (user && pathname !== '/member/registration') {
      try {
        const { data: member } = await supabaseClient
          .from('members')
          .select('*')
          .eq('uuid', user.id)
          .single();

        if (!member) {
          setCurrentMember(undefined);
          await replace('/member/registration');
          return;
        }

        setCurrentMember({
          memberId: Number(member['id']),
          lineId: member['line_id'],
          nickname: member['nickname'],
          role: member['role'],
        });
      } catch {
        setCurrentMember(undefined);
        await replace('/member/registration');
      }
    } else if (!user && isRequireAuthScreen) {
      await push('/auth');
    }
  };

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && pathname === '/auth') {
      const user = session?.user;
      if (!user) {
        replace('/auth');
        return;
      }

      (async function () {
        try {
          const { data: member } = await supabaseClient
            .from('members')
            .select('*')
            .eq('uuid', user.id)
            .single();

          if (!member) {
            setCurrentMember(undefined);
            await push('/member/registration');
            return;
          }

          setCurrentMember({
            memberId: Number(member['id']),
            lineId: member['line_id'],
            nickname: member['nickname'],
            role: member['role'],
          });
          await push('/dashboard');
        } catch {
          setCurrentMember(undefined);
          await push('/auth');
        }
      })();
    }

    if (event === 'SIGNED_OUT') {
      setCurrentMember(undefined);
      push('/auth');
    }
  });

  useEffect(() => {
    validateSession();
  }, [isLoading]);

  return null;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <UserProvider supabaseClient={supabaseClient}>
        <LiffProvider>
          <Component {...pageProps} />
          <AppInit />
          <ToastContainer />
        </LiffProvider>
      </UserProvider>
    </RecoilRoot>
  );
};

export default MyApp;
