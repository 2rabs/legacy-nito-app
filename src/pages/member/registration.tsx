import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { useLiff } from '@/components';
import { ProgressCircular } from '@/components/Elements';
import { MainLayout } from '@/components/Layout';
import { memberState } from '@/states/member';

const MemberRegistrationScreen: NextPage = () => {
  const { userId: lineId, isInClient } = useLiff();
  const { user: authUser } = useSupabaseUser();
  const { push } = useRouter();

  const [nickname, setNickname] = useState('');
  const [isRegistering, setRegistering] = useState(false);
  const [error, setError] = useState<Error>();
  const setCurrentMember = useSetRecoilState(memberState);

  useEffect(() => {
    if (!error) return;
    toast.error(error.message);
  }, [error]);

  const onChangeNickname = (value: string) => {
    setNickname(value);
  };

  const onSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) return;
    if (!authUser) return;

    (async () => {
      setRegistering(true);

      try {
        const { data: members, error: registerError } = await supabaseClient
          .from('members')
          .insert([
            {
              uuid: authUser.id,
              line_id: lineId,
              nickname: trimmedNickname,
            },
          ]);

        console.log(registerError);

        if (!!registerError) {
          setError(new Error(registerError.message));
          return;
        }

        const member = members[0];
        if (!member) {
          return;
        }

        setCurrentMember({
          memberId: Number(member['id']),
          lineId: member['line_id'],
          nickname: member['nickname'],
          role: member['role'],
        });

        console.log('success');
        toast('メンバー登録が完了しました 🎉', { type: 'success' });
        push('/dashboard');
      } catch (e) {
        if (e instanceof Error) {
          setError(new Error(e.message));
        }
      } finally {
        setRegistering(false);
      }
    })();
  };

  const onSignOutButtonClick = () => {
    supabaseClient.auth.signOut();
  };

  if (!isInClient) {
    return (
      <MainLayout title='Registration'>
        <div className='flex h-screen flex-col items-center justify-center p-8'>
          <p>LINE のブラウザ上で操作してください。</p>

          <Link href='https://liff.line.me/1656946867-lAZJdX9R'>
            <a className='mx-auto mt-16 flex rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none'>
              LINE を開く
            </a>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title='Registration'>
      <section>
        <div className='min- flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-neutral-600'>
              メンバー登録
            </h2>
          </div>

          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <form
              className='space-y-6 px-4 py-8 sm:px-10'
              onSubmit={(event) => onSubmit(event)}
            >
              <label
                htmlFor='nickname'
                className='block text-sm font-medium text-gray-700'
              >
                {' '}
                ニックネーム
                <input
                  id='nickname'
                  name='nickname'
                  type='text'
                  autoComplete='nickname'
                  maxLength={24}
                  pattern='.*\S+.*'
                  required={true}
                  placeholder='Kebab'
                  title='空白以外の文字列を入力してください。'
                  value={nickname}
                  onChange={(event) => onChangeNickname(event.target.value)}
                  className='mt-1 block w-full rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300'
                />
              </label>

              <button
                type='submit'
                className='mx-auto mt-16 flex w-full items-center justify-center rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none'
              >
                メンバー登録して利用を始める
              </button>
            </form>
          </div>
        </div>
      </section>

      <button
        className='mx-auto mt-16 flex rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none'
        onClick={() => onSignOutButtonClick()}
      >
        サインアウト
      </button>

      <ProgressCircular isVisible={isRegistering} />
    </MainLayout>
  );
};

export default MemberRegistrationScreen;
