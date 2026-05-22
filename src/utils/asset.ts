export const getAssetUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  // Server-side: use ASSET_URL, Client-side: use NEXT_PUBLIC_ASSET_URL
  const isServer = typeof window === "undefined";
  const assetDomain = isServer
    ? process.env.ASSET_URL
    : process.env.NEXT_PUBLIC_ASSET_URL || "";
  return `${assetDomain}${path}`;
};
