import { FC } from "react";

import styles from "./header.module.scss";

export interface ILayoutHeader {}

const LayoutHeader: FC<ILayoutHeader> = ({}) => {
  return <header className={styles.header}></header>;
};

export default LayoutHeader;
