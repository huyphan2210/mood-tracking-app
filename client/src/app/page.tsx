"use client";

import { FC, useEffect, useState } from "react";
import { UserResponse } from "@/lib/api/data-contracts";
import { userInfoChange } from "@/lib/user/event";
import { formatToday } from "@/lib/date";

import styles from "./page.module.scss";
import MoodDashboard from "@/components/mood/dashboard/dashboard";

const Home: FC = () => {
  const [userInfo, setUserInfo] = useState<UserResponse>();

  const handleUserInfo = async (e: Event) => {
    const event = e as CustomEvent<UserResponse>;
    setUserInfo(event.detail);
  };

  useEffect(() => {
    document.addEventListener(userInfoChange, handleUserInfo);
    return () => document.removeEventListener(userInfoChange, handleUserInfo);
  }, []);

  const today = new Date();

  return (
    <>
      <section className={styles.homeGreetingSection}>
        <span className={styles.homeGreeting}>
          Hello, {userInfo?.fullName}!
        </span>
        <h1 className={styles.homeHeading}>How are you feeling today?</h1>
        <time className={styles.homeTime} dateTime={today.toISOString()}>
          {formatToday(today)}
        </time>
      </section>
      {userInfo && <MoodDashboard />}
    </>
  );
};

export default Home;
