import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import { AboutContent } from "./AboutContent"

export const generateMetadata = () => {
  return {
    title: "Tentang Kami | Welcomplay",
    description: "Kenali WELCOMPLAY, perusahaan teknologi inovatif yang membantu bisnis Indonesia tumbuh secara digital dengan solusi teknologi terbaik."
  }
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#f5f6f7]">
        <AboutContent />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
