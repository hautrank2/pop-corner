"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserModel } from "~/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getAssetUrl } from "~/utils/asset";
import { formatDateTime } from "~/utils/datetime";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { DatePicker } from "~/components/ui/date-picker";

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthday: z.string().min(1, "Birthday is required"),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 1MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only image files are allowed"
    )
    .optional()
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export type ProfileCardProps = {
  userData: UserModel;
  onSubmit: (values: ProfileFormValues) => void;
  loading?: boolean;
};
export const ProfileCard = ({
  userData,
  onSubmit,
  loading,
}: ProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>(getAssetUrl(userData.avatarUrl));

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: userData.name,
      birthday: userData.birthday,
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const avatarUrl = URL.createObjectURL(file);

    setAvatar(avatarUrl);
    form.setValue("avatar", file);
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <Image
              src={avatar}
              alt={userData.name}
              fill
              style={{ objectFit: "cover" }}
            />
            <AvatarFallback>{userData.name[0]}</AvatarFallback>
          </Avatar>

          <Button onClick={handleAvatarClick} variant={"outline"}>
            Change avatar
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onAvatarChange}
          />
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Birthday</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{userData.role}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {formatDateTime(userData.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">
                {formatDateTime(userData.updatedAt)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
