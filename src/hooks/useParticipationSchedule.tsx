import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Schedule } from '@/hooks/useSchedule';
import { memberState } from '@/states/member';
import { Member } from '@/types';

export function useParticipationSchedule() {
  const currentUser = useRecoilValue(memberState);

  const [isLoading, setLoading] = useState(false);
  const [participationSchedules, setParticipationSchedules] = useState<any[] | null | undefined>(
    undefined,
  );
  const [scheduleMessage, setScheduleMessage] = useState<string>();
  const [scheduleError, setScheduleError] = useState<Error>();

  useEffect(() => {
    async function fetchUserParticipationSchedule(user: Member) {
      setLoading(true);

      try {
        const { data } = await supabaseClient
          .from('member_participation_schedules')
          .select('*')
          .eq('member_id', user.memberId);

        setParticipationSchedules(data);
      } catch {
        setParticipationSchedules(null);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser === undefined) {
      setParticipationSchedules(undefined);
      return;
    }
    if (currentUser === null) {
      setParticipationSchedules(null);
      return;
    }

    fetchUserParticipationSchedule(currentUser);
  }, [currentUser]);

  const participateIfNeeded = async (schedule: Schedule) => {
    if (!currentUser) {
      setScheduleError(new Error('ユーザーが設定されていません。'));
      return;
    }

    try {
      const { data: participated, error: participatedError } = await supabaseClient
        .from('participation')
        .select('id', { count: 'exact' })
        .eq('schedule_id', schedule.id)
        .eq('member_id', currentUser.memberId)
        .limit(1);

      if (!!participatedError) {
        setScheduleError(new Error(participatedError.message));
        return;
      }

      const isParticipated = !!participated && participated.length;
      if (isParticipated) {
        setScheduleError(new Error('既に参加登録済みです。'));
        return;
      }

      const { error: participateError } = await supabaseClient.from('participation').insert([
        {
          schedule_id: schedule.id,
          member_id: currentUser.memberId,
        },
      ]);

      if (!!participateError) {
        setScheduleError(new Error(participateError.message));
        return;
      }

      const message = `${schedule.date.toLocaleDateString()} に参加登録しました🎉`;

      setScheduleMessage(message);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    participationSchedules,
    participateIfNeeded,
    scheduleMessage,
    scheduleError,
  };
}
