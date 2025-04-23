import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Edit from './pages/Edit';
import Weather from './pages/Marine';
import AboutUs from './pages/AboutUs';
import HeaderNavbar from "./components/Header";
import Footer from "./components/Footer";
import styled from 'styled-components';
import useIsMobile from './hooks/useIsMobile';
import MobileAccessModal from './components/modals/MobileAccessModal';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: ${({ noScroll }) => (noScroll ? 'hidden' : 'auto')};
  overflow-x: hidden; /* Prevent horizontal scrolling */
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
  const isMobile = useIsMobile();
  const isEditPage = location.pathname === '/edit';
  const [modalVisible, setModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false); // Track when to redirect

  useEffect(() => {
    if (isMobile && isEditPage) {
      setModalVisible(true); // Show the modal on mobile when accessing /edit page
    }
  }, [isMobile, isEditPage]);

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
    setRedirect(true); // Trigger redirect when manually closed
  };

  // Refresh page after redirect
  const handleRedirect = () => {
    // Trigger a page refresh after the redirect
    window.location.reload();
  };

  if (redirect) {
    handleRedirect(); // Refresh the page
    return <Navigate to="/" replace />;
  }

  return (
    <AppContainer noScroll={isEditPage}>
      <StickyHeader>
        <HeaderNavbar />
      </StickyHeader>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/edit"
            element={isMobile ? (
              <>
                <MobileAccessModal
                  isOpen={modalVisible}
                  onClose={handleModalClose} // Close modal on button click
                />
              </>
            ) : (
              <Edit />
            )}
          />
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
