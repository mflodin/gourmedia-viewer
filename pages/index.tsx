import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useCurrentDay } from "../hooks/useCurrentDay";
import { useMenu } from "../hooks/useMenu";
import { useTodaysMenu } from "../hooks/useTodaysMenu";
import { fetchMenu } from "../services/fetchMenu";
import styles from "../styles/Home.module.scss";
import SpinningBadge from "../components/SpinningBadge";
import TodaysMenu from "../components/TodaysMenu";
import { Menu } from "../types/Menu";
import parseMenu from "../utils/parseMenu";
import Footer from "../components/Footer";
import Divider from "../components/Divider";
import WeekMenu from "../components/WeekMenu";
import clsx from "clsx";

const REVALIDATE = 60 * 60 * 2; //2 hour
export async function getStaticProps() {
  let menu;
  try {
    menu = await fetchMenu();
  } catch (err) {
    throw new Error(`Failed to fetch menu: ${err}`);
  }
  return { props: { menuInitData: parseMenu(menu) }, revalidate: REVALIDATE };
}

const Home: NextPage<{ menuInitData?: Menu[] }> = ({ menuInitData }) => {
  const today = useCurrentDay();
  const { todayMenu } = useTodaysMenu(menuInitData);
  const { data } = useMenu(menuInitData);

  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurang med bra mat</title>
        <meta
          name="description"
          content="Veckans mat på en bra lunchrestaurang"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <link
          rel="preload"
          href="/fonts/BeeDeeGroovy-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className={clsx(styles.main, {
        [styles.weekend]: today.isWeekend
      })}>
        <h1 className={styles.title}>
          {today.isWeekend ? "Idag är det stängt!" : "Dagens meny"}
        </h1>
        {!today.isWeekend && (
          <>
            <SpinningBadge />
            <TodaysMenu dayMenu={todayMenu?.menu} />
            <Divider />
            <h2 className={styles.weekHeader}>Veckans meny</h2>
            <WeekMenu className={styles.grid} menu={data} />
          </>
        )}
      </main>
      <Divider direction="left" />
      <Footer />
    </div>
  );
};

export default Home;
