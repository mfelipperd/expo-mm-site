import { ogImageAlt, ogImageContentType, ogImageSize, renderQueroExporOgImage } from "./_og-image";

export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderQueroExporOgImage();
}
