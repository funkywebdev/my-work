import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Images
import khirat from "../assets/images/khirat.jpeg";
import Oladipo from "../assets/images/Oladipo.jpeg";
import Vera from "../assets/images/Vera.jpeg";
import Tega from "../assets/images/Tega.jpeg";
import Funke from "../assets/images/Funke.jpeg";
import John from "../assets/images/John.jpeg";

const teamMembers = [
  {
    img: Oladipo,
    name: "Oladipo Bolodeoku",
    role: "Founder and CFO",
    bio:
     "Oladipo Bolodeoku is a results-driven CFO with strong financial leadership across energy, technology, and operations. He is also the Founder of BOLO Quiz League, driving innovation in education through technology. He believes finance should guide growth, protect integrity, and turn numbers into clear direction."
  },
  {
    img: Tega,
    name: "Oladuntoye Oluwaseun",
    role: "Co-Founder and COO",
    bio:
      "Oluwaseun Oladuntoye is a business analyst, product manager, and Co-Founder of BOLO Quiz League. Leverages over 7 years of software engineering experience to manage operations on ground, drive innovation, and turn ideas into working solutions."
  },
  {
    img: John,
    name: "John Omotosho",
    role: "Backend Developer",
    bio: "John Omotosho is a software engineer with 4+ years of experience designing and building scalable backend systems, intelligent applications, and high-performance digital products."
  },
  {
    img: Funke,
    name: "Iyiola Funke",
    role: "Frontend Developer",
    bio: "Iyiola Funke is a Frontend Developer with  years of experience creating responsive and user-friendly web applications. Skilled in React, Tailwind CSS, and JavaScript, with a focus on clean code and seamless user experiences."
  },
  {
    img: khirat,
    name: "Khairat Abolarin",
    role: "Product Designer",
    bio: "Khairat Abolarin is a talented Product Designer who creates intuitive and engaging digital experiences. She combines creativity with user-centered design principles to craft visually appealing and functional products that delight users."
  },
  {
    img: Vera,
    name: "Vera Prestige Oloruntoba",
    role: "Project Support",
    bio: "Vera Prestige Oloruntoba supports project activities through coordination, communication, and administrative assistance, contributing to the overall success of the project."
  },
];


const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section
      id="Team"
      className="px-6 sm:px-16 md:px-20 lg:px-24 font-poppins py-10"
    >
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="text-3xl font-bold sm:text-4xl">Meet the Team</p>
        <p className="mt-2 font-medium text-gray-600 sm:text-lg">
          Our amazing and talented members
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center cursor-pointer"
          >
            <motion.img
              src={member.img}
              alt={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="object-cover w-64 h-74 mb-3 border-4 border-[#001489] rounded-xl shadow-md hover:shadow-lg transition-all"
            />
            <p className="text-lg font-semibold text-center">{member.name}</p>
            <p className="text-sm text-gray-500 text-center">{member.role}</p>
            <button
              className="mt-2 px-4 py-1 text-white bg-[#001489] rounded-lg hover:bg-[#001aa9] transition-all"
              onClick={() => setSelectedMember(member)}
            >
              Read Profile
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl text-center"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMember.img}
                alt={selectedMember.name}
                className="object-cover w-64 h-64 mx-auto mb-4 border-4 border-[#001489] rounded-xl"
              />

              <p className="text-2xl font-bold text-[#001489]">
                {selectedMember.name}
              </p>
              <p className="mt-1 font-medium text-gray-600">
                {selectedMember.role}
              </p>

              {selectedMember.bio && (
                <div className="mt-4 text-left text-gray-700 whitespace-pre-wrap">
                  {selectedMember.bio}
                </div>
              )}

              <button
                className="mt-6 px-6 py-2 bg-[#001489] text-white rounded-lg hover:bg-[#001aa9] transition-all"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;
