import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TopContent, Head } from '@/components';
import { Schedule, useCurrentUser, useParticipationSchedule, useSchedule } from '@/hooks';
import { ProgressTimeLatch } from '@/lib';

const HomeScreen: NextPage = () => {
  const [showProgress, setShowProgress] = useState(false);
  const progressTimeLatch = new ProgressTimeLatch((showProgress: boolean) => {
    setShowProgress(showProgress);
  });

  const { isAuthChecking, currentUser } = useCurrentUser();
  const {
    isLoading: isParticipationScheduleLoading,
    participationSchedules,
    participateIfNeeded,
    scheduleMessage,
    scheduleError,
  } = useParticipationSchedule();

  const { isLoading: isLatestScheduledDateLoading, latestSchedule } = useSchedule();

  useEffect(() => {
    if (!scheduleMessage) return;
    toast(scheduleMessage, { type: 'success' });
  }, [scheduleMessage]);

  useEffect(() => {
    if (!scheduleError) return;
    toast(scheduleError.message, { type: 'error' });
  }, [scheduleError]);

  useEffect(() => {
    progressTimeLatch.loading =
      isAuthChecking && isParticipationScheduleLoading && isLatestScheduledDateLoading;
  }, [isAuthChecking, isParticipationScheduleLoading, isLatestScheduledDateLoading]);

  const resolveMessage: () => string | undefined = () => {
    return latestSchedule
      ? `次回の開催日は ${latestSchedule.date.toLocaleDateString()} です。`
      : undefined;
  };

  const onParticipateButtonClick = (latestSchedule: Schedule) => {
    participateIfNeeded(latestSchedule);
  };

  const onSignOutButtonClick = () => {
    supabaseClient.auth.signOut();
  };

  return (
    <>
      <Head pageName={'Home'} />

      <TopContent
        showProgress={showProgress}
        title='NITO'
        latestSchedule={latestSchedule}
        message={resolveMessage()}
        onParticipateButtonClick={(latestSchedule) => onParticipateButtonClick(latestSchedule)}
        onSignOutButtonClick={() => onSignOutButtonClick()}
      />
    </>
  );
};

export default HomeScreen;
