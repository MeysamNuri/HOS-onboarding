import { Link } from "react-router";
import holooLogo from "@/core/assets/images/landing/landing-logo.png";

export default function LandingNavigation() {
  return (
    <nav className="hamrah-navigation" aria-label="منوی هلو همراه">
      <Link to="/holoo-hamrah" className="hamrah-brand" aria-label="صفحه اصلی هلو همراه">
        <img src={holooLogo} alt="هلو" width="44" height="48" />
      </Link>
   
    </nav>
  );
}
