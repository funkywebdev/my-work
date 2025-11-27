import React from 'react';
import { motion } from 'framer-motion';
import Frame9 from '../assets/images/Frame9.png';

const Hero = () => {
  return (
    <section id='Hero' className="flex flex-col items-center justify-between px-6 py-12 overflow-hidden bg-white md:px-16 md:flex-row font-poppins">
      {/* Left side - text */}
      <motion.div
        className="max-w-xl space-y-4 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <motion.p
          className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span style={{ color: '#F3CD01' }}>BOLO Quiz League 2025:</span>{' '}
          Where Learning Meets Competition
        </motion.p>

        <motion.p
          className="text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Challenge your mind and discover new possibilities in science,
          technology, engineering, and math.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 pt-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button className="bg-[#001489] text-white px-6 py-2 rounded-md hover:bg-[#001060] transition">
            Register Now
          </button>
          <button className="border border-[#001489] text-[#001489] px-6 py-2 rounded-md hover:bg-[#001489] hover:text-white transition">
            View Leaderboard
          </button>
        </motion.div>
      </motion.div>

      {/* Right side - image */}
      <motion.div
        className="mt-8 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
        viewport={{ once: true }}
      >
        <img
          src={Frame9}
          alt="Hero illustration"
          className="w-full max-w-[600px] mx-auto"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
