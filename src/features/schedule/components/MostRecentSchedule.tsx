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
    <div className='flex flex-wrap w-full flex-col items-center text-center py-8'>
      <p className='lg:w-1/2 w-full leading-relaxed text-gray-500'>{`次回の開催日は ${mostRecentSchedule.date.toLocaleDateString()} です。`}</p>

      <form
        className='my-4'
        onSubmit={(event) => onParticipateButtonClick(event, mostRecentSchedule)}
      >
        <label
          htmlFor='comment'
          className='block text-sm font-medium text-gray-700 py-8'
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
            className='mt-1 block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300'
          />
        </label>
        <button className='bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded'>
          参加する
        </button>
      </form>
    </div>
  );
};
