import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useCurrentDay } from "../hooks/useCurrentDay";
import { useMenu } from "../hooks/useMenu";
import { useTodaysMenu } from "../hooks/useTodaysMenu";
import { fetchMenu } from "../services/fetchMenu";
import styles from "../styles/Home.module.css";
import { FoodData } from "./api/snusket/today";
import SpinningBadge from "../components/SpinningBadge";
import TodaysMenu from "../components/TodaysMenu";

const REVALIDATE = 60 * 60 * 2; //2 hour
export async function getStaticProps() {
  let menu;
  try {
    menu = await fetchMenu();
  } catch (err) {
    throw new Error(`Failed to fetch menu: ${err}`);
  }
  return { props: { menuInitData: menu }, revalidate: REVALIDATE };
}

const Home: NextPage<{ menuInitData?: FoodData[] }> = ({ menuInitData }) => {
  const today = useCurrentDay();
  const { menu } = useTodaysMenu(menuInitData);
  const { data } = useMenu(menuInitData);

  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurang snusket</title>
        <meta name="description" content="Veckans mat på snusket" />
        <link rel="preload" href="/fonts/BeeDeeGroovy-Regular.woff2" as="font" type="font/woff2" />
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
          {today.isWeekend ? "Idag är snusket stängt!" : "Dagens meny"}
        </h1>
        <SpinningBadge />
        <TodaysMenu menu={menu} />

        <div className={styles.grid}>
          {data?.map((foodDay) => {
            return (
              <div key={foodDay.day} className={styles.card}>
                <h2>{foodDay.day}</h2>
                <p>{foodDay.menu}</p>
              </div>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.sebastianross.se"
          target="_blank"
          rel="noopener noreferrer"
        >
          made with{" "}
          <span
            style={{
              margin: "0 10px 0 5px",
            }}
          >
            💖
          </span>
          by r0ss
        </a>
      </footer>
    </div>
  );
};

export default Home;
