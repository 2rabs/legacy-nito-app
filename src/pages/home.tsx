import { NextPage } from "next";
import Head from "@/components/Head";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import useUser from "@/hooks/user";

const HomeScreen: NextPage = () => {
  const { user, userParticipationSchedule } = useUser();

  return (
    <div>
      <Head pageName={ 'Home' }/>

      <button onClick={ () => supabaseClient.auth.signOut() }>Sign out</button>

      { user && <p>UserName: { user.nickname }</p> }

      { userParticipationSchedule && <>
          <p>UserParticipationSchedule</p>
          <pre>{ JSON.stringify(userParticipationSchedule, null, 2) }</pre>
      </> }
    </div>
  );
};

export default HomeScreen;
