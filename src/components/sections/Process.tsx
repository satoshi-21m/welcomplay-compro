import { ProcessStep } from "../../types"

export function Process({
  title = "Proses Pengerjaan",
  steps,
  eyebrow,
  subtitle,
}: {
  title?: string
  steps: ProcessStep[]
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
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {steps.map((step, idx) => (
            <li key={step.id} className="bg-white rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full bg-custom-red text-white flex items-center justify-center font-bold text-xs sm:text-sm md:text-base flex-shrink-0">{idx+1}</div>
                {step.icon ? <step.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-custom-red flex-shrink-0" /> : null}
                <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-tight">{step.title}</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-600 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}


