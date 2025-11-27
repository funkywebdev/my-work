// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Sponsor from '../components/Sponsor';
import About from '../components/About';
import About2 from '../components/About2';
import Impact from '../components/Impact';
import Stem from '../components/Stem';
import Contact from '../components/Contact';
import Team from '../components/Team';
import Question from '../components/Question';
import Compete from '../components/Compete';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Sponsor />
      <About />
      <About2 />
      <Impact />
      <Stem />
      <Team />
       <Contact />
      <Question />
      <Compete />
      <Footer />
    </div>
  );
};

export default HomePage;
