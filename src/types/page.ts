export type ServerSearchParamsDef = Promise<{
  [key: string]: Promise<{ [key: string]: string | string[] | undefined }>;
}>;
