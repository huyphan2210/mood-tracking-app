"use client";

import { FC, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import styles from "./header.module.scss";
import HomeNavigation from "@/components/home-navigation/home-navigation";

import PATH, { AUTH_ONBOARDING_PATHS } from "@/lib/paths";
import { UserResponse } from "@/lib/api/data-contracts";
import { userInfoChange } from "@/lib/user/event";

import emptyAvatar from "@/icons/empty-avatar.jpg";
import dropdownArrow from "@/icons/dropdown-arrow.svg";
import cogWheel from "@/icons/cog.svg";
import logoutSvg from "@/icons/logout.svg";
import UpdateProfileModal from "@/components/user/update-profile-modal/update-profile-modal";
import { getUser } from "@/services/user/UserServices";
import { logout } from "@/services/auth/AuthenticationService";

export interface ILayoutHeader {}

const LayoutHeader: FC<ILayoutHeader> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserResponse>();
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const dispatchUserInfoEvent = async (userInfo: UserResponse) => {
    document.dispatchEvent(
      new CustomEvent<UserResponse>(userInfoChange, {
        detail: userInfo,
      }),
    );
  };

  const handleUpdateProfileClose = (userInfoChanged?: boolean) => {
    if (userInfoChanged) {
      getUser().then((userInfo) => {
        setUserInfo(userInfo);
        dispatchUserInfoEvent(userInfo);
      });
    }

    setIsUpdateProfileModalOpen(false);
  };

  const logOut = async () => {
    await logout();
    router.push(PATH.LOGIN);
  };

  const profileActions = [
    {
      icon: cogWheel,
      name: "Update Profile",
      action: () => setIsUpdateProfileModalOpen(true),
    },
    {
      icon: logoutSvg,
      name: "Logout",
      action: logOut,
    },
  ];

  useEffect(() => {
    if (!AUTH_ONBOARDING_PATHS.includes(pathname)) {
      getUser().then((userInfo) => {
        dispatchUserInfoEvent(userInfo);
        setUserInfo(userInfo);
      });
    }
  }, [pathname]);

  return (
    !AUTH_ONBOARDING_PATHS.includes(pathname) && (
      <header className={styles.header}>
        <HomeNavigation />
        <button
          className={styles.headerProfile}
          type="button"
          popoverTarget="profile-menu"
        >
          <Image
            src={userInfo?.avatarURL ?? emptyAvatar}
            className={styles.headerProfileAvatar}
            alt="Avatar Image"
            width={42.5}
            height={42.5}
          ></Image>
          <Image src={dropdownArrow} alt="Dropdown arrow"></Image>
        </button>
        <div
          ref={profileMenuRef}
          className={styles.headerProfileMenu}
          popover="auto"
          id="profile-menu"
        >
          <span className={styles.headerProfileMenuName}>
            {userInfo?.fullName}
          </span>
          <span className={styles.headerProfileMenuEmail}>
            {userInfo?.email}
          </span>
          <ul className={styles.headerProfileMenuActions}>
            {profileActions.map((value, index) => (
              <li key={`${value.name}_${index}`}>
                <button
                  className={styles.headerProfileMenuActionsItemBtn}
                  onClick={value.action}
                  type="button"
                >
                  <Image
                    src={value.icon}
                    alt={`${value.name} icon`}
                    width={16}
                    height={16}
                  ></Image>
                  <span className={styles.headerProfileMenuActionsItemBtnName}>
                    {value.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <UpdateProfileModal
          userInfo={userInfo}
          isOpen={isUpdateProfileModalOpen}
          onClose={handleUpdateProfileClose}
        ></UpdateProfileModal>
      </header>
    )
  );
};

export default LayoutHeader;
