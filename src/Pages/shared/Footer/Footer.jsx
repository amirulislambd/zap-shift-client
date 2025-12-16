import React from "react";
import ZapShiftLogo from "../ZapShiftLogo/ZapShiftLogo";
import { FaFacebookF, FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-no-repeat footer-horizontal footer-center bg-neutral text-neutral-content p-10">
      <aside data-aos="fade-up" data-aos-duration="3000" className="text-center">
        <ZapShiftLogo />
        <p className="font-bold mt-2">
          ACME Industries Ltd.
          <br />
          Providing reliable tech since 1992
        </p>
        <p className="mt-1">Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav className="mt-6">
        <div className="grid grid-flow-col gap-4 justify-center">
          <a
            href="https://www.facebook.com/profile.php?id=61583826647447"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-blue-600 hover:text-blue-800 transition-colors text-xl sm:text-2xl md:text-3xl" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="text-red-600 hover:text-red-800 transition-colors text-xl sm:text-2xl md:text-3xl" />
          </a>
          <a
            href="https://x.com/amirislambd313"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-sky-400 hover:text-sky-600 transition-colors text-xl sm:text-2xl md:text-3xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/md-amirul-islam-b60a283a0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-blue-700 hover:text-blue-900 transition-colors text-xl sm:text-2xl md:text-3xl" />
          </a>
          <a
            href="https://github.com/amirulislambd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-gray-200 hover:text-gray-500 transition-colors text-xl sm:text-2xl md:text-3xl" />
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
