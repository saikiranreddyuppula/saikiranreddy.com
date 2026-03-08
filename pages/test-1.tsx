import type { NextPage } from "next";
import Head from "next/head";
import TypographyCollage from "../components/TypographyCollage";

const TestPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Typography Collage Test</title>
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Bodoni+Moda:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <TypographyCollage />
    </>
  );
};

export default TestPage;
