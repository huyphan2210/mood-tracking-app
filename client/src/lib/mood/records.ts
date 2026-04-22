import { MoodName, SleepHours } from "../api/data-contracts";

import moodVeryHappyIcon from "@/icons/mood-very-happy.svg";
import moodHappyIcon from "@/icons/mood-happy.svg";
import moodNeutralIcon from "@/icons/mood-neutral.svg";
import moodSadIcon from "@/icons/mood-sad.svg";
import moodVerySadIcon from "@/icons/mood-very-sad.svg";

import moodVeryHappyIconWhite from "@/icons/mood-very-happy-white.svg";
import moodHappyIconWhite from "@/icons/mood-happy-white.svg";
import moodNeutralIconWhite from "@/icons/mood-neutral-white.svg";
import moodSadIconWhite from "@/icons/mood-sad-white.svg";
import moodVerySadIconWhite from "@/icons/mood-very-sad-white.svg";

export const moodRecords: Record<
  MoodName,
  {
    value: MoodName;
    label: string;
    icon: any;
    iconWhite: any;
    color: "red" | "indigo" | "light-blue" | "green" | "amber";
    numValue: number;
  }
> = {
  [MoodName.VeryHappy]: {
    value: MoodName.VeryHappy,
    label: "Very Happy",
    icon: moodVeryHappyIcon,
    iconWhite: moodVeryHappyIconWhite,
    color: "amber",
    numValue: 5,
  },
  [MoodName.Happy]: {
    value: MoodName.Happy,
    label: "Happy",
    icon: moodHappyIcon,
    iconWhite: moodHappyIconWhite,
    color: "green",
    numValue: 4,
  },
  [MoodName.Neutral]: {
    value: MoodName.Neutral,
    label: "Neutral",
    icon: moodNeutralIcon,
    iconWhite: moodNeutralIconWhite,
    color: "light-blue",
    numValue: 3,
  },
  [MoodName.Sad]: {
    value: MoodName.Sad,
    label: "Sad",
    icon: moodSadIcon,
    iconWhite: moodSadIconWhite,
    color: "indigo",
    numValue: 2,
  },
  [MoodName.VerySad]: {
    value: MoodName.VerySad,
    label: "Very Sad",
    icon: moodVerySadIcon,
    iconWhite: moodVerySadIconWhite,
    color: "red",
    numValue: 1,
  },
};

export const moodOptions = Object.values(moodRecords);

export const sleepRecords: Record<
  SleepHours,
  { value: SleepHours; label: string; numValue: number }
> = {
  [SleepHours.NinePlus]: {
    value: SleepHours.NinePlus,
    label: "9+ hours",
    numValue: 5,
  },
  [SleepHours.SevenToEight]: {
    value: SleepHours.SevenToEight,
    label: "7-8 hours",
    numValue: 4,
  },
  [SleepHours.FiveToSix]: {
    value: SleepHours.FiveToSix,
    label: "5-6 hours",
    numValue: 3,
  },
  [SleepHours.ThreeToFour]: {
    value: SleepHours.ThreeToFour,
    label: "3-4 hours",
    numValue: 2,
  },
  [SleepHours.ZeroToTwo]: {
    value: SleepHours.ZeroToTwo,
    label: "0-2 hours",
    numValue: 1,
  },
};

export const sleepOptions = Object.values(sleepRecords);
