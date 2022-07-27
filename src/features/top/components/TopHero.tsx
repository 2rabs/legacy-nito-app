import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

export const TopHero: React.FC<Props> = ({}: Props) => {
  const { push } = useRouter();

  const onSignInButtonClick = () => {
    push('/auth');
  };

  return (
    <section className="h-screen bg-[url('/top-hero-background.jpg')] bg-cover">
      <div className='flex h-full flex-col flex-wrap items-center justify-center bg-white/[.70] text-center'>
        <h1 className='my-8 text-7xl font-bold'>NITO</h1>
        <p className='my-8 text-xl'>NITO (ニト) はトランポリン活動グループのウェブアプリです。</p>
        <button
          className='mx-auto my-8 flex rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none'
          onClick={() => onSignInButtonClick()}
        >
          サインイン
        </button>
      </div>
    </section>
  );
};
