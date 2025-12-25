import dine from "../assets/Dine.jpg";
import "../styles/LandingPage.css";

export default function LandingPage() {
  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${dine})` }}
      >
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>
            Hey, <span>Thindaama?</span>
          </h1>
          <p>A place where good food meets good mood 🍽️</p>
        </div>
      </section>
    </>
  );
}
