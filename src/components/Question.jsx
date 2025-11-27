import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is the Bolo League?",
    answer:
      "The Bolo League is an online STEM competition that challenges students across Africa to test their knowledge in Biology, Chemistry, Physics, and Mathematics through exciting quizzes and live challenges.",
  },
  {
    question: "Who can participate in the Bolo League?",
    answer:
      "For now, participation is open only to secondary school students in Osun State, Nigeria.",
  },
  {
    question: "Can I register by myself?",
    answer:
      "No. Students cannot register individually — only schools in Osun State can register their students for the competition.",
  },
  {
    question: "Will the Bolo League expand beyond Osun State?",
    answer:
      "Yes! The League plans to expand to more states across Nigeria and eventually to other African countries in future seasons.",
  },
  {
    question: "What do winners receive?",
    answer:
      "Top-performing students and schools receive certificates, recognition, mentorship opportunities, and exciting prizes.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No. Participation in the Bolo League is completely free for all registered schools and their students.",
  },
];

const Question = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="Question" className="px-6 py-8 bg-white sm:py-12 sm:px-20">
      <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left side */}
        <div className="space-y-4">
          <p className="text-[#001489] text-sm font-semibold uppercase">
            FAQ’s
          </p>
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Our Frequently Asked Questions
          </h2>
          <p className="text-[#8F969A] text-sm max-w-md">
            Learn more about how the Bolo League works, who can participate, and
            what to expect.
          </p>
        </div>

        {/* Right side */}
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-[#F3F5FF] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <p className="text-[#001489] font-semibold">
                  {item.question}
                </p>
                {activeIndex === index ? (
                  <ChevronUp className="text-[#001489] w-5 h-5" />
                ) : (
                  <ChevronDown className="text-[#001489] w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.p
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#8F969A] text-sm mt-2 overflow-hidden"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Question;
