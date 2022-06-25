import type { NextPage } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "@/components/Head";
import { useCurrentUser, useParticipationSchedule, useSchedule } from "@/hooks";
import { TopContent } from "@/components";

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

  const resolveMessage: () => string = () => {
    if (isLatestScheduledDateLoading) {
      return '次回の開催日を確認中です…';
    }

    return latestScheduledDate
      ? `次回の開催日は ${ latestScheduledDate.toLocaleDateString() } です。`
      : '';
  };

  const onSignOutButtonClick = () => {
    supabaseClient.auth.signOut();
  };

  return (
    <div>
      <Head pageName={ 'Home' }/>

      <TopContent
        title='NITO'
        message={ resolveMessage() }
        onSignOutButtonClick={ () => onSignOutButtonClick() }
      />
    </div>
  );
};

export default HomeScreen;
