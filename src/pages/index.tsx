import type { NextPage } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "@/components/Head";
import { useCurrentUser, useParticipationSchedule, useSchedule } from "@/hooks";

const HomeScreen: NextPage = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const {
    isLoading: isParticipationScheduleLoading,
    participationSchedules
  } = useParticipationSchedule();

  const {
    isLoading: isLatestScheduledDateLoading,
    latestScheduledDate
  } = useSchedule();

  if (isAuthChecking) {
    return (
      <div>ログイン情報を確認中…</div>
    );
  }

  if (!currentUser) {
    return (
      <div>ログインしていません</div>
    );
  }

  return (
    <div>
      <Head pageName={ 'Home' }/>

      <button onClick={ () => supabaseClient.auth.signOut() }>Sign out</button>

      <p>ユーザー名: { currentUser.nickname }</p>

      { isLatestScheduledDateLoading && <p>次回の開催日を確認中です…</p>}
      { latestScheduledDate && <p>次回の開催日は { latestScheduledDate.toLocaleDateString() } です。</p>}

      { isParticipationScheduleLoading && <p>参加予定のスケジュールを確認中です…</p>}
      { participationSchedules && <>
          <p>参加予定日</p>
          <pre>{ JSON.stringify(participationSchedules, null, 2) }</pre>
      </> }
    </div>
  );
};

export default HomeScreen;
