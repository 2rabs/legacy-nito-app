import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/ui';
import { NextPage } from 'next';
import { MainLayout } from '@/components/Layout';

const AuthScreen: NextPage = () => {
  return (
    <MainLayout title='Auth'>
      <main>
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
