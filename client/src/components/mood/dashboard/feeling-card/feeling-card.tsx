import { FC } from "react";
import styles from "./feeling-card.module.scss";

import { MoodResponse } from "@/lib/api/data-contracts";
import { moodRecords } from "@/lib/mood/records";

import quoteIcon from "@/icons/quote.svg";
import Image from "next/image";

interface IFeelingCard {
  customClass?: string;
  todayMood: MoodResponse | null;
}

const FeelingCard: FC<IFeelingCard> = ({ customClass, todayMood }) => {
  return (
    <section
      className={`${styles.feelingCard} ${customClass} ${!todayMood ? styles.isLoading : ""}`}
    >
      <h2 className={styles.feelingCard_heading}>
        {todayMood?.moodName && (
          <>
            <span>I&apos;m feeling</span>{" "}
            {moodRecords[todayMood.moodName].label}
          </>
        )}
      </h2>
      <Image
        className={styles.feelingCard_face}
        src={todayMood?.moodName ? moodRecords[todayMood.moodName].icon : ""}
        alt="Mood face"
      />
      <p
        className={`${styles.feelingCard_motto} ${!todayMood?.motto ? styles.isLoading : ""}`}
      >
        {todayMood?.motto && (
          <>
            <Image src={quoteIcon} alt="Quote Icon" />“{todayMood.motto}”
          </>
        )}
      </p>
    </section>
  );
};

export default FeelingCard;
