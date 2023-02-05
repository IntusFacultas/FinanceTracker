import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import PageLayout from '../components/PageLayout';
import { createGlobalStyle } from 'styled-components';
const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.05);
  }
`;
const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <GlobalStyle />
            <SessionProvider session={pageProps.session}>
                <PageLayout>
                    <Component {...pageProps} />
                </PageLayout>
            </SessionProvider>
        </>
    );
};

export default App;
