import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

interface UserState {
  user: User | null;
  userParticipationSchedule: any[] | null;
}

interface User {
  userId: number;
  lineId: string | null;
  nickname: string;
}

const useUser: () => UserState = () => {
  const { user, error } = useSupabaseUser();

  const [
    projectUser,
    setProjectUser
  ] = useState<User | null>(null);

  const [
    userParticipationSchedule,
    setUserParticipationSchedule
  ] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchProjectUser() {
      if (!user) return;

      const {data} = await supabaseClient
        .from('users')
        .select('*')
        .eq('uuid', user.id);

      if (data) {
        const user = data[0];
        setProjectUser({
          userId: Number(user['id']),
          lineId: user['line_id'],
          nickname: user['nickname'],
        });
      }
    }

    if (user) {
      fetchProjectUser();
    }
  }, [user]);

  useEffect(() => {
    async function fetchUserParticipationSchedule() {
      if (!projectUser) return;

      const {data} = await supabaseClient
        .from('user_participation_schedule')
        .select('*')
        .eq('user_id', projectUser.userId);

      if (data) {
        setUserParticipationSchedule(data);
      }
    }

    if (projectUser) {
      fetchUserParticipationSchedule();
    }
  }, [projectUser]);

  return {
    user: projectUser,
    userParticipationSchedule: userParticipationSchedule,
  };
};

export default useUser;
