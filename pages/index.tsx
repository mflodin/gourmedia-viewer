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
import clsx from "clsx";
import Footer from "../components/Footer";

const REVALIDATE = 60 * 60 * 2; //2 hour
export async function getStaticProps() {
  let menu;
  try {
    menu = await fetchMenu();
  } catch (err) {
    throw new Error(`Failed to fetch menu: ${err}`);
  }
  console.log(parseMenu(menu));
  return { props: { menuInitData: parseMenu(menu) }, revalidate: REVALIDATE };
}

const Home: NextPage<{ menuInitData?: Menu[] }> = ({ menuInitData }) => {
  const today = useCurrentDay();
  const { todayMenu } = useTodaysMenu(menuInitData);
  const { data } = useMenu(menuInitData);

  console.log(data);
  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurang med bra mat</title>
        <meta
          name="description"
          content="Veckans mat på en bra lunchrestaurang"
        />
        <link
          rel="preload"
          href="/fonts/BeeDeeGroovy-Regular.woff2"
          as="font"
          type="font/woff2"
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

      <main className={styles.main}>
        <h1 className={styles.title}>
          {today.isWeekend ? "Idag är det stängt!" : "Dagens meny"}
        </h1>
        <SpinningBadge />
        <TodaysMenu dayMenu={todayMenu?.menu} />
        <span className={clsx(styles.hr, styles.hrAnimate)} />
        <h2 className={styles.weekHeader}>Veckans meny</h2>
        <div className={styles.grid}>
          {data?.map((foodDay) => {
            return (
              <div
                key={foodDay.day}
                className={clsx(styles.card, {
                  [styles.pastCard]: foodDay.isPast,
                  [styles.todayCard]: foodDay.isToday,
                })}
              >
                <h2>{foodDay.day}</h2>
                {foodDay.menu.map((course) => (
                  <React.Fragment key={course.type}>
                    <h4>{course.type}</h4>
                    <p>{course.dish}</p>
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>
      </main>
      <span className={clsx(styles.hr, styles.hrAnimate, styles.hrAnimateReverse)} />
      <Footer />
    </div>
  );
};

export default Home;
