import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet, createGlobalStyle } from 'styled-components';
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
export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }
    render() {
        return (
            <Html>
                <Head>
                    <GlobalStyle />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
