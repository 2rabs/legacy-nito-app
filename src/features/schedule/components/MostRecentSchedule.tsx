import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Schedule, useMutableMostRecentSchedule } from '@/features/schedule';

type Props = {};

export const MostRecentSchedule: React.FC<Props> = ({}: Props) => {
  const {
    isLoading,
    mostRecentSchedule,
    comment,
    setComment,
    participateIfNeeded,
    participateResult,
    resetParticipateResult,
  } = useMutableMostRecentSchedule();

  useEffect(() => {
    if (!participateResult) return;

    switch (participateResult.type) {
      case 'success':
        toast(participateResult.message, { type: 'success' });
        break;
      case 'error':
        toast(participateResult.message, { type: 'error' });
        break;
    }
    resetParticipateResult();
  }, [participateResult]);

  const onCommentChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setComment(event.target.value);
  };

  const onParticipateButtonClick = (
    event: React.FormEvent<HTMLFormElement>,
    schedule: Schedule,
  ) => {
    event.preventDefault();

    participateIfNeeded(schedule);
  };

  if (isLoading) {
    return null;
  }

  if (!mostRecentSchedule) {
    return null;
  }

  return (
    <div className='flex w-full flex-col flex-wrap items-center py-8 text-center'>
      <p className='w-full leading-relaxed text-gray-500 lg:w-1/2'>{`次回の開催日は ${mostRecentSchedule.date.toLocaleDateString()} です。`}</p>

      <form
        className='my-4'
        onSubmit={(event) => onParticipateButtonClick(event, mostRecentSchedule)}
      >
        <label
          htmlFor='comment'
          className='block py-8 text-sm font-medium text-gray-700'
        >
          参加コメント
          <input
            id='comment'
            name='comment'
            type='text'
            maxLength={256}
            pattern='.*\S+.*'
            value={comment}
            onChange={(event) => onCommentChanged(event)}
            className='mt-1 block w-full rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300'
          />
        </label>
        <button className='rounded border border-indigo-500 bg-transparent py-2 px-4 font-semibold text-indigo-700 hover:border-transparent hover:bg-indigo-500 hover:text-white'>
          参加する
        </button>
      </form>
    </div>
  );
};
