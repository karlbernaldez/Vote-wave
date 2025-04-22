import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Edit from './pages/Edit';
import Weather from './pages/Marine';
import AboutUs from './pages/AboutUs';
import HeaderNavbar from "./components/Header";
import Footer from "./components/Footer";
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: ${({ noScroll }) => (noScroll ? 'hidden' : 'auto')};
`;

const StickyHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px; /* Add space equal to header height */
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
  margin-top: auto;
`;

const FreeSpace = styled.div`
  background-color: #01b0ef;
  height: 300px;
  width: 100%;
  margin-top: 200px;
`;

const Layout = () => {
  const location = useLocation();
  const isEditPage = location.pathname === '/edit';

  return (
    <AppContainer noScroll={isEditPage}>
      <StickyHeader>
        <HeaderNavbar />
      </StickyHeader>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>

        {!isEditPage && <FreeSpace />}
      </MainContent>

      {!isEditPage && (
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      )}
    </AppContainer>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
