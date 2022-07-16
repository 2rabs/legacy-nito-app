import { useRecoilValue } from 'recoil';
import { memberState } from '@/states/member';

export function useCurrentUser() {
  const currentUser = useRecoilValue(memberState);
  const isRegistered = currentUser !== undefined;
  const isNotRegistered = !isRegistered;

  return {
    currentUser,
    isRegistered: isRegistered,
    isNotRegistered,
  };
}
