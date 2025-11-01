import Image from "next/image"
import { cn } from "../../lib/utils"

export function ServiceHero({
  title,
  subtitle,
  image,
  reverse = false,
  mobileKeepImageFirst = false,
  ctaText,
  ctaHref,
  titleClassName,
  descClassName,
}: {
  title: string
  subtitle: string
  image?: { src: string; alt: string }
  reverse?: boolean
  mobileKeepImageFirst?: boolean
  ctaText?: string
  ctaHref?: string
  titleClassName?: string
  descClassName?: string
}) {
  return (
    <section className="bg-gradient-to-b from-[#f5f6f7] to-white py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 grid gap-4 sm:gap-6 md:gap-8 lg:gap-14 xl:gap-20 md:grid-cols-2 items-center">
        {image ? (
          <div className={`relative w-full aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl ${reverse ? (mobileKeepImageFirst ? 'order-1 md:order-2' : 'order-2 md:order-2') : 'order-1 md:order-1'}`}>
            <Image src={image.src} alt={image.alt} fill className="object-cover rounded-xl sm:rounded-2xl md:rounded-3xl" />
          </div>
        ) : null}
        <div className={`${reverse ? (mobileKeepImageFirst ? 'order-2 md:order-1' : 'order-1 md:order-1') : 'order-2 md:order-2'}`}>
          <h1 className={cn("font-extrabold text-gray-900 mb-2 sm:mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[3rem] leading-tight", titleClassName)}>{title}</h1>
          <p className={cn("text-gray-600 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[1.3rem] leading-relaxed", descClassName)}>{subtitle}</p>
          {ctaText && ctaHref ? (
            <a href={ctaHref} className="inline-flex px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-custom-red text-white font-semibold hover:bg-red-600 transition-colors text-xs sm:text-sm md:text-base">
              {ctaText}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}


