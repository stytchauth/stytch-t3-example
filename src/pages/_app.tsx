import { type AppProps } from 'next/app';
import { SiteHeader } from '~/components';
import { trpc } from '~/utils/trpc';
import Head from "next/head";

import '~/styles/globals.css';

export default trpc.withTRPC(function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Stytch T3 Example</title>
        <meta
          name="description"
          content="An example T3 application using Stytch for authentication"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <SiteHeader />
      <main>
      <div className='container'>
        <Component {...pageProps} />
      </div>
      </main>
    </>
  );
});
