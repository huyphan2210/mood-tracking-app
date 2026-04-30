"use client";

import { FC, useEffect, useState } from "react";
import styles from "./dashboard.module.scss";
import PrimaryButton from "../../primary-button/primary-button";
import MoodModal from "../mood-modal/mood-modal";
import {
  getMoodTrendsOfMonth,
  getTodayMood,
} from "@/services/mood/MoodServices";
import { MoodResponse, MoodTrends } from "@/lib/api/data-contracts";
import AverageCard from "./average-card/average-card";
import TrendsCard from "./trends-card/trends-card";
import FeelingCard from "./feeling-card/feeling-card";
import SleepCard from "./sleep-card/sleep-card";
import ReflectionCard from "./reflection-card/reflection-card";

interface IMoodDashboard {}

const MoodDashboard: FC<IMoodDashboard> = ({}) => {
  let getMoodTimes = 0;

  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [todayMood, setTodayMood] = useState<MoodResponse | null | undefined>();
  const [trendsDate, setTrendsDate] = useState<Date>(new Date());
  const [moodTrends, setMoodTrends] = useState<MoodTrends | null | undefined>();

  const handleMoodModalClose = async (isMoodCreated?: boolean) => {
    if (isMoodCreated) {
      setTodayMood(null);
      getTodayMood().then((mood) => {
        setTodayMood(mood);
        const isValid = mood?.advice && mood?.analysis;
        if (isValid) {
          setTrendsDate(new Date());
          return;
        }

        getMoodWithTimeout();
      });
    }

    setIsMoodModalOpen(false);
  };

  const getMoodWithTimeout = (timeout: number = 3000) => {
    setTimeout(() => {
      getTodayMood().then((mood) => {
        const isValid = mood?.advice && mood?.analysis;

        if (isValid || getMoodTimes === 2) {
          setTodayMood(mood);
          setTrendsDate(new Date());
          getMoodTimes = 0;
          return;
        }

        getMoodTimes += 1;
        getMoodWithTimeout(timeout);
      });
    }, timeout);
  };

  useEffect(() => {
    getTodayMood().then((mood) => {
      setTodayMood(mood);
    });
  }, []);

  useEffect(() => {
    getMoodTrendsOfMonth(trendsDate).then((trends) => {
      setMoodTrends(trends);
    });
  }, [trendsDate]);

  return (
    <>
      {todayMood === undefined && (
        <>
          <PrimaryButton
            customClass={styles.logMoodBtn}
            content={"Log today's mood"}
            type="button"
            onClickHandler={() => {
              setIsMoodModalOpen(true);
            }}
          />
          <MoodModal isOpen={isMoodModalOpen} onClose={handleMoodModalClose} />
        </>
      )}
      <section className={styles.moodDashboard}>
        {todayMood !== undefined && (
          <>
            <FeelingCard
              customClass={styles.moodDashboard_Feeling}
              todayMood={todayMood}
            />
            <SleepCard
              customClass={styles.moodDashboard_Sleep}
              todayMood={todayMood}
            />
            <ReflectionCard
              customClass={styles.moodDashboard_Reflection}
              todayMood={todayMood}
            />
          </>
        )}
        <AverageCard
          customClass={`
            ${styles.moodDashboard_Average} 
            ${todayMood !== undefined ? "" : styles.fullHeight}
          `}
          todayMood={todayMood}
        />
        <TrendsCard
          customClass={`
            ${styles.moodDashboard_Trends} 
            ${todayMood !== undefined ? "" : styles.fullHeight}
          `}
          trends={moodTrends?.moodList ?? []}
          trendsDate={trendsDate}
          setTrendsDate={setTrendsDate}
        />
      </section>
    </>
  );
};

export default MoodDashboard;
