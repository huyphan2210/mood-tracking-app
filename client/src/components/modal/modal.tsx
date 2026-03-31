"use client";

import { FC, ReactNode, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./modal.module.scss";

import closeButton from "@/icons/close.svg";

export interface IModal {
  isOpen?: boolean;
  children: ReactNode;
  onClose: () => void;
}

const Modal: FC<IModal> = ({ children, onClose, isOpen = false }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialogEl = dialogRef.current;
    if (isOpen) {
      dialogEl?.showModal();
    } else {
      dialogEl?.close();
    }

    dialogEl?.addEventListener("close", onClose);

    return () => dialogEl?.removeEventListener("close", onClose);
  }, [isOpen, onClose]);

  return (
    <dialog className={styles.modal} ref={dialogRef}>
      <button className={styles.closeBtn} type="button" onClick={onClose}>
        <Image src={closeButton} alt="Close Button" width={15} height={15} />
      </button>
      {children}
    </dialog>
  );
};

export default Modal;
