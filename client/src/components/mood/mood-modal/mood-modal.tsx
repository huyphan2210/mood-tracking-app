import { FC, useState, SubmitEventHandler } from "react";
import styles from "./mood-modal.module.scss";

import Modal from "@/components/modal/modal";
import LogMoodStep from "./log-mood-step/log-mood-step";
import LogFeelingStep from "./log-feeling-step/log-feeling-step";
import LogDescriptionStep from "./log-description-step/log-description-step";
import LogSleepHoursStep from "./log-sleep-hours-step/log-sleep-hours-step";

import { ServiceError, BadServiceRequest } from "@/services/ServiceBase";
import PrimaryButton from "@/components/primary-button/primary-button";

import { AnalyzeMoodRequestPOST } from "@/lib/api/data-contracts";
import { createMood } from "@/services/mood/MoodServices";
import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";

interface IMoodModal {
  isOpen?: boolean;
  onClose: () => void;
}

const MoodModal: FC<IMoodModal> = ({ onClose, isOpen = false }) => {
  const MAX_PROGRESS = 100;
  const heading = "Log your mood";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<AnalyzeMoodRequestPOST>({
    feelings: [],
    moodDescription: "",
    mood: "",
    sleepHours: "",
  } as unknown as AnalyzeMoodRequestPOST);

  const submitHandler: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createMood(formData);
      onClose();
    } catch (error) {
      if (error instanceof ServiceError || error instanceof BadServiceRequest) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    <LogMoodStep
      formData={formData}
      setFormData={setFormData}
      key="log-mood-step"
    />,
    <LogFeelingStep
      formData={formData}
      setFormData={setFormData}
      key="log-feeling-step"
    />,
    <LogDescriptionStep
      formData={formData}
      setFormData={setFormData}
      key="log-description-step"
    />,
    <LogSleepHoursStep
      formData={formData}
      setFormData={setFormData}
      key="log-sleep-hours-step"
    />,
  ];

  const isContinueDisabled: Record<number, boolean> = {
    0: !formData.mood,
    1: formData.feelings.length === 0,
    2: !formData.moodDescription,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalAttributes={{ "aria-label": "Log Mood Modal" }}
    >
      <h2 className={styles.moodModal_Heading}>{heading}</h2>

      <form
        id={styles.moodModalForm}
        onSubmit={submitHandler}
        aria-describedby={
          errorMessage ? `${styles.moodModalForm}_err` : undefined
        }
      >
        <progress
          className={styles.moodModal_Progress}
          max={MAX_PROGRESS}
          value={(currentStep + 1) * (MAX_PROGRESS / steps.length)}
          aria-label="Logging Mood Progress"
        ></progress>
        {steps[currentStep]}
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${styles.moodModalForm}_err` }}
          />
        )}
        {currentStep < steps.length - 1 && (
          <PrimaryButton
            content="Continue"
            type="button"
            onClickHandler={() => setCurrentStep((prev) => prev + 1)}
            isDisabled={isContinueDisabled[currentStep]}
          />
        )}
        {currentStep === steps.length - 1 && (
          <PrimaryButton content="Submit" type="submit" isLoading={isLoading} />
        )}
      </form>
    </Modal>
  );
};

export default MoodModal;
