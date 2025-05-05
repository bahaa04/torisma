import { Suspense } from "react";
import NavBar from '../components/navbar1';
import ProfileInformations from "../components/ProfileInformations";
import Footer from "../components/footer";

function Moi() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileInformations />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default Moi;