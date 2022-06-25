import type { NextPage } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "@/components/Head";
import { Schedule, useCurrentUser, useParticipationSchedule, useSchedule } from "@/hooks";
import { TopContent } from "@/components";
import React, { useEffect, useState } from "react";
import { ProgressTimeLatch } from "@/lib";
import { toast } from "react-toastify";

const HomeScreen: NextPage = () => {
  const [showProgress, setShowProgress] = useState(false);
  const progressTimeLatch = new ProgressTimeLatch((showProgress: boolean) => {
    setShowProgress(showProgress);
  })

  const { isAuthChecking, currentUser } = useCurrentUser();
  const {
    isLoading: isParticipationScheduleLoading,
    participationSchedules,
    participateIfNeeded,
    scheduleMessage,
    scheduleError,
  } = useParticipationSchedule();

  const {
    isLoading: isLatestScheduledDateLoading,
    latestSchedule,
  } = useSchedule();

  useEffect(() => {
    if (!scheduleMessage) return;
    toast(scheduleMessage, { type: 'success' });
  }, [scheduleMessage])

  useEffect(() => {
    if (!scheduleError) return;
    toast(scheduleError.message, { type: 'error'});
  }, [scheduleError])

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
    return latestSchedule
      ? `次回の開催日は ${ latestSchedule.date.toLocaleDateString() } です。`
      : undefined;
  };

  const onParticipateButtonClick = (latestSchedule: Schedule) => {
    participateIfNeeded(latestSchedule)
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
        latestSchedule={ latestSchedule }
        message={ resolveMessage() }
        onParticipateButtonClick={ latestSchedule => onParticipateButtonClick(latestSchedule) }
        onSignOutButtonClick={ () => onSignOutButtonClick() }
      />
    </>
  );
};

export default HomeScreen;
