import { useRecoilValue } from "recoil";
import { currentUserState } from "@/states/currentUser";
import { useEffect, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { CurrentUser } from "@/types";

export function useParticipationSchedule() {
  const currentUser = useRecoilValue(currentUserState);

  const [ isLoading, setLoading ] = useState(false);
  const [
    participationSchedules,
    setParticipationSchedules
  ] = useState<any[] | null | undefined>(undefined);

  useEffect(() => {
    async function fetchUserParticipationSchedule(user: CurrentUser) {
      setLoading(true);

      try {
        const { data } = await supabaseClient
          .from('user_participation_schedule')
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

  return {
    isLoading,
    participationSchedules,
  };
}
