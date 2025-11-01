import { PricingPlan } from "../../types"

export function Pricing({
  title = "Paket & Harga",
  plans,
  eyebrow,
  subtitle,
}: {
  title?: string
  plans: PricingPlan[]
  eyebrow?: string
  subtitle?: string
}) {
  return (
    <section className="bg-white py-6 sm:py-10 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {eyebrow ? (
          <div className="text-custom-red/90 text-xs tracking-widest font-semibold uppercase mb-2">{eyebrow}</div>
        ) : null}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[3rem] leading-tight font-extrabold tracking-tight text-gray-900 mb-2">{title}</h2>
        {subtitle ? (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mb-4 sm:mb-6">{subtitle}</p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-all duration-300 border-2 flex flex-col ${plan.borderColor ? plan.borderColor : (plan.highlight ? 'border-custom-red/30' : 'border-gray-200')}`}>
              {/* Badge Gradient di atas */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className={`bg-gradient-to-r ${plan.badgeGradient ?? 'from-gray-400 to-gray-600'} text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap`}>
                  {plan.name}
                </div>
              </div>

              {/* Header Pricing */}
              <div className="text-center mb-4 sm:mb-6 pt-4">
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">{plan.description}</p>
                {plan.originalPrice ? (
                  <div className="text-xs sm:text-sm text-gray-400 line-through">{plan.originalPrice}</div>
                ) : null}
                <div className="flex items-center gap-2 sm:gap-3 justify-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-custom-red">{plan.price}{plan.period ? <span className="text-xs sm:text-sm md:text-base font-medium text-gray-500">/{plan.period}</span> : null}</div>
                  {plan.discount ? (
                    <span className="inline-block bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">Hemat {plan.discount}</span>
                  ) : null}
                </div>
                {plan.badges && plan.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mt-2 sm:mt-3">
                    <span key={0} className="text-xs font-semibold px-2 py-1 rounded-full border border-gray-300 text-gray-600">{plan.badges[0]}</span>
                    {plan.badges.length > 1 && (
                      <span key={1} className="text-xs font-semibold px-2 py-1 rounded-full border border-gray-300 text-gray-600">{plan.badges[1]}</span>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Features dengan ikon check */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA gradient */}
              <div className="text-center mt-auto">
                <a href="#contact" className={`inline-block w-full bg-gradient-to-r ${plan.buttonGradient ?? 'from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800'} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-lg text-sm sm:text-base`}>
                  🚀 Pilih Paket Ini
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


