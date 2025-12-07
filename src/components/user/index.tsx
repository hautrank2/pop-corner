"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { getPath } from "~/lib/navigate";
import { useApp } from "~/providers";
import { getAssetUrl } from "~/utils/asset";
import { Button } from "../ui/button";
import Image from "next/image";

export type UserAvatarProps = {};

export const UserAvatar = ({}: UserAvatarProps) => {
  const { state, actions } = useApp();
  const data = state.session?.userData;

  if (!data) {
    return (
      <Link href={getPath().login}>
        <Button variant={"link"}>Login</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="user-avatar flex items-center gap-4 cursor-pointer select-none">
          <Avatar>
            {data.avatarUrl && (
              <Image
                src={getAssetUrl(data.avatarUrl)}
                alt={data.name}
                height={32}
                width={32}
                className="object-cover"
              />
            )}
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>

          <span className="font-medium">{data.name}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            actions.onLogout();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
