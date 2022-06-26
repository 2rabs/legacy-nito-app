import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { user: authUser, error } = useSupabaseUser();

  const [user, setUser] = useState<User | null>(null);
  const [
    userParticipationSchedule,
    setUserParticipationSchedule
  ] = useState<any[] | null>(null);

  useEffect(() => {
    if (authUser) {
      router.push('/home');
    } else {
      router.push('/auth');
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchProjectUser() {
      if (!authUser) return;

      const {data} = await supabaseClient
        .from('members')
        .select('*')
        .eq('uuid', authUser.id);

      if (data) {
        const user = data[0];
        setUser({
          userId: Number(user['id']),
          lineId: user['line_id'],
          nickname: user['nickname'],
        });
      }
    }

    if (authUser) {
      fetchProjectUser();
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchUserParticipationSchedule() {
      if (!user) return;

      const {data} = await supabaseClient
        .from('member_participation_schedule')
        .select('*')
        .eq('member_id', user.userId);

      if (data) {
        setUserParticipationSchedule(data);
      }
    }

    if (user) {
      fetchUserParticipationSchedule();
    }
  }, [user]);

  return {
    user: user,
    userParticipationSchedule: userParticipationSchedule,
  };
};

export default useUser;
