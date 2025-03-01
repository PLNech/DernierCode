import DernierCode from '../components/DernierCode';
import Level3 from '../components/Level3';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-grow">
        <Level3 />
      </div>
      <Footer />
    </main>
  )
}
