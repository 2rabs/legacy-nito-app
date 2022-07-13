import React from 'react';
import { SectionContainer } from '@/components';

type Props = {
  children: React.ReactNode;
};

export const LayoutWrapper: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <SectionContainer>
        <div className='flex h-screen flex-col justify-between'>
          <main className='mb-auto'>{children}</main>
        </div>
      </SectionContainer>
    </>
  );
};
