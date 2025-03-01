import DernierCode from '../components/DernierCode';
// import TradingGame from '../components/Level3';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountryInfluenceGame from "@/components/InfluenceCards";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-grow">
          <DernierCode startLevel={4} />
          {/*<CountryInfluenceGame />*/}
      </div>
      <Footer />
    </main>
  )
}
