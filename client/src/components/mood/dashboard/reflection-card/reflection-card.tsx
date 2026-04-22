import { FC } from "react";
import Image from "next/image";
import styles from "./reflection-card.module.scss";

import reflectionIcon from "@/icons/reflection.svg";
import { MoodResponse } from "@/lib/api/data-contracts";

interface IReflectionCard {
  customClass?: string;
  todayMood: MoodResponse | null;
}

const ReflectionCard: FC<IReflectionCard> = ({ customClass, todayMood }) => {
  return (
    <section
      className={`${styles.reflectionCard} ${customClass} ${!todayMood?.analysis ? styles.isLoading : ""}`}
    >
      <h2 className={styles.reflectionCard_heading}>
        <Image
          src={reflectionIcon}
          alt="Reflection Icon"
          width={22}
          height={22}
        />
        Advice for the day
      </h2>
      <p className={styles.reflectionCard_analysis}>{todayMood?.advice}</p>
      <ul className={styles.reflectionCard_feelings}>
        {todayMood?.feelings?.map((feeling, i) => (
          <li key={i} className={styles.reflectionCard_feelings_item}>
            #{feeling}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReflectionCard;
