import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import Feature from '../components/Home/Feature';

const Home = ({ isDarkMode }) => {
  return (
    <div>
      <HeroSection isDarkMode={isDarkMode} />
      <Feature />
    </div>
  );
};

export default Home;
