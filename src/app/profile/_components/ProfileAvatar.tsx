import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Avatar } from "~/components/ui/avatar";
import { UserModel } from "~/types/user";
import { getAssetUrl } from "~/utils/asset";

export const ProfileAvatar = ({ userData }: { userData: UserModel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>(userData.avatarUrl);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload file to API (Cloudinary/S3/Your API)
    // const avatarUrl = await uploadAvatar(file);

    const avatarUrl = URL.createObjectURL(file); // temp preview

    setAvatar(avatarUrl);

    // TODO: Call API to update avatar only
    // await axios.post('/api/profile/avatar', file)
  };
  return (
    <div className="relative cursor-pointer" onClick={handleAvatarClick}>
      <Image
        src={getAssetUrl(avatar)}
        alt={userData.name}
        style={{ objectFit: "cover" }}
        width={32}
        height={32}
        className="rounded-full"
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onAvatarChange}
      />
    </div>
  );
};
