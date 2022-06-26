import { NextPage } from "next";
import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { ProgressCircular, useLiff } from "@/components";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import { instanceOf } from "prop-types";

const MemberRegistrationScreen: NextPage = () => {
  const { userId: lineId } = useLiff();
  const { user: authUser } = useSupabaseUser();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [isRegistering, setRegistering] = useState(false);
  const [error, setError] = useState<Error>();

  useCallback(() => {
    if (!error) return;
    toast.error(error.message)
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
        const { error: registerError } = await supabaseClient
          .from('members')
          .insert([
            {
              uuid: authUser.id,
              line_id: lineId,
              nickname: trimmedNickname,
            }
          ]);

        console.log(registerError);

        if (!!registerError) {
          setError(new Error(registerError.message));
          return;
        }

        console.log('success');
        toast('メンバー登録が完了しました 🎉', { type: 'success'});
        router.replace('/');
      } catch (e) {
        if (e instanceof Error) {
          setError(new Error(e.message));
        }
      } finally {
        setRegistering(false);
      }
    })();
  };

  return (
    <>
      <section>
        <div className="flex flex-col justify-center min- py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-3xl font-extrabold text-center text-neutral-600">メンバー登録</h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <form className="px-4 py-8 sm:px-10 space-y-6" onSubmit={ (event) => onSubmit(event) }>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              > ニックネーム
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  autoComplete="nickname"
                  maxLength={ 24 }
                  pattern=".*\S+.*"
                  required={ true }
                  placeholder='Kebab'
                  title='空白以外の文字列を入力してください。'
                  value={ nickname }
                  onChange={ (event) => onChangeNickname(event.target.value) }
                  className="mt-1 block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"/>
              </label>

              <button
                type="submit"
                className="flex mx-auto mt-16 items-center justify-center w-full text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              >メンバー登録して利用を始める
              </button>
            </form>
          </div>
        </div>
      </section>
      <ProgressCircular isVisible={ isRegistering }/>
    </>
  )
};

export default MemberRegistrationScreen;
