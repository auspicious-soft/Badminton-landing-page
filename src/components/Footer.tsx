import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";
import image from "../Group 1261153199.svg"; // Adjust the path as necessary

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <img src={image} alt="Logo" className="w-20 h-20" />
            </div>
            <span className="text-xl font-bold">Project Play App</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Terms and Conditions
            </Link>
            <a
              href="mailto:hello@Project Play App.com"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            © 2025 Project Play App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
