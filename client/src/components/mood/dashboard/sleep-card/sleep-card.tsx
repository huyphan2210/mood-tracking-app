import { FC } from "react";
import Image from "next/image";

import styles from "./sleep-card.module.scss";
import sleepIcon from "@/icons/sleep-icon.svg";

import { MoodResponse } from "@/lib/api/data-contracts";
import { sleepRecords } from "@/lib/mood/records";

interface ISleepCard {
  customClass?: string;
  todayMood: MoodResponse | null;
}

const SleepCard: FC<ISleepCard> = ({ customClass, todayMood }) => {
  return (
    <section
      className={`${styles.sleepCard} ${customClass} ${!todayMood?.sleepHours ? styles.isLoading : ""}`}
    >
      <h2 className={styles.sleepCard_heading}>
        <Image src={sleepIcon} alt="Sleep Icon" width={22} height={22} />
        Sleep
      </h2>
      <span className={styles.sleepCard_info}>
        {todayMood?.sleepHours && sleepRecords[todayMood.sleepHours].label}
      </span>
    </section>
  );
};

export default SleepCard;
