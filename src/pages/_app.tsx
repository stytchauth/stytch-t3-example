import { type AppProps } from 'next/app';
import { SiteHeader } from '~/components';
import { trpc } from '~/utils/trpc';

import '~/styles/globals.css';

export default trpc.withTRPC(function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteHeader />
      <Component {...pageProps} />
    </>
  );
});
