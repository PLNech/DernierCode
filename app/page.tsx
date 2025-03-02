import DernierCode from '../components/DernierCode';
// import TradingGame from '../components/Level3';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-grow">
          <DernierCode startLevel={1} />
      </div>
      <Footer />
    </main>
  )
}
