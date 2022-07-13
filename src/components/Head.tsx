import { default as NextHead } from 'next/head';

interface Props {
  pageName?: string;
}

export const Head = (props: Props) => {
  const title = props.pageName ? `${props.pageName} | NITO` : 'NITO';

  return (
    <NextHead>
      <title>{title}</title>
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
    </NextHead>
  );
};
