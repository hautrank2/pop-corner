"use client";

import { useState, useEffect } from "react";

export const useCookie = (name: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const get = () => {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      setValue(match ? decodeURIComponent(match[2]) : null);
    };

    get();
  }, [name]);

  return value;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  
  return match ? decodeURIComponent(match[2]) : null;
};
