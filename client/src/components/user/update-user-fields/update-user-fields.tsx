import { ChangeEvent, FC, useLayoutEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./update-user-fields.module.scss";

import invalidIcon from "@/icons/invalid.svg";
import emptyAvatar from "@/icons/empty-avatar.jpg";

interface IUpdateUserFields {
  name?: string;
  avatarUrl?: null | string;
}

const UpdateUserFields: FC<IUpdateUserFields> = ({ name, avatarUrl }) => {
  const FULLNAME = "FullName";
  const AVATAR_IMAGE = "AvatarImage";

  const fileRef = useRef<HTMLInputElement>(null);

  const [avatarError, setAvatarError] = useState("");

  const [currentName, setCurrentName] = useState(name ?? "");
  const [currentFile, setCurrentFile] = useState<File>();
  const [currentAvatar, setCurrentAvatar] = useState<string | StaticImageData>(
    avatarUrl ?? emptyAvatar,
  );

  const setAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      let error: string | null = null;

      if (file.size > 250 * 1024) {
        error = "The file is larger than 250KB";
      }

      if (!["image/png", "image/jpeg"].includes(file.type)) {
        error = "Unsupported file type. Please upload a PNG or JPEG";
      }

      if (error) {
        const dt = new DataTransfer();
        if (currentFile) {
          dt.items.add(currentFile);
        }

        e.currentTarget.files = dt.files;
        setAvatarError(error);
        return;
      }

      setCurrentFile(file);
      setAvatarError("");
      setCurrentAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <fieldset className={styles["update-user-field-set"]}>
      <div className={styles["update-user-field-set_field-wrapper"]}>
        <label
          htmlFor={FULLNAME}
          className={styles["update-user-field-set_field-wrapper_label"]}
        >
          Name
        </label>
        <input
          required
          placeholder="Jane Appleseed"
          id={FULLNAME}
          name={FULLNAME}
          type="text"
          className={styles["update-user-field-set_field-wrapper_input"]}
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
        ></input>
      </div>
      <div
        className={`${styles["update-user-field-set_field-wrapper"]} ${styles["update-user-field-set_field-wrapper--avatar"]}`}
      >
        <Image
          alt="Avatar"
          className={styles["update-user-field-set_field-wrapper--avatar_img"]}
          src={currentAvatar}
          width={64}
          height={64}
        />
        <label
          htmlFor={AVATAR_IMAGE}
          className={styles["update-user-field-set_field-wrapper_label"]}
        >
          Upload Image
          <span
            id={`${AVATAR_IMAGE}_note`}
            className={styles["update-user-field-set_field-wrapper_note"]}
          >
            Max 250KB, PNG or JPEG
          </span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={
              styles["update-user-field-set_field-wrapper_input_upload-btn"]
            }
          >
            Upload
          </button>
          <input
            required
            id={AVATAR_IMAGE}
            name={AVATAR_IMAGE}
            ref={fileRef}
            type="file"
            accept="image/png, image/jpeg"
            className={styles["update-user-field-set_field-wrapper_input"]}
            aria-invalid={avatarError ? "true" : undefined}
            aria-describedby={`${AVATAR_IMAGE}_note`}
            aria-errormessage={
              avatarError ? `${AVATAR_IMAGE}_error` : undefined
            }
            onChange={setAvatar}
          ></input>
        </label>
        {avatarError && (
          <span
            id={`${AVATAR_IMAGE}_error`}
            className={styles["update-user-field-set_field-wrapper_error-msg"]}
            role="alert"
          >
            <Image src={invalidIcon} alt="Invalid Icon" />
            {avatarError}
          </span>
        )}
      </div>
    </fieldset>
  );
};

export default UpdateUserFields;
