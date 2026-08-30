"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { assetUrl } from "@/lib/site";

/**
 * Every carousel asset uses the same natural size so switching slides never
 * shifts the page around the canvas frame.
 */
const SLIDES = [
  {
    src: assetUrl("/marketing/slideshow/ecommerce-platform-v2.png"),
    alt: "OpenDraw e-commerce platform architecture diagram",
    width: 1672,
    height: 941,
  },
  {
    src: assetUrl("/marketing/slideshow/realtime-collaboration-v2.png"),
    alt: "OpenDraw real-time collaboration architecture diagram",
    width: 1672,
    height: 941,
  },
  {
    src: assetUrl("/marketing/slideshow/realtime-analytics-v2.png"),
    alt: "OpenDraw real-time analytics pipeline diagram",
    width: 1672,
    height: 941,
  },
  {
    src: assetUrl("/marketing/slideshow/continuous-delivery-v2.png"),
    alt: "OpenDraw continuous delivery architecture diagram",
    width: 1672,
    height: 941,
  },
  {
    src: assetUrl("/marketing/slideshow/multi-region-reliability-v2.png"),
    alt: "OpenDraw multi-region reliability architecture diagram",
    width: 1672,
    height: 941,
  },
] as const;

const INTERVAL_MS = 3500;

export function FeatureHeroSlideshow() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const active = SLIDES[index];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="relative mx-auto max-w-[1260px] overflow-hidden rounded-[14px] border border-black/[0.08] bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.08)] md:p-3">
      <div className="flex h-9 items-center gap-2 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.15em] text-black/38">
          OpenDraw canvas
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-[8px] bg-[#f4f4f2] transition-[aspect-ratio] duration-500 ease-in-out motion-reduce:transition-none"
        style={{ aspectRatio: `${active.width} / ${active.height}` }}
      >
        {SLIDES.map((slide, imageIndex) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
            style={{
              opacity: imageIndex === index ? 1 : 0,
              transitionDuration: shouldReduceMotion ? "0ms" : "700ms",
            }}
            aria-hidden={imageIndex !== index}
          >
            <Image
              src={slide.src}
              alt={imageIndex === index ? slide.alt : ""}
              width={slide.width}
              height={slide.height}
              sizes="(min-width: 1280px) 1236px, (min-width: 768px) 90vw, 100vw"
              className="h-full w-full object-contain object-center"
              priority={imageIndex === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 pb-0.5 pt-1">
        {SLIDES.map((slide, dotIndex) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show example ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "true" : undefined}
            onClick={() => setIndex(dotIndex)}
            className={`h-1.5 rounded-full transition-all ${
              dotIndex === index ? "w-4 bg-black/75" : "w-1.5 bg-black/20 hover:bg-black/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
