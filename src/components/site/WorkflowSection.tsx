"use client"

import { MessageCircle, Target, Lightbulb, Code, Rocket, HeadphonesIcon } from "lucide-react"
import SpotlightCard from "@/components/SpotlightCard"

export const WorkflowSection = () => {
  const steps = [
    {
      number: "01",
      icon: MessageCircle,
      title: "Konsultasi & Kenali Kebutuhan",
      description: "Kami mendengarkan tantangan bisnis Anda dan memahami goals yang ingin dicapai",
      gradient: "from-red-500 to-red-600"
    },
    {
      number: "02",
      icon: Target,
      title: "Analisis & Strategi",
      description: "Tim kami menganalisis dan menyusun strategi digital yang tepat untuk bisnis Anda",
      gradient: "from-red-600 to-orange-500"
    },
    {
      number: "03",
      icon: Lightbulb,
      title: "Presentasi Ide Kreatif",
      description: "Kami presentasikan konsep dan mockup untuk memastikan visi Anda terwujud",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      number: "04",
      icon: Code,
      title: "Eksekusi & Development",
      description: "Tim ahli kami mengeksekusi dengan quality control di setiap tahapan",
      gradient: "from-amber-500 to-yellow-500"
    },
    {
      number: "05",
      icon: Rocket,
      title: "Launch & Optimization",
      description: "Peluncuran dengan monitoring performa dan optimasi berkelanjutan",
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      number: "06",
      icon: HeadphonesIcon,
      title: "Support & Maintenance",
      description: "Dukungan teknis 24/7 dan pemeliharaan untuk memastikan performa optimal",
      gradient: "from-amber-600 to-orange-600"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-blue-100/90 via-red-100 to-white px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Cara Kerja{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
              Kami
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Proses yang transparan, terstruktur, dan berfokus pada hasil nyata untuk bisnis Anda
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <SpotlightCard
              key={index}
              className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm overflow-visible"
              spotlightColor={`rgba(${index === 0 ? '255, 99, 132' : index === 1 ? '255, 159, 64' : index === 2 ? '255, 205, 86' : index === 3 ? '75, 192, 192' : index === 4 ? '54, 162, 235' : '153, 102, 255'}, 0.25)`}
            >
              {/* Number Badge */}
              <div 
                className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 z-10`}
                style={{ opacity: 0.85 }}
              >
                <span className="text-sm sm:text-base lg:text-lg font-bold text-white">{step.number}</span>
              </div>

              {/* Icon */}
              <div 
                className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 backdrop-blur-sm border border-white/30`}
                style={{ opacity: 0.85 }}
              >
                <step.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1 sm:mb-1.5 leading-tight">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </SpotlightCard>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 sm:mt-12 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-red-100/50">
          <div className="text-center">
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2">
              Transparansi & Komunikasi adalah Prioritas Kami
            </h3>
            <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
              Anda akan mendapatkan update progress secara berkala dan bisa berkonsultasi kapan saja
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

