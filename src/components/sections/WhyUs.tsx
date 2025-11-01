import { WhyItem } from "../../types"

export function WhyUs({
  title = "Mengapa Harus Kami",
  items,
  eyebrow,
}: {
  title?: string
  items: WhyItem[]
  eyebrow?: string
}) {
  return (
    <section className="bg-white py-6 sm:py-10 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {eyebrow ? (
          <div className="text-custom-red/90 text-xs tracking-widest font-semibold uppercase mb-2">{eyebrow}</div>
        ) : null}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[3rem] leading-tight font-extrabold tracking-tight text-gray-900 mb-2">{title}</h2>
        <div className="h-1 w-12 bg-custom-red rounded-full mb-4 sm:mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-sm hover:shadow-md transition">
              {item.icon ? <item.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-custom-red mb-2 sm:mb-3" /> : null}
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-600 mb-3 sm:mb-4">{item.description}</p>
              {item.points && item.points.length > 0 ? (
                <ul className="space-y-1.5 sm:space-y-2">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-custom-red flex-shrink-0"></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


