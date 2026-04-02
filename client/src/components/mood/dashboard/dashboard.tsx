"use client";

import { FC, useState } from "react";
import styles from "./dashboard.module.scss";
import PrimaryButton from "../../primary-button/primary-button";
import MoodModal from "../mood-modal/mood-modal";

interface IMoodDashboard {}

const MoodDashboard: FC<IMoodDashboard> = ({}) => {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [todayMood, setTodayMood] = useState<string | null>(null);


  return (
    <>
      {!todayMood && (
        <>
          <PrimaryButton
            customClass={styles.logMoodBtn}
            content={"Log today's mood"}
            type="button"
            onClickHandler={() => {
              setIsMoodModalOpen(true);
            }}
          />
          <MoodModal
            isOpen={isMoodModalOpen}
            onClose={() => {
              setIsMoodModalOpen(false);
            }}
          />
        </>
      )}
      <section className={styles.moodDashboard}>
        {todayMood && (
          <>
            <section className={styles.moodDashboard_Feeling}></section>
            <section className={styles.moodDashboard_Sleep}></section>
            <section className={styles.moodDashboard_Reflection}></section>
          </>
        )}
        <section className={styles.moodDashboard_Average}></section>
        <section className={styles.moodDashboard_Trends}></section>
      </section>
    </>
  );
};

export default MoodDashboard;
