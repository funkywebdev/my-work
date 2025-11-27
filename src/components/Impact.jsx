import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  { number: 250, label: "Schools", suffix: "+" },
  { number: 5000, label: "Students", suffix: "+" },
  { number: 50000, label: "Prizes", prefix: "$" },
  { number: 30, label: "States Represented", suffix: "+" },
];

const Impact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // counts only once
    threshold: 0.3,    // 30% of element visible triggers the count
  });

  return (
    <div
      ref={ref}
      className="bg-[#F3F5FF] py-10 font-poppins overflow-hidden px-2 sm:px-10 md:px-16 lg:px-24"
    >
      {/* Heading Section */}
      <div className="mb-12 text-center">
        <p className="text-2xl font-bold md:text-2xl">
          Our Impacts
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-600 md:text-lg">
          Empowering the next generation of thinkers and innovators
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-[#001489]">
              {inView && (
                <CountUp
                  start={0}
                  end={stat.number}
                  duration={3} // slower counting
                  suffix={stat.suffix || ""}
                  prefix={stat.prefix || ""}
                />
              )}
            </p>
            <p className="text-xs font-medium text-gray-600 sm:text-sm md:text-base lg:text-lg">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Impact;
