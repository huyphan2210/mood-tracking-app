import { FC } from "react";
import styles from "./footer.module.scss";

export interface ILayoutFooter {}

const LayoutFooter: FC<ILayoutFooter> = ({}) => {
  return <footer className={styles.footer}></footer>;
};

export default LayoutFooter;
