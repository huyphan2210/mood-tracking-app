"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  formatDateToMonthAndYear,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "@/lib/date";
import styles from "./month-picker.module.scss";

interface IMonthPicker {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  customClass?: string;
}

const MonthPicker: FC<IMonthPicker> = ({ customClass, date, setDate }) => {
  const today = new Date();

  const setMonth = (month: number) => {
    const tempDate = new Date(date);
    tempDate.setMonth(month);
    setDate(tempDate);
  };

  const setYear = (year: number) => {
    const tempDate = new Date(date);
    tempDate.setFullYear(year);
    setDate(tempDate);
  };

  return (
    <div className={`${customClass}`}>
      <button
        type="button"
        popoverTarget="monthPicker"
        className={styles.monthPicker_btn}
      >
        {formatDateToMonthAndYear(date)}
      </button>
      <div
        popover="auto"
        id="monthPicker"
        className={styles.monthPicker_popover}
      >
        <ul className={styles.monthPicker_popover_list}>
          {MONTH_OPTIONS.map((option, index) => (
            <li key={index} className={styles.monthPicker_popover_list_item}>
              <button
                type="button"
                className={`${date.getMonth() === option.value ? styles.chosen : ""}`}
                disabled={
                  today.getMonth() < option.value &&
                  date.getFullYear() >= today.getFullYear()
                }
                onClick={() => setMonth(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
        <ul className={styles.monthPicker_popover_list}>
          {YEAR_OPTIONS.map((year, index) => (
            <li key={index} className={styles.monthPicker_popover_list_item}>
              <button
                type="button"
                className={`${date.getFullYear() === year ? styles.chosen : ""}`}
                disabled={today.getFullYear() < year}
                onClick={() => setYear(year)}
              >
                {year}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonthPicker;
