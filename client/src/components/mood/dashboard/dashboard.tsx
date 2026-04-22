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
      getMoodWithTimeout();
    }

    setIsMoodModalOpen(false);
  };

  const getMoodWithTimeout = (timeout: number = 3000) => {
    if (todayMood?.advice || todayMood?.analysis || getMoodTimes === 3) {
      const today = new Date();
      setTrendsDate(today);
      getMoodTimes = 0;
      return;
    }

    setTimeout(() => {
      getTodayMood().then((mood) => {
        if (!mood?.advice || !mood.analysis) {
          getMoodTimes += 1;
          getMoodWithTimeout();
        }

        setTodayMood(mood);
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
          moodTrends={moodTrends}
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
