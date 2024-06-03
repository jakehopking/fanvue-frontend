import {Container} from "@mui/material";
import Head from "next/head";
import React from "react";
import {HeadProps} from "../../pages/_app";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  head?: HeadProps;
}

export const Layout: React.FC<LayoutProps> = ({children, className, head}) => {
  const {title, description, keywords} = head || {};

  const metaTitle = title ? `Fanvue: ${title}` : "Fanvue";
  const metaKeywords =
    keywords?.join(", ") ||
    "Fanvue, coding challenge, frontend, react, nextjs, mui, material ui";
  const metaDescription = description || "Fanvue's Frontend coding challenge";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link href="/favicon.png" rel="shortcut icon" type="image/x-icon" />
        {keywords && <meta name="keywords" content={metaKeywords} />}
      </Head>
      <Container className={className} maxWidth="lg">
        {children}
      </Container>
    </>
  );
};
