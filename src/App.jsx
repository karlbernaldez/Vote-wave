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
import { ThemeProvider } from 'styled-components';
import { darkTheme, theme } from './styles/theme';

// Styled components for Layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: ${({ noScroll }) => (noScroll ? "hidden" : "auto")};
  overflow-x: hidden;
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")};

  background-color: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.colors.darkBackground : theme.colors.lightBackground};

  @media (max-width: 768px) {
    background: ${({ theme }) => theme.gradients.background};
  }
`;

const StickyHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ theme }) => theme.spacing.headerHeight};
  z-index: ${({ theme }) => theme.zIndex.stickyHeader};
  background: ${({ theme }) => theme.gradients.stickyHeader};
  backdrop-filter: blur(${({ theme }) => theme.blur.regular});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur.regular});
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.spacing.headerHeight};
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};
`;

const FreeSpace = styled.div`
  background-color: ${({ theme }) => theme.colors.highlight};
  height: ${({ theme }) => theme.spacing.freeSpaceHeight};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.freeSpaceMarginTop};
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.loadingBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.loadingScreen};
  color: ${({ theme }) => theme.colors.loadingText};
  font-size: 24px;
  font-weight: bold;
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.loadingSpinnerBorder};
  border-top: 4px solid ${({ theme }) => theme.colors.loadingSpinnerBorderTop};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${({ theme }) => theme.animations.spin};
`;

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isEditPage = location.pathname === '/edit';
  const [modalVisible, setModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    if (isMobile && isEditPage) {
      setModalVisible(true);
    }
  }, [isMobile, isEditPage]);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  const handleModalClose = () => {
    setModalVisible(false);
    setRedirect(true);
  };

  const handleRedirect = () => {
    window.location.reload();
  };

  if (redirect) {
    handleRedirect();
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      <AppContainer noScroll={isEditPage} isLoading={isLoading}>
        <StickyHeader isLoading={isLoading}>
          <HeaderNavbar isLoading={isLoading} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
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
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
            <Route
              path="/edit"
              element={isMobile ? (
                <MobileAccessModal isOpen={modalVisible} onClose={handleModalClose} />
              ) : (
                <Edit isDarkMode={isDarkMode} />
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
    </ThemeProvider>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
