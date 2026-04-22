import { Dispatch, FC, SetStateAction, useLayoutEffect, useRef } from "react";
import Image from "next/image";

import styles from "./trends-card.module.scss";

import { MoodResponse, SleepHours } from "@/lib/api/data-contracts";

import sleepIcon from "@/icons/sleep-icon.svg";
import TrendsBar from "./trends-bar/trends-bar";
import MonthPicker from "@/components/month-picker/month-picker";

interface ITrendsCard {
  customClass?: string;
  trends: MoodResponse[];
  trendsDate: Date;
  setTrendsDate: Dispatch<SetStateAction<Date>>;
}

const TrendsCard: FC<ITrendsCard> = ({
  customClass,
  trends,
  trendsDate,
  setTrendsDate,
}) => {
  const heading = "Mood and sleep trends";
  const sleepOptions = [
    { value: SleepHours.NinePlus, label: "9+ hours" },
    { value: SleepHours.SevenToEight, label: "7-8 hours" },
    { value: SleepHours.FiveToSix, label: "5-6 hours" },
    { value: SleepHours.ThreeToFour, label: "3-4 hours" },
    { value: SleepHours.ZeroToTwo, label: "0-2 hours" },
  ];

  const trendsElRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (trendsElRef.current) {
      trendsElRef.current.scrollTo({
        left: trendsElRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [trends]);

  return (
    <figure className={`${styles.trendsCard} ${customClass}`}>
      <figcaption className={styles.trendsCard_Heading}>{heading}</figcaption>
      <MonthPicker
        customClass={styles.trendsCard_MonthPicker}
        date={trendsDate}
        setDate={setTrendsDate}
      />
      <div className={styles.trendsCard_Chart} role="img">
        <ul className={styles.trendsCard_Chart_Yaxis}>
          {sleepOptions.map((option) => (
            <li
              key={option.value}
              className={styles.trendsCard_Chart_Yaxis_Item}
            >
              <Image src={sleepIcon} alt="Sleep Icon" width={10} height={10} />
              {option.label}
            </li>
          ))}
          <li className={styles.trendsCard_Chart_Yaxis_Item}></li>
        </ul>
        <ul ref={trendsElRef} className={styles.trendsCard_Chart_Xaxis}>
          {trends.map((mood, index) => (
            <TrendsBar
              key={(mood.moodName ?? "") + index}
              mood={mood}
              index={index}
            />
          ))}
        </ul>
      </div>
    </figure>
  );
};

export default TrendsCard;
