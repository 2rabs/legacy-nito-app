import React from 'react';
import { AuthType, useMutableAuth } from '@/features/auth';

type Props = {
  type: AuthType;
};

export const Auth: React.FC<Props> = ({ type: initialType }: Props) => {
  const { type, setType, email, setEmail, password, setPassword, signUp, signIn } = useMutableAuth({
    type: initialType,
  });

  return <></>;
};
