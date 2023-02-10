import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import PageLayout from '../components/PageLayout';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createGlobalStyle } from 'styled-components';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';

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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <PageLayout>
                        <Component {...pageProps} />
                    </PageLayout>
                </LocalizationProvider>
            </SessionProvider>
        </>
    );
};

export default App;
