import { Auth } from '@supabase/ui';
import { NextPage } from 'next';
import { MainLayout } from '@/components/Layout';
import { supabase } from '@/lib/supabaseClient';

const AuthScreen: NextPage = () => {
  return (
    <MainLayout title='Auth'>
      <main>
        <Auth
          supabaseClient={supabase}
          socialLayout='horizontal'
          socialButtonSize='xlarge'
        />
      </main>
    </MainLayout>
  );
};

export default AuthScreen;
