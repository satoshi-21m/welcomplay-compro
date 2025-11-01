import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import { ContactContent } from "./ContactContent"

export const generateMetadata = () => {
  return {
    title: "Kontak | Welcomplay",
    description: "Hubungi tim ahli WELCOMPLAY untuk konsultasi gratis dan solusi teknologi terbaik untuk bisnis Anda."
  }
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#f5f6f7]">
        <ContactContent />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
