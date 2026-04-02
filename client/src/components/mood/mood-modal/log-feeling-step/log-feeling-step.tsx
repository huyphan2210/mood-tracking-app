import { FC } from "react";

import { AnalyzeMoodRequestPOST, Feeling } from "@/lib/api/data-contracts";
import styles from "./log-feeling-step.module.scss";

interface ILogFeelingStep {
  formData: AnalyzeMoodRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<AnalyzeMoodRequestPOST>>;
}

const LogFeelingStep: FC<ILogFeelingStep> = ({ formData, setFormData }) => {
  const heading = "How did you feel?";
  const instruction = "Select up to three tags:";

  const handleFeelingChange = (feeling: Feeling, isChecked: boolean) => {
    if (isChecked) {
      if (formData.feelings.length < 3) {
        setFormData({
          ...formData,
          feelings: [...formData.feelings, feeling],
        });
      }
      return;
    }

    setFormData({
      ...formData,
      feelings: formData.feelings.filter((f) => f !== feeling),
    });
  };

  return (
    <>
      <div>
        <h3 className={styles.feelingStep_Heading}>{heading}</h3>
        <span className={styles.feelingStep_Instruction}>{instruction}</span>
      </div>
      <ul className={styles.feelingStep_List}>
        {Object.values(Feeling).map((feeling) => (
          <li key={feeling}>
            <label
              tabIndex={0}
              className={`
                ${styles.feelingStep_List_Option} 
                ${formData.feelings.includes(feeling) ? styles.chosen : ""} 
                ${
                  !formData.feelings.includes(feeling) &&
                  formData.feelings.length >= 3
                    ? styles.disabled
                    : ""
                }
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
                className={styles.feelingStep_List_Option_Input}
                disabled={
                  !formData.feelings.includes(feeling) &&
                  formData.feelings.length >= 3
                }
                type="checkbox"
                checked={formData.feelings.includes(feeling)}
                onChange={(e) => {
                  handleFeelingChange(feeling, e.target.checked);
                }}
              />
              <span className={styles.feelingStep_List_Option_Label}>
                {feeling}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LogFeelingStep;
