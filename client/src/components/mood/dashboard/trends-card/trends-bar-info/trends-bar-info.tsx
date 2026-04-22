import { FC } from "react";
import Image from "next/image";

import { MoodResponse } from "@/lib/api/data-contracts";
import { moodRecords, sleepRecords } from "@/lib/mood/records";

import styles from "./trends-bar-info.module.scss";
interface ITrendsBarInfo {
  mood: MoodResponse;
  index: number;
}

const TrendsBarInfo: FC<ITrendsBarInfo> = ({ mood, index }) => {
  return (
    <div
      id={(mood.moodName || "") + index + "popover"}
      className={styles.trendsCard_Chart_Xaxis_Item_Info}
      popover="hint"
    >
      {mood.moodName && (
        <section>
          <h4
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionHeading}
          >
            Mood
          </h4>
          <span className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionText}>
            <Image
              src={moodRecords[mood.moodName].icon}
              alt="Mood face"
              width={16}
              height={16}
            />
            {moodRecords[mood.moodName].label}
          </span>
        </section>
      )}
      {mood.sleepHours && (
        <section>
          <h4
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionHeading}
          >
            Sleep
          </h4>
          <span className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionText}>
            {sleepRecords[mood.sleepHours].label}
          </span>
        </section>
      )}
      {mood.advice && (
        <section>
          <h4
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionHeading}
          >
            Reflection
          </h4>
          <span
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionParagraph}
          >
            {mood.analysis}
          </span>
        </section>
      )}
      {mood.feelings && mood.feelings.length > 0 && (
        <section>
          <h4
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionHeading}
          >
            Tags
          </h4>
          <span
            className={styles.trendsCard_Chart_Xaxis_Item_Info_SectionParagraph}
          >
            {mood.feelings.join(", ")}
          </span>
        </section>
      )}
    </div>
  );
};

export default TrendsBarInfo;
