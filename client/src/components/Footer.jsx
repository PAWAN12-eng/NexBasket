import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWarehouse,
  FaRocket,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const user = useSelector((state) => state.user);
  const [showContactForm, setShowContactForm] = useState(false);

  const socialIcons = [
    {
      icon: <FaFacebook />,
      color: "text-blue-500",
      name: "Facebook",
      url: "https://facebook.com",
    },
    {
      icon: <FaTwitter />,
      color: "text-sky-400",
      name: "Twitter",
      url: "https://twitter.com",
    },
    {
      icon: <FaInstagram />,
      color: "text-pink-500",
      name: "Instagram",
      url: "https://instagram.com",
    },
    {
      icon: <FaLinkedin />,
      color: "text-blue-400",
      name: "LinkedIn",
      url: "https://linkedin.com",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-50 to-blue-100 text-white pt-16 pb-8 relative overflow-hidden border-t">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0.2,
            }}
            animate={{
              x: [null, Math.random() * 100],
              y: [null, Math.random() * 100],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <FaRocket className="text-2xl text-indigo-500" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                Blink Commerce
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Revolutionizing e-commerce with quantum-speed deliveries and
              AI-powered logistics.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FaGlobe className="text-indigo-500" />
              <span>Global Operations Since 2016</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-black">Quantum Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  // to="/about"
                  className="text-gray-500 hover:text-indigo-500 transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  About Our Technology
                </Link>
              </li>
              <li>
                <Link
                  // to="/careers"
                  className="text-gray-500 hover:text-indigo-500 transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link
                  // to="/privacy"
                  className="text-gray-500 hover:text-indigo-500 transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Privacy Portal
                </Link>
              </li>
              <li>
                {/* <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="text-gray-500 hover:text-indigo-500 transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Contact Our AI
                </button> */}
              </li>
            </ul>
          </motion.div>

          {/* Warehouse CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-black">Neural Network</h3>
            <p className="text-gray-500 text-sm">
              Connect with our distributed warehouse intelligence network.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {(user.role === "ADMIN" || user.role === "WAREHOUSE") && (
                <Link
                  to="/warehouse-List"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-sm rounded-2xl shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-700 transition-all duration-300"
                >
                  <FaWarehouse className="mr-2 text-lg" />
                  Go to Warehouse Page
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/30"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaEnvelope className="text-indigo-400" />
                Quantum Contact Interface
              </h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Neural ID"
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Transmit your message across the quantum network..."
                    rows="3"
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Initiate Transmission
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left text-gray-400 text-sm"
          >
            <p>&copy; Blink Commerce Private Limited, 2016-2025</p>
            <p className="text-xs mt-1">
              All rights reserved across all dimensions.
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-6 text-2xl"
          >
            {socialIcons.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative ${social.color} transition-all`}
                onHoverStart={() => setHoveredIcon(index)}
                onHoverEnd={() => setHoveredIcon(null)}
                whileHover={{ y: -5 }}
              >
                {social.icon}
                <AnimatePresence>
                  {hoveredIcon === index && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 px-2 py-1 rounded whitespace-nowrap"
                    >
                      {social.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
