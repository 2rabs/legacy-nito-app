import { useEffect, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export function useSchedule() {
  const [ isLoading, setLoading ] = useState(false);
  const [
    latestScheduledDate,
    setLatestScheduledDate
  ] = useState<Date | null | undefined>(undefined);

  useEffect(() => {
    (async function () {
      setLoading(true);

      try {
        const { data } = await supabaseClient
          .from('schedules')
          .select('date')
          .gte('date', new Date().toISOString())
          .is('deleted_at', null)
          .order('date', { ascending: true })
          .limit(1)
          .single();

        console.log(data);

        if (!data) {
          setLatestScheduledDate(null);
          return;
        }

        const { date: dateString } = data;
        const date = new Date(dateString);
        console.log(date);
        setLatestScheduledDate(date);
      } catch {
        console.log('error');

        setLatestScheduledDate(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    isLoading,
    latestScheduledDate,
  };
}
