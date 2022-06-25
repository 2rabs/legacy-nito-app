import type { NextPage } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "@/components/Head";
import { useCurrentUser, useParticipationSchedule, useSchedule } from "@/hooks";
import { TopContent } from "@/components";
import React, { useEffect, useState } from "react";
import { ProgressTimeLatch } from "@/lib";

const HomeScreen: NextPage = () => {
  const [showProgress, setShowProgress] = useState(false);
  const progressTimeLatch = new ProgressTimeLatch((showProgress: boolean) => {
    setShowProgress(showProgress);
  })

  const { isAuthChecking, currentUser } = useCurrentUser();
  const {
    isLoading: isParticipationScheduleLoading,
    participationSchedules
  } = useParticipationSchedule();

  const {
    isLoading: isLatestScheduledDateLoading,
    latestScheduledDate
  } = useSchedule();

  useEffect(() => {
    progressTimeLatch.loading = (
      isAuthChecking &&
      isParticipationScheduleLoading &&
      isLatestScheduledDateLoading
    );
  }, [
    isAuthChecking,
    isParticipationScheduleLoading,
    isLatestScheduledDateLoading,
  ])

  const resolveMessage: () => string | undefined = () => {
    return latestScheduledDate
      ? `次回の開催日は ${ latestScheduledDate.toLocaleDateString() } です。`
      : undefined;
  };

  const onSignOutButtonClick = () => {
    supabaseClient.auth.signOut();
  };

  return (
    <>
      <Head pageName={ 'Home' }/>

      <TopContent
        showProgress={ showProgress }
        title='NITO'
        message={ resolveMessage() }
        onSignOutButtonClick={ () => onSignOutButtonClick() }
      />
    </>
  );
};

export default HomeScreen;
