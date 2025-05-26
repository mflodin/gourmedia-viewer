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
import { WeekMenu as WeekMenuType } from "../types/Menu";
import parseMenu from "../utils/parseMenu";
import Footer from "../components/Footer";
import Divider from "../components/Divider";
import WeekMenu from "../components/WeekMenu";
import clsx from "clsx";

const REVALIDATE = 60 * 2; //2 minutes
export async function getStaticProps() {
  let menu;
  try {
    menu = await fetchMenu();
    if (typeof menu === "string") {
      menu = JSON.parse(menu);
    }
  } catch (err) {
    throw new Error(`Failed to fetch menu: ${err}`);
  }

  return { props: { menuInitData: parseMenu(menu) }, revalidate: REVALIDATE };
}

const Home: NextPage<{ menuInitData?: WeekMenuType }> = ({ menuInitData }) => {
  const [showAllWeek, setShowAllWeek] = React.useState(false);
  const today = useCurrentDay();
  const { todaysMenu } = useTodaysMenu(menuInitData);
  const { data } = useMenu(menuInitData);

  const heading = today.isWeekend ? "Idag är det stängt!" : "Dagens meny";

  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurang med bra mat</title>
        <meta
          name="description"
          content={`Veckans mat på en bra lunchrestaurang`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <link
          rel="preload"
          href="/fonts/BeeDeeGroovy-Regular.woff"
          as="font"
          type="font/woff"
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

      <main
        className={clsx(styles.main, {
          [styles.weekend]: today.isWeekend,
        })}
      >
        <h1 className={styles.title}>
          {heading}
          <div className={styles.titleDate}>{today.formattedDate}</div>
        </h1>
        {!today.isWeekend && (
          <>
            <SpinningBadge />
            <TodaysMenu courses={todaysMenu?.courses} />
            <Divider />

            <h2 className={styles.weekHeader}>
              Veckans meny{" "}
              <div className={styles.weekNumber}>v {data?.week}</div>
            </h2>
            {today.day !== "måndag" && (
              <button
                className={clsx(styles.toggleWeekButton, {
                  [styles["toggleWeekButton--close"]]: showAllWeek,
                })}
                onClick={() => setShowAllWeek((show) => !show)}
              >
                {showAllWeek ? "Dölj tidigare" : "Visa hela veckan"}
              </button>
            )}
            <WeekMenu
              className={styles.grid}
              menu={data}
              showAllWeek={showAllWeek}
            />
          </>
        )}
      </main>
      <Divider direction="left" />
      <Footer />
    </div>
  );
};

export default Home;
