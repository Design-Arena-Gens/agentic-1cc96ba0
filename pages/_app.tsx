import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Apache ECharts Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Comprehensive Apache ECharts showcase covering the full charting feature set."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
