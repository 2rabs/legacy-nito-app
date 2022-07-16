import { atom } from 'recoil';
import { Member } from '@/types';

export const memberState = atom<undefined | Member>({
  key: 'Member',
  default: undefined,
});
