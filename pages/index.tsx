import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useCurrentDay } from "../hooks/useCurrentDay";
import { useMenu } from "../hooks/useMenu";
import { useTodaysMenu } from "../hooks/useTodaysMenu";
import { fetchMenu } from "../services/fetchMenu";
import styles from "../styles/Home.module.scss";
import type { WeekMenu as WeekMenuType } from "../types/Menu";

const REVALIDATE = 60 * 2; //2 minutes
export async function getStaticProps() {
  let menu: WeekMenuType | undefined;
  try {
    menu = await fetchMenu();
  } catch (err) {
    console.error(`Failed to fetch menu: ${err}`);
  }

  return { props: { menuInitData: menu ?? null }, revalidate: REVALIDATE };
}

const Home: NextPage<{ menuInitData?: WeekMenuType }> = ({ menuInitData }) => {
  const today = useCurrentDay();
  const { todaysMenu } = useTodaysMenu(menuInitData);
  const { data } = useMenu(menuInitData);
  const isOpen = !today.isWeekend && (todaysMenu?.courses?.length ?? 0) > 0;

  const introDate = format(today.date, "d MMMM", { locale: sv });

  return (
    <div className={styles.space}>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Pathway+Gothic+One&display=swap"
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

      <p className={styles.fadeIntro}>
        Idag, {introDate}, i en matsal nära nära dig...
      </p>

      <div className={styles.crawlContainer}>
        <div className={styles.crawl}>
          <header className={styles.titleBlock}>
            <p className={styles.episode}>
              Episod V · {today.formattedDate}
            </p>
            <h1 className={styles.logo}>
              <span>Dagens</span>
              <span>Meny</span>
            </h1>
          </header>

          <div className={styles.body}>
            {isOpen ? (
              <>
                <p>
                  Det är en period av oroligheter i lunchrummet. Magar kurrar,
                  mikrovågsugnen är upptagen, och en hungrig hop söker
                  näring. Ur skuggorna träder dagens kockar fram med löften
                  om mättnad och smak.
                </p>

                <p>
                  Idag serveras följande rätter i restaurangens stora sal:
                </p>

                {todaysMenu?.courses?.map((course) => (
                  <p key={course.dish} className={styles.dishParagraph}>
                    <strong>{course.dish}.</strong>{" "}
                    {course.condiments && <>{course.condiments}. </>}
                    {course.allergens && (
                      <em className={styles.allergens}>
                        Allergener: {course.allergens}.
                      </em>
                    )}
                  </p>
                ))}

                {data?.week && (
                  <h2 className={styles.weekHeading}>
                    Veckans Meny — Vecka {data.week}
                  </h2>
                )}

                {data?.dayMenus?.map((dayMenu) => {
                  if (!dayMenu.courses || dayMenu.courses.length === 0) {
                    return null;
                  }
                  return (
                    <div key={dayMenu.day} className={styles.dayBlock}>
                      <h3 className={styles.dayHeading}>{dayMenu.day}</h3>
                      {dayMenu.courses.map((course) => (
                        <p key={course.dish} className={styles.dishParagraph}>
                          <strong>{course.dish}</strong>
                          {course.condiments && <> — {course.condiments}</>}.
                        </p>
                      ))}
                    </div>
                  );
                })}

                <p className={styles.outro}>
                  Må mättnaden vara med dig.
                </p>
              </>
            ) : (
              <p className={styles.closed}>
                Restaurangen är stängd. Galaxen vilar och kockarna har
                dragit sig tillbaka till sina kvarter. Återvänd nästa
                vardag för nya äventyr i lunchsalen.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
