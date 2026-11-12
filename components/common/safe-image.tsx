"use client";

import { useState } from "react";
import ImagePrimitive, { type ImageProps } from "next/image";

import { FALLBACK_IMAGE, sanitizeImageSrc } from "@/lib/image";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt?: string;
};

export function SafeImage({ src, alt = "", ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const requested = sanitizeImageSrc(src) ?? FALLBACK_IMAGE;
  const resolved = failedSrc === requested ? FALLBACK_IMAGE : requested;

  return (
    <ImagePrimitive
      {...props}
      src={resolved}
      alt={alt}
      onError={() => setFailedSrc(requested)}
    />
  );
}
