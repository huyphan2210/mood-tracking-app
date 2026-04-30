import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";
import styles from "./average-card.module.scss";
import AverageCardItem, {
  IAverageCardItem,
} from "./average-card-item/average-card-item";

import sleepIconWhite from "@/icons/sleep-icon-white.svg";

import increaseIcon from "@/icons/increase.svg";
import increaseWhiteIcon from "@/icons/increase-white.svg";
import decreaseIcon from "@/icons/decrease.svg";
import decreaseWhiteIcon from "@/icons/decrease-white.svg";
import sameIcon from "@/icons/same.svg";
import sameWhiteIcon from "@/icons/same-white.svg";

import Image from "next/image";
import { MoodResponse, MoodTrends } from "@/lib/api/data-contracts";
import {
  moodOptions,
  moodRecords,
  sleepOptions,
  sleepRecords,
} from "@/lib/mood/records";
import { averageIfAllDefined, fillMissingDates } from "@/lib/mood/utility";
import { getMoodTrendsByTime } from "@/services/mood/MoodServices";

interface IAverageCard {
  customClass?: string;
  todayMood?: MoodResponse | null;
}

const AverageCard: FC<IAverageCard> = ({ customClass, todayMood }) => {
  const missingHistoryMessage =
    "You missed some check-ins in the previous 5, keep tracking to see the comparison!";

  const computeAverages = (moods: MoodResponse[]) => {
    const avgMoodName = averageIfAllDefined(moods, (m) =>
      m.moodName !== undefined ? moodRecords[m.moodName].numValue : undefined,
    );
    const avgSleep = averageIfAllDefined(moods, (m) =>
      m.sleepHours !== undefined
        ? sleepRecords[m.sleepHours].numValue
        : undefined,
    );

    const avgMood = moodOptions.find((m) => m.numValue === avgMoodName)?.value;
    const avgSleepHours = sleepOptions.find(
      (s) => s.numValue === avgSleep,
    )?.value;

    return { avgMood, avgSleepHours };
  };

  const getDescriptionPrefix = (
    type: "mood" | "sleep",
    current?: number,
    previous?: number,
  ) => {
    if (!current) {
      return {
        description:
          type === "mood"
            ? "Log 5 consecutive check-ins to see your average mood."
            : "Track 5 consecutive nights to view average sleep.",
      };
    }

    if (!previous) {
      return {
        description: missingHistoryMessage,
      };
    }

    if (current > previous) {
      return {
        prefix: (
          <Image
            src={type === "mood" ? increaseIcon : increaseWhiteIcon}
            alt="Increase"
            width={24}
            height={24}
          />
        ),
        description: "Increase from the previous 5 check-ins",
      };
    }

    if (current < previous) {
      return {
        prefix: (
          <Image
            src={type === "mood" ? decreaseIcon : decreaseWhiteIcon}
            alt="Decrease"
            width={24}
            height={24}
          />
        ),
        description: "Decrease from the previous 5 check-ins",
      };
    }

    return {
      prefix: (
        <Image
          src={type === "mood" ? sameIcon : sameWhiteIcon}
          alt="Same"
          width={24}
          height={24}
        />
      ),
      description: "Same as the previous 5 check-ins",
    };
  };

  const averageItems = useCallback(
    (recentMoods?: MoodTrends | null): IAverageCardItem[] => {
      if (!recentMoods) {
        return [
          {
            heading: "Average Mood",
            subHeading: "(Last 5 check-ins)",
            cardTitle: "Keep tracking!",
            cardDescription:
              "Log 5 consecutive check-ins to see your average mood.",
            type: "mood",
          },
          {
            heading: "Average Sleep",
            subHeading: "(Last 5 check-ins)",
            cardTitle: "Not enough data yet!",
            cardDescription:
              "Track 5 consecutive nights to view average sleep.",
            type: "sleep",
          },
        ];
      }

      const firstFiveMood = recentMoods.moodList.slice(0, 5);
      const lastFiveMood = recentMoods.moodList.slice(-5);
      const { avgMood, avgSleepHours } = computeAverages(firstFiveMood);
      const { avgMood: avgMoodLast, avgSleepHours: avgSleepLast } =
        computeAverages(lastFiveMood);

      const { prefix: avgMoodPrefix, description: avgMoodDescription } =
        getDescriptionPrefix(
          "mood",
          avgMood ? moodRecords[avgMood].numValue : undefined,
          avgMoodLast ? moodRecords[avgMoodLast].numValue : undefined,
        );

      const { prefix: avgSleepPrefix, description: avgSleepDescription } =
        getDescriptionPrefix(
          "sleep",
          avgSleepHours ? sleepRecords[avgSleepHours].numValue : undefined,
          avgSleepLast ? sleepRecords[avgSleepLast].numValue : undefined,
        );

      return [
        {
          heading: "Average Mood",
          subHeading: "(Last 5 check-ins)",
          cardTitle: avgMood ? moodRecords[avgMood].label : "Keep tracking!",
          cardDescription: avgMoodDescription,
          cardDescriptionPrefix: avgMoodPrefix,
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
          cardDescription: avgSleepDescription,
          cardDescriptionPrefix: avgSleepPrefix,
          cardColor: avgSleepHours ? "blue" : undefined,
          cardTitlePrefix: avgSleepHours && (
            <Image src={sleepIconWhite} alt="Sleep" width={24} height={24} />
          ),
          type: "sleep",
        },
      ];
    },
    [],
  );

  const [recentMoods, setRecentMoods] = useState<MoodTrends | null>();

  const [items, setItems] = useState<IAverageCardItem[]>(
    averageItems(recentMoods),
  );

  useEffect(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const SixDaysAgo = new Date(today);
    SixDaysAgo.setTime(today.getTime() - 5 * 24 * 60 * 60 * 1000);
    SixDaysAgo.setHours(0, 0, 0, 0);
    getMoodTrendsByTime(SixDaysAgo, today).then((trends) => {
      trends.moodList = fillMissingDates(trends.moodList, SixDaysAgo, today);
      setRecentMoods(trends);
    });
  }, [todayMood]);

  useLayoutEffect(() => {
    if (recentMoods) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(averageItems(recentMoods));
    }
  }, [recentMoods, averageItems]);

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
