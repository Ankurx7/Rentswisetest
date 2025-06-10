import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">

        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.linkedin.com/company/rentswise" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">
            <Linkedin size={28} />
          </a>
          <a href="https://www.facebook.com/rentswise" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
            <Facebook size={28} />
          </a>
          <a href="https://www.instagram.com/rentswise" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
            <Instagram size={28} />
          </a>
        </div>


        <div className="text-sm opacity-80">
          <Link to="/privacy-policy" className="mx-4 hover:underline">
            Privacy Policy
          </Link>
          |
          <Link to="/terms-conditions" className="mx-4 hover:underline">
            Terms & Conditions
          </Link>
        </div>


        <p className="text-xs opacity-70 mt-4">
          © {new Date().getFullYear()} Rentswise. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
