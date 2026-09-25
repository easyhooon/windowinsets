/** Original Samsung PNGs remain in the repository; static builds serve lossless WebP copies. */
export function skinAssetUrl(path: string): string {
  return import.meta.env.PROD ? path.replace(/\.png$/, ".webp") : path;
}
