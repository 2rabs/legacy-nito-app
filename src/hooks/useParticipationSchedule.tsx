import { useRecoilValue } from "recoil";
import { currentUserState } from "@/states/currentUser";
import { useEffect, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { CurrentUser } from "@/types";
import { Schedule } from "@/hooks/useSchedule";

export function useParticipationSchedule() {
  const currentUser = useRecoilValue(currentUserState);

  const [isLoading, setLoading] = useState(false);
  const [
    participationSchedules,
    setParticipationSchedules
  ] = useState<any[] | null | undefined>(undefined);
  const [scheduleMessage, setScheduleMessage] = useState<string>();
  const [scheduleError, setScheduleError] = useState<Error>();

  useEffect(() => {
    async function fetchUserParticipationSchedule(user: CurrentUser) {
      setLoading(true);

      try {
        const {data} = await supabaseClient
          .from('user_participation_schedules')
          .select('*')
          .eq('user_id', user.userId);

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
      setScheduleError(new Error('ユーザーが設定されていません。'))
      return;
    }

    try {
      const {data: participated, error: participatedError} = await supabaseClient
        .from('participation')
        .select('id', { count: 'exact' })
        .eq('schedule_id', schedule.id)
        .eq('user_id', currentUser.userId)
        .limit(1);

      if (!!participatedError) {
        setScheduleError(new Error(participatedError.message));
        return;
      }

      const isParticipated = !!participated && participated.length;
      if (isParticipated) {
        setScheduleError(new Error('既に参加登録済みです。'))
        return;
      }

      const { error: participateError } = await supabaseClient
        .from('participation')
        .insert([
          {
            schedule_id: schedule.id,
            user_id: currentUser.userId,
          }
        ]);

      if (!!participateError) {
        setScheduleError(new Error(participateError.message));
        return;
      }

      setScheduleMessage(`${schedule.date.toLocaleDateString()} に参加登録しました。`);
    } catch(error) {
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
