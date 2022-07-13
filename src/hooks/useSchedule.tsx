import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export type Schedule = {
  id: number;
  date: Date;
};

export function useSchedule() {
  const [isLoading, setLoading] = useState(false);
  const [latestSchedule, setLatestSchedule] = useState<Schedule>();

  useEffect(() => {
    (async function () {
      setLoading(true);

      try {
        const { data } = await supabaseClient
          .from('schedules')
          .select('id, date')
          .gt('date', new Date().toISOString())
          .is('deleted_at', null)
          .order('date', { ascending: true })
          .limit(1)
          .single();

        if (!data) {
          return;
        }

        const { date: dateString } = data;
        const date = new Date(dateString);

        setLatestSchedule({
          id: data.id,
          date,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    isLoading,
    latestSchedule: latestSchedule,
  };
}
