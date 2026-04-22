import { FC } from "react";
import Image from "next/image";

import { AnalyzeMoodRequestPOST } from "@/lib/api/data-contracts";

import styles from "./log-mood-step.module.scss";

import { moodOptions } from "@/lib/mood/records";

interface ILogMoodStep {
  formData: AnalyzeMoodRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<AnalyzeMoodRequestPOST>>;
}

const LogMoodStep: FC<ILogMoodStep> = ({ formData, setFormData }) => {
  const heading = "How was your mood today?";

  return (
    <>
      <h3 className={styles.moodStep_Heading}>{heading}</h3>
      <ul className={styles.moodStep_List}>
        {moodOptions.map((option) => (
          <li key={option.value}>
            <label
              tabIndex={0}
              className={`
                ${styles.moodStep_List_Option} 
                ${formData.mood === option.value ? styles.chosen : ""}
              `}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector("input");
                  input?.click();
                }
              }}
            >
              <input
                tabIndex={-1}
                className={styles.moodStep_List_Option_Input}
                type="radio"
                name="mood"
                value={option.value}
                checked={formData.mood === option.value}
                onChange={() =>
                  setFormData({ ...formData, mood: option.value })
                }
              />
              <span className={styles.moodStep_List_Option_Label}>
                {option.label}
              </span>
              <Image
                src={option.icon}
                alt={option.label}
                width={38}
                height={38}
              />
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LogMoodStep;
