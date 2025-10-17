import HomeAbout from "./HomeAbout";
import Carousel from "./Carousel";
import Contact from "./Contact";
import Footer from "./Footer";
import "./Home.css"; // new CSS for hero animation

function Home() {
  return (
    <div className="main-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to SAKEC</h1>
        <p className="hero-subtitle">
          Shaping the next generation of movers, thinkers, and innovators.
        </p>
      </section>

      <HomeAbout />
      <Carousel />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
