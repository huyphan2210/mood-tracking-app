import { FC } from "react";

import { AnalyzeMoodRequestPOST, SleepHours } from "@/lib/api/data-contracts";

import styles from "./log-sleep-hours.step.module.scss";

interface ILogSleepHoursStep {
  formData: AnalyzeMoodRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<AnalyzeMoodRequestPOST>>;
}

const LogSleepHoursStep: FC<ILogSleepHoursStep> = ({
  formData,
  setFormData,
}) => {
  const heading = "How many hours did you sleep last night?";
  const sleepOptions = [
    { value: SleepHours.NinePlus, label: "9+ hours" },
    { value: SleepHours.SevenToEight, label: "7-8 hours" },
    { value: SleepHours.FiveToSix, label: "5-6 hours" },
    { value: SleepHours.ThreeToFour, label: "3-4 hours" },
    { value: SleepHours.ZeroToTwo, label: "0-2 hours" },
  ];
  return (
    <>
      <h3 className={styles.sleepHoursStep_Heading}>{heading}</h3>
      <ul className={styles.sleepHoursStep_List}>
        {sleepOptions.map((option) => (
          <li key={option.value}>
            <label
              className={`
                ${styles.sleepHoursStep_List_Option}
                ${formData.sleepHours === option.value ? styles.chosen : ""}
              `}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector("input");
                  input?.click();
                }
              }}
            >
              <input
                className={styles.sleepHoursStep_List_Option_Input}
                tabIndex={-1}
                type="radio"
                name="mood"
                value={option.value}
                onChange={() =>
                  setFormData({ ...formData, sleepHours: option.value })
                }
              />
              <span className={styles.sleepHoursStep_List_Option_Label}>
                {option.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LogSleepHoursStep;
