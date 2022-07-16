import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TopContent } from '@/components';
import { MainLayout } from '@/components/Layout';
import { Schedule, useParticipationSchedule, useSchedule } from '@/hooks';

const DashboardScreen: NextPage = () => {
  const [showProgress, setShowProgress] = useState(false);

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
    const isLoading = isParticipationScheduleLoading || isLatestScheduledDateLoading;
    setShowProgress(isLoading);
  }, [isParticipationScheduleLoading, isLatestScheduledDateLoading]);

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
    <MainLayout title='Dashboard'>
      <main>
        <TopContent
          showProgress={showProgress}
          title='NITO'
          latestSchedule={latestSchedule}
          message={resolveMessage()}
          onParticipateButtonClick={(latestSchedule) => onParticipateButtonClick(latestSchedule)}
          onSignOutButtonClick={() => onSignOutButtonClick()}
        />
      </main>
    </MainLayout>
  );
};

export default DashboardScreen;
