import { FC } from "react";
import Link from "next/link";
import PATH from "@/utilities/paths";

const HomeLogo: FC = () => {
  return <Link href={PATH.HOME}>Mood tracker</Link>;
};

export default HomeLogo;
