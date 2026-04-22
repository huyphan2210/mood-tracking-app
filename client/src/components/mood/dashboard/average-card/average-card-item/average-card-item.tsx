import { JSX, FC } from "react";
import styles from "./average-card-item.module.scss";

interface IAverageCardMoodItem {
  heading: string;
  subHeading: string;
  cardColor?: "red" | "indigo" | "light-blue" | "green" | "amber" | "blue";
  type: "mood";
  cardTitle: string;
  cardTitlePrefix?: JSX.Element;
  cardDescription: string;
  cardDescriptionPrefix?: JSX.Element;
}

interface IAverageCardSleepItem extends Omit<IAverageCardMoodItem, "type"> {
  type: "sleep";
}

export type IAverageCardItem = IAverageCardMoodItem | IAverageCardSleepItem;

const AverageCardItem: FC<IAverageCardItem> = ({
  heading,
  subHeading,
  cardColor,
  cardTitle,
  cardTitlePrefix,
  cardDescription,
  cardDescriptionPrefix,
  type,
}) => {
  return (
    <li>
      <h2 className={styles.averageCard_Item_Heading}>
        {heading} <span>{subHeading}</span>
      </h2>
      <div
        className={`
          ${styles.averageCard_Item_Content} 
          ${cardColor ? styles[`bg-${cardColor}`] : ""} 
          ${type === "sleep" && cardColor ? styles.textWhite : ""}`}
      >
        <h3 className={styles.averageCard_Item_Content_Title}>
          {cardTitlePrefix}
          {cardTitle}
        </h3>
        <p
          className={`
            ${styles.averageCard_Item_Content_Description} 
            ${type === "mood" && cardColor ? styles.fullOpacity : ""}
          `}
        >
          {cardDescriptionPrefix}
          {cardDescription}
        </p>
      </div>
    </li>
  );
};

export default AverageCardItem;
