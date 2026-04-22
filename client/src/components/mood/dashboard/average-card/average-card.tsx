import { FC, useLayoutEffect, useState } from "react";
import styles from "./average-card.module.scss";
import AverageCardItem, {
  IAverageCardItem,
} from "./average-card-item/average-card-item";

import sleepIconWhite from "@/icons/sleep-icon-white.svg";
import sleepComparison from "@/icons/sleep-comparison.svg";
import reflectionIcon from "@/icons/reflection.svg";

import Image from "next/image";
import { MoodTrends } from "@/lib/api/data-contracts";
import {
  moodOptions,
  moodRecords,
  sleepOptions,
  sleepRecords,
} from "@/lib/mood/records";
import { averageIfAllDefined } from "@/lib/mood/utility";

interface IAverageCard {
  customClass?: string;
  moodTrends?: MoodTrends | null;
}

const AverageCard: FC<IAverageCard> = ({ customClass, moodTrends }) => {
  const averageItems = (moodTrends?: MoodTrends | null): IAverageCardItem[] => {
    if (!moodTrends) {
      return [
        {
          heading: "Average Mood",
          subHeading: "(Last 5 check-ins)",
          cardTitle: "Keep tracking!",
          cardDescription: "Log 5 check-ins to see your average mood.",
          type: "mood",
        },
        {
          heading: "Average Sleep",
          subHeading: "(Last 5 check-ins)",
          cardTitle: "Not enough data yet!",
          cardDescription: "Track 5 nights to view average sleep.",
          type: "sleep",
        },
      ];
    }

    const firstFiveMood = moodTrends.moodList.slice(0, 5);
    const avgMoodName = averageIfAllDefined(firstFiveMood, (m) =>
      m.moodName !== undefined ? moodRecords[m.moodName].numValue : undefined,
    );
    const avgSleep = averageIfAllDefined(firstFiveMood, (m) =>
      m.sleepHours !== undefined
        ? sleepRecords[m.sleepHours].numValue
        : undefined,
    );

    const avgMood = moodOptions.find((m) => m.numValue === avgMoodName)?.value;
    const avgSleepHours = sleepOptions.find(
      (s) => s.numValue === avgSleep,
    )?.value;

    return [
      {
        heading: "Average Mood",
        subHeading: "(Last 5 check-ins)",
        cardTitle: avgMood ? moodRecords[avgMood].label : "Keep tracking!",
        cardDescription: avgMood
          ? moodRecords[avgMood].label
          : "Log 5 check-ins to see your average mood.",
        cardDescriptionPrefix: avgMood && (
          <Image src={reflectionIcon} alt="Reflection Icon" />
        ),
        cardColor: avgMood ? moodRecords[avgMood].color : undefined,
        cardTitlePrefix: avgMood && (
          <Image
            src={moodRecords[avgMood].iconWhite}
            alt="Sleep"
            width={24}
            height={24}
          />
        ),
        type: "mood",
      },
      {
        heading: "Average Sleep",
        subHeading: "(Last 5 check-ins)",
        cardTitle: avgSleepHours
          ? sleepRecords[avgSleepHours].label
          : "Not enough data yet!",
        cardDescription: avgSleepHours
          ? sleepRecords[avgSleepHours].label
          : "Track 5 nights to view average sleep.",
        cardDescriptionPrefix: avgSleepHours && (
          <Image src={sleepComparison} alt="Sleep" />
        ),
        cardColor: avgSleepHours ? "blue" : undefined,
        cardTitlePrefix: avgSleepHours && (
          <Image src={sleepIconWhite} alt="Sleep" width={24} height={24} />
        ),
        type: "sleep",
      },
    ];
  };

  const [items, setItems] = useState<IAverageCardItem[]>(
    averageItems(moodTrends),
  );

  useLayoutEffect(() => {
    if (moodTrends) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(averageItems(moodTrends));
    }
  }, [moodTrends]);

  return (
    <ul className={`${styles.averageCard} ${customClass || ""}`}>
      {items.map(
        (
          {
            heading,
            subHeading,
            cardTitle,
            cardDescription,
            cardColor,
            type,
            cardTitlePrefix,
            cardDescriptionPrefix,
          },
          index,
        ) => (
          <AverageCardItem
            heading={heading}
            subHeading={subHeading}
            cardTitle={cardTitle}
            cardTitlePrefix={cardTitlePrefix}
            cardDescription={cardDescription}
            cardDescriptionPrefix={cardDescriptionPrefix}
            cardColor={cardColor}
            type={type}
            key={index + cardDescription}
          />
        ),
      )}
    </ul>
  );
};

export default AverageCard;
