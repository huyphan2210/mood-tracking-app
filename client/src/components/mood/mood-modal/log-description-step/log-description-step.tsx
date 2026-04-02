import { FC } from "react";

import styles from "./log-description-step.module.scss";

import { AnalyzeMoodRequestPOST } from "@/lib/api/data-contracts";

interface ILogDescriptionStep {
  formData: AnalyzeMoodRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<AnalyzeMoodRequestPOST>>;
}

const LogDescriptionStep: FC<ILogDescriptionStep> = ({
  formData,
  setFormData,
}) => {
  const MAX_CHARACTERS = 150;
  const heading = "Write about your day...";
  return (
    <>
      <label
        htmlFor="moodDescription"
        className={styles.descriptionStep_Heading}
      >
        {heading}
      </label>
      <div>
        <textarea
          id="moodDescription"
          required
          className={styles.descriptionStep_Textarea}
          value={formData.moodDescription}
          onChange={(e) =>
            setFormData({ ...formData, moodDescription: e.target.value })
          }
          placeholder="Today, I felt..."
          maxLength={MAX_CHARACTERS}
        />
        <span className={styles.descriptionStep_CharacterCount}>
          {formData.moodDescription.length}/{MAX_CHARACTERS}
        </span>
      </div>
    </>
  );
};

export default LogDescriptionStep;
