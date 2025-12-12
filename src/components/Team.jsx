import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Frame97 from "../assets/images/Frame97.png";
import Frame97a from "../assets/images/Frame97a.png";
import Frame97b from "../assets/images/Frame97b.png";
import Frame97c from "../assets/images/Frame97c.png";
import Frame97d from "../assets/images/Frame97d.png";
import Frame97e from "../assets/images/Frame97e.png";
import Frame97f from "../assets/images/Frame97f.png";

const teamMembers = [
  {
    img: Frame97,
    name: "Engr. Mikeal Aleem",
    role: "President",
    gender: "Male",
    department: "Engineering",
    hobbies: "Reading, Traveling, Mentorship",
  },
  {
    img: Frame97a,
    name: "Funke Ade",
    role: "Vice President",
    gender: "Female",
    department: "Design",
    hobbies: "Drawing, UI Design, Fashion",
  },
  {
    img: Frame97b,
    name: "Ayo Smith",
    role: "Graphic Designer",
    gender: "Male",
    department: "Media",
    hobbies: "Sketching, Branding, Photography",
  },
  {
    img: Frame97c,
    name: "Mikeal",
    role: "Tester",
    gender: "Male",
    department: "Quality Assurance",
    hobbies: "Gaming, Testing, Reading",
  },
  {
    img: Frame97d,
    name: "Sarah Lee",
    role: "Backend Dev",
    gender: "Female",
    department: "Software Engineering",
    hobbies: "Coding, AI Research, Music",
  },
  {
    img: Frame97e,
    name: "Tunde Ola",
    role: "Frontend Dev",
    gender: "Male",
    department: "Web Development",
    hobbies: "Design, Music, Football",
  },
  {
    img: Frame97f,
    name: "Janet Cole",
    role: "Support",
    gender: "Female",
    department: "Customer Success",
    hobbies: "Helping People, Reading",
  },
  {
    img: Frame97f,
    name: "Janet Cole",
    role: "Support",
    gender: "Female",
    department: "Customer Success",
    hobbies: "Helping People, Reading",
  },
];

const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="Team" className="px-6 sm:px-16 md:px-20 lg:px-24 font-poppins py-10">
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="text-3xl font-bold sm:text-4xl">Meet the Team</p>
        <p className="mt-2 font-medium text-gray-600 sm:text-lg">
          Our amazing and talented members
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center cursor-pointer"
          >
            <motion.img
              src={member.img}
              alt={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="object-cover w-64 h-64 mb-3 border-4 border-[#001489] rounded-xl shadow-md hover:shadow-lg transition-all"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm"
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
              <p className="text-2xl font-bold text-[#001489]">{selectedMember.name}</p>
              <p className="mt-1 font-medium text-gray-600">{selectedMember.role}</p>

              <div className="mt-4 space-y-1 text-left text-gray-700">
                <p><strong>Gender:</strong> {selectedMember.gender}</p>
                <p><strong>Department:</strong> {selectedMember.department}</p>
                <p><strong>Hobbies:</strong> {selectedMember.hobbies}</p>
              </div>

              <div className="flex justify-center gap-3 mt-5">
                <button
                  className="px-4 py-2 bg-[#001489] text-white rounded-lg hover:bg-[#001aa9] transition-all"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;
