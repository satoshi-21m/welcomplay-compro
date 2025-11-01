import { CTAProps } from "../../types"

export function CTASection({ title, subtitle, buttonText, buttonHref }: CTAProps) {
  return (
    <section className="py-6 sm:py-8 md:py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-custom-red via-red-600 to-red-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
          {subtitle ? <p className="text-white/90 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">{subtitle}</p> : null}
          <a href={buttonHref} className="inline-flex px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white text-custom-red font-semibold hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base">{buttonText}</a>
        </div>
      </div>
    </section>
  )
}


