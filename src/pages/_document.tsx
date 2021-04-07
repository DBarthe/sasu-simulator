import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='fr'>
        <Head>
          <link rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto+Mono|Courier+Prime|Playfair+Display|Space+Mono|Bangers" />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
