import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const About2 = () => {
  return (
    <section id='About2' className="px-6 sm:px-22">
      <div className="px-2 py-2 mt-4 bg-white font-poppins">
        {/* Intro */}
        <motion.div
          className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div variants={cardVariants} className="text-center md:text-left">
            <p className="text-xl font-bold sm:text-2xl md:text-3xl">
              How <span className="text-[#001489]">BOLO</span> Quiz League 2025 Works?
            </p>
            <p className="mt-2 text-gray-600 sm:text-base md:text-lg">
              Work in teams, tackle STEM problems, and compete for top scores — all online.
            </p>
          </motion.div>

          {/* Step 1 */}
          <motion.div
            variants={cardVariants}
            className="w-full p-6 text-black transition-all duration-300 ease-in-out bg-white border border-black shadow-md rounded-2xl md:w-1/3 hover:bg-black hover:text-white hover:scale-105"
          >
            <p className="text-3xl font-bold text-[#F3CD01]">01</p>
            <p className="mt-2 text-lg font-semibold">Register Online</p>
            <p className="mt-2 text-sm">
              Sign up as a team to join the BOLO STEM Competition 2025 — open to all
              secondary school students.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={cardVariants}
            className="w-full p-6 text-black transition-all duration-300 ease-in-out bg-white border border-black shadow-md rounded-2xl md:w-1/3 hover:bg-black hover:text-white hover:scale-105"
          >
            <p className="text-3xl font-bold text-[#F3CD01]">02</p>
            <p className="mt-2 text-lg font-semibold">Get Challenge Access</p>
            <p className="mt-2 text-sm">
              Join STEM challenges in science and math to test your creativity and teamwork.
            </p>
          </motion.div>
        </motion.div>

        {/* Step 3-5 */}
        <motion.div
          className="flex flex-col items-stretch justify-center gap-6 py-4 sm:py-6 md:flex-row sm:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {[3, 4, 5].map((step) => (
            <motion.div
              key={step}
              variants={cardVariants}
              className="w-full p-6 text-black transition-all duration-300 ease-in-out bg-white border border-black shadow-md rounded-2xl md:w-1/3 hover:bg-black hover:text-white hover:scale-105"
            >
              <p className="text-3xl font-bold text-[#F3CD01]">{`0${step}`}</p>
              <p className="mt-2 text-lg font-semibold">
                {step === 3
                  ? 'Compete Virtually'
                  : step === 4
                  ? 'Score & Advance'
                  : 'Celebrate & Win'}
              </p>
              <p className="mt-2 text-sm">
                {step === 3
                  ? 'Work with your team to tackle real-world STEM problems, quizzes, and tasks online.'
                  : step === 4
                  ? 'Earn points for accuracy, speed, and teamwork, and track your progress on the leaderboard.'
                  : 'Top teams reach the finals and earn certificates, prizes, and school recognition.'}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About2;
