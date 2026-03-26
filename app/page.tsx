

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import VisiMisiSection from "./VisiMisiSection";
import DasarHukumSection from "./DasarHukumSection";
import InformasiLainnyaSection from "../src/components/InformasiLainnyaSection";
import Footer from "./Footer";
import FloatingToolbar from "./FloatingToolbar";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <HeroSection />
      <VisiMisiSection />
      <DasarHukumSection />
      <Footer />
      {/* <FloatingToolbar /> */}
    </div>
  );
}
