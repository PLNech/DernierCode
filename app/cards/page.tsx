import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountryInfluenceGame from "@/components/InfluenceCards";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-grow">
          <CountryInfluenceGame />
      </div>
      <Footer />
    </main>
  )
}
