import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Schedule } from '@/features/schedule';
import { memberState } from '@/states/member';

interface ParticipateResult {
  type: 'success' | 'error';
  message: string;
}

interface MutableMostRecentScheduleState {
  isLoading: boolean;
  mostRecentSchedule?: Schedule;
  comment: string;
  setComment: (comment: string) => void;
  participateIfNeeded: (schedule: Schedule) => void;
  participateResult?: ParticipateResult;
  resetParticipateResult: () => void;
}

export const useMutableMostRecentSchedule: () => MutableMostRecentScheduleState = () => {
  const member = useRecoilValue(memberState);

  const [isLoading, setLoading] = useState(false);
  const [mostRecentSchedule, setMostRecentSchedule] = useState<Schedule>();
  const [comment, setComment] = useState<string>('');
  const [participateResult, setParticipateResult] = useState<ParticipateResult>();

  useEffect(() => {
    (async function () {
      setLoading(true);

      try {
        const { data: mostRecentSchedule } = await supabaseClient
          .from('schedules')
          .select('id, date')
          .gt('date', new Date().toISOString())
          .is('deleted_at', null)
          .order('date', { ascending: true })
          .limit(1)
          .single();

        if (!mostRecentSchedule) {
          return;
        }

        const { date: dateString } = mostRecentSchedule;
        const date = new Date(dateString);

        setMostRecentSchedule({
          id: mostRecentSchedule.id,
          date,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const participateIfNeeded = async (schedule: Schedule) => {
    if (!member) return;

    try {
      const { data: participated, error: participatedError } = await supabaseClient
        .from('participation')
        .select('id', { count: 'exact' })
        .eq('schedule_id', schedule.id)
        .eq('member_id', member.memberId);

      if (participatedError) {
        setParticipateResultError(participatedError.message);
        return;
      }

      const isParticipated = !!participated && participated.length;
      if (isParticipated) {
        setParticipateResultError('既に参加登録済みです。');
        return;
      }

      const { error: participateError } = await supabaseClient.from('participation').insert([
        {
          schedule_id: schedule.id,
          member_id: member.memberId,
          comment: comment,
        },
      ]);

      if (!!participateError) {
        setParticipateResultError(participateError.message);
        return;
      }

      setParticipateResultSuccess(`${schedule.date.toLocaleDateString()} に参加登録しました🎉`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const setParticipateResultSuccess = (message: string) => {
    setParticipateResult({
      type: 'success',
      message,
    });
  };

  const setParticipateResultError = (message: string) => {
    setParticipateResult({
      type: 'error',
      message,
    });
  };

  const resetParticipateResult = () => {
    setParticipateResult(undefined);
  };

  return {
    isLoading,
    mostRecentSchedule,
    comment,
    setComment,
    participateIfNeeded,
    participateResult,
    resetParticipateResult,
  };
};
