import Head from 'next/head';
import React from 'react';
import { SectionContainer } from '@/components';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ title, children }: Props) => {
  const titleText = title ? `${title} | NITO` : 'NITO';

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no'
        />
        <meta
          name='robots'
          content='noindex'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <SectionContainer>
        <div className='flex h-screen flex-col justify-between'>
          <div className='mb-auto'>{children}</div>
        </div>
      </SectionContainer>
    </>
  );
};
