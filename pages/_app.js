import "@/styles/globals.css";
import Head from 'next/head';
import { UserProvider } from "@/context/authContext";
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
    <Head>      
    <link rel="icon" type="image/png" href="/logo.png" />
                     
        <title>Vote</title>

    </Head>
    <Component {...pageProps} />
    </UserProvider>
  );
}
