import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/ui';
import { NextPage } from 'next';
import { MainLayout } from '@/components/Layout';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import styles from '@/styles/Home.module.css';

const AuthScreen: NextPage = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const { user: authUser, error } = useSupabaseUser();

  return (
    <MainLayout title='Auth'>
      <main className={styles.main}>
        <Auth
          supabaseClient={supabaseClient}
          // providers={ ['google'] }
          socialLayout='horizontal'
          socialButtonSize='xlarge'
          // view='magic_link'
        />
      </main>
    </MainLayout>
  );
};

export default AuthScreen;
