import { Dispatch, SetStateAction, useState } from 'react';
import { useLiff } from '@/components';
import { AuthType } from '@/features/auth';
import { supabase } from '@/lib/supabaseClient';

interface MutableAuthProps {
  type: AuthType;
}

interface MutableAuthState {
  type: AuthType;
  setType: Dispatch<SetStateAction<AuthType>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  signUp: () => void;
  signIn: () => void;
}

export const useMutableAuth: (props: MutableAuthProps) => MutableAuthState = ({
  type: initialType,
}: MutableAuthProps) => {
  const { email: lineEmail } = useLiff();

  const [type, setType] = useState<AuthType>(initialType);
  const [email, setEmail] = useState(initialType === 'signUp' ? lineEmail ?? '' : '');
  const [password, setPassword] = useState('');

  const reset = () => {
    setEmail('');
    setPassword('');
  };

  const signUp = () => {
    (async function () {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        alert(error.message);
      }
    })();
  };

  const signIn = () => {
    (async function () {
      const { error } = await supabase.auth.signIn({ email, password });

      if (error) {
        alert(error.message);
      }
    })();
  };

  return {
    type,
    setType,
    email,
    setEmail,
    password,
    setPassword,
    signUp,
    signIn,
  };
};
