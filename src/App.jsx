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

// Styled components for Layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: ${({ noScroll }) => (noScroll ? "hidden" : "auto")};
  overflow-x: hidden;
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")}; /* Disable interactions when loading */

  @media (max-width: 768px) {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}
`;

const StickyHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 999;
  background: linear-gradient(to right, rgba(13, 13, 13, 0.7), rgba(33, 33, 33, 0.8));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px; /* Add space equal to header height */
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')}; /* Disable content interactions when loading */
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')}; /* Disable footer interactions when loading */
`;

const FreeSpace = styled.div`
  background-color: #01b0ef;
  height: 300px;
  width: 100%;
  margin-top: 200px;
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isEditPage = location.pathname === '/edit';
  const [modalVisible, setModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false); // Track when to redirect
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {
    if (isMobile && isEditPage) {
      setModalVisible(true); // Show the modal on mobile when accessing /edit page
    }
  }, [isMobile, isEditPage]);

  useEffect(() => {
    setIsLoading(true); // Start loading on route change

    const timer = setTimeout(() => {
      setIsLoading(false); // Stop loading after a brief delay (to simulate loading effect)
    }, 500); // You can adjust the delay time as needed

    return () => clearTimeout(timer); // Clean up timeout on route change
  }, [location]);

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
    <AppContainer noScroll={isEditPage} isLoading={isLoading}>
      <StickyHeader isLoading={isLoading}>
        <HeaderNavbar isLoading={isLoading} />
      </StickyHeader>

      <MainContent isLoading={isLoading}>
        {isLoading && (
          <LoadingScreen>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <LoadingSpinner />
              <div>Loading...</div>
            </div>
          </LoadingScreen>
        )}

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
        <FooterWrapper isLoading={isLoading}>
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