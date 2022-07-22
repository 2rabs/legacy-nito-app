import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/ui';
import { NextPage } from 'next';
import { MainLayout } from '@/components/Layout';
import styles from '@/styles/Home.module.css';

const AuthScreen: NextPage = () => {
  return (
    <MainLayout title='Auth'>
      <main className={styles.main}>
        <Auth
          supabaseClient={supabaseClient}
          socialLayout='horizontal'
          socialButtonSize='xlarge'
        />
      </main>
    </MainLayout>
  );
};

export default AuthScreen;
