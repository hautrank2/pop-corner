const ASSET_DOMAIN = process.env.NEXT_PUBLIC_ASSET_URL;

export const getAssetUrl = (path: string) => {
  if(!path.startsWith('http')) {
    
  }
  return `${ASSET_DOMAIN}${path}`;
};
