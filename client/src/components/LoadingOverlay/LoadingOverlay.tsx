"use client";

import { FC, useEffect, useRef, useState } from "react";
import styles from "./LoadingOverlay.module.scss";

interface ILoadingOverlay {
  isLoading: boolean;
}

const LoadingOverlay: FC<ILoadingOverlay> = ({ isLoading = true }) => {
  const SECONDS_LIMIT = 30;
  const [secondsPassed, setSecondPassed] = useState(0);
  const modal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isLoading) {
      setSecondPassed(SECONDS_LIMIT);
      modal.current?.classList.add("close");
      setTimeout(() => {
        modal.current?.close();
        setSecondPassed(0);
        modal.current?.classList.remove("close");
      }, 1500);
      return;
    }
    modal.current?.showModal();
    const intervalIndex = setInterval(() => {
      setSecondPassed((prev) => prev + 1);
    }, 1000);

    let secondIntervalIndex: NodeJS.Timeout;

    setTimeout(() => {
      clearInterval(intervalIndex);
      secondIntervalIndex = setInterval(() => {
        setSecondPassed((prev) => prev + 0.1);
      }, 1000);
      setTimeout(() => {
        if (secondIntervalIndex) clearInterval(secondIntervalIndex);
      }, 40000);
    }, 25000);

    return () => {
      clearInterval(intervalIndex);
      clearInterval(secondIntervalIndex);
    };
  }, [isLoading]);
  return (
    <dialog ref={modal} className={styles["loading-overlay"]}>
      Please wait for a while
      <progress
        className={styles["loading-overlay__bar"]}
        value={secondsPassed}
        max={SECONDS_LIMIT}
      ></progress>
    </dialog>
  );
};

export default LoadingOverlay;
