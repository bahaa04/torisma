// src/pages/Moi.jsx
import { Suspense } from "react";
import NavBar from '../components/navbar1-connected';
import Sidebar from '../components/Sidebar';
import ProfileInformations from "../components/ProfileInformations";
import Footer from '../components/footer';

// make sure your ProfileInformations.css is imported somewhere globally
// (it already carries .profile-page-container, .profile-navigation and .profile-content)

function Moi() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* wrap sidebar + content in your “profile‑page‑container” */}
      <main className="flex-grow profile-page-container">
        <aside className="profile-navigation">
          <Sidebar />
        </aside>

        <section className="profile-content">
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileInformations />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Moi;
