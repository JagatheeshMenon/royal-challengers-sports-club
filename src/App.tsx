/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import DynamicContent from './components/DynamicContent';
import PerformerOfTheWeek from './components/PerformerOfTheWeek';
import Gallery from './components/Gallery';
import UpcomingMatch from './components/UpcomingMatch';
import About from './components/About';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';

function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Highlights />
        <DynamicContent />
        <PerformerOfTheWeek />
        <Gallery />
        <UpcomingMatch />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
