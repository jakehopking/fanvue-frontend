import type {AppProps} from "next/app";
import {ThemeProvider, CssBaseline} from "@mui/material";
import {Layout} from "../components/layout/Layout";
import lightTheme from "../themes/lightTheme";

export interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface PageType {
  title: string;
  description: string;
}

export interface GenericPageProps {
  page?: PageType & {
    head: HeadProps;
  };
}

export type FanVuePageProps = AppProps & GenericPageProps;

function MyApp({Component, pageProps}: FanVuePageProps) {
  const head = pageProps?.page?.head;
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Layout head={head}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
