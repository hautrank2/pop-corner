"use client";

import React, { useCallback } from "react";
import { ProfileCard, ProfileFormValues } from "./_components/ProfileCard";
import { AllProviders, useApp } from "~/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Page404 } from "~/components/pages";
import { httpClient, internalHttpClient } from "~/api";
import { UserModel } from "~/types/user";
import { toast } from "sonner";
import { SESSION_USER_LOCAL } from "~/lib/session";
import { Spin } from "~/components/ui/spin";

const ProfilePage = () => {
  return (
    <AllProviders>
      <_ProfilePage />
    </AllProviders>
  );
};

const _ProfilePage = () => {
  const { state } = useApp();
  const _userData = state.session?.userData;
  const userId = _userData?.id;
  const logined = !!userId;

  const {
    data: userData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      httpClient
        .get<UserModel | null>(`/api/user/${userId}`)
        .then((res) => res.data ?? null),
    enabled: logined,
  });

  const mutation = useMutation({
    mutationKey: ["user", "update", userId],
    mutationFn: (data: FormData) =>
      httpClient.put<UserModel>(`/api/user/${userId}`, data),
    onError: () => {
      toast.error("Update user failed");
    },
  });

  const handleSubmit = useCallback(async (values: ProfileFormValues) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });
    const res = await mutation.mutateAsync(data);
    const userData = res.data;
    await internalHttpClient.put(`/api/cookie/${SESSION_USER_LOCAL}`, userData);
    window.location.reload();
  }, []);

  if (!userData || isFetching) {
    return <Spin />;
  }

  if (!userData) {
    return <Page404 />;
  }

  return (
    <div className="profile-page mx-auto container pt-8">
      <ProfileCard
        userData={userData}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
      />
    </div>
  );
};

export default ProfilePage;
