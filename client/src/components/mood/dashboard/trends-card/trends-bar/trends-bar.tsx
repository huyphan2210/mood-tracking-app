import { FC, useLayoutEffect, useRef } from "react";
import Image from "next/image";

import { MoodResponse } from "@/lib/api/data-contracts";
import { moodRecords } from "@/lib/mood/records";

import TrendsBarInfo from "../trends-bar-info/trends-bar-info";
import styles from "./trends-bar.module.scss";
import infoStyles from "../trends-bar-info/trends-bar-info.module.scss";

interface ITrendsBar {
  mood: MoodResponse;
  index: number;
}

const TrendsBar: FC<ITrendsBar> = ({ mood, index }) => {
  const barRef = useRef<HTMLButtonElement>(null);

  const formatDate = (date?: string) => {
    if (!date) return;

    const theDate = new Date(date);

    const day = theDate.getDate();
    const month = theDate.toLocaleDateString("en-US", { month: "short" });

    return (
      <>
        <span>{month}</span> {day}
      </>
    );
  };

  const handlePopover = () => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const elementCenterX = rect.left + rect.width / 2;
    const viewportCenterX = window.innerWidth / 2;

    const isLeftHalf = elementCenterX < viewportCenterX;

    const popover = barRef.current?.popoverTargetElement;

    if (isLeftHalf) {
      popover?.classList.add(infoStyles.leftToRight);
    } else {
      popover?.classList.remove(infoStyles.leftToRight);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const container = e.currentTarget.parentElement?.parentElement;

    const focusables = Array.from(
      container?.querySelectorAll<HTMLElement>("button") ?? [],
    ).filter((el) => !el.hasAttribute("disabled"));

    const currentIndex = focusables.indexOf(
      document.activeElement as HTMLElement,
    );

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      const next = focusables[currentIndex + 1] ?? focusables[0];
      next?.focus();
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();

      const prev =
        focusables[currentIndex - 1] ?? focusables[focusables.length - 1];
      prev?.focus();
    }
  };

  useLayoutEffect(() => {
    handlePopover();
    window.addEventListener("resize", handlePopover);

    return () => window.removeEventListener("resize", handlePopover);
  }, []);

  return (
    <li className={styles.trendsCard_Chart_Xaxis_Item}>
      <button
        ref={barRef}
        disabled={!mood.moodName}
        id={(mood.moodName ?? "") + index}
        className={`
          ${styles.trendsCard_Chart_Xaxis_Item_Bar}
          ${mood.moodName ? styles[`bg-${moodRecords[mood.moodName].color}`] : ""}
        `}
        popoverTarget={(mood.moodName ?? "") + index + "popover"}
        onMouseEnter={(e) => e.currentTarget.focus()}
        onMouseLeave={(e) => {
          e.currentTarget.blur();
          (e.currentTarget.popoverTargetElement as HTMLElement).hidePopover();
        }}
        onFocus={(e) => e.currentTarget.click()}
        onClick={handlePopover}
        onKeyDown={handleKeyDown}
      >
        {mood.moodName && (
          <Image
            src={moodRecords[mood.moodName].iconWhite}
            alt="Sleep"
            width={30}
            height={30}
          />
        )}
      </button>
      <label
        htmlFor={(mood.moodName ?? "") + index}
        className={styles.trendsCard_Chart_Xaxis_Item_Label}
      >
        {formatDate(mood.date)}
      </label>
      {mood.moodName && <TrendsBarInfo index={index} mood={mood} />}
    </li>
  );
};

export default TrendsBar;
