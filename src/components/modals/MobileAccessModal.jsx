import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';

// Overlay with fixed positioning and background
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Modal container with animation and responsive styling
const ModalContainer = styled(animated.div)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 85%;
  }
`;

// Modal component for mobile access restriction
const MobileAccessModal = ({ isOpen, onClose }) => {
  // Animation for the modal
  const modalStyles = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-50px)',
  });

  const modalShown = useRef(false); // Ref to track if the modal has been shown

  useEffect(() => {
    if (isOpen && !modalShown.current) {
      modalShown.current = true; // Set it to true once the modal is shown
    }
  }, [isOpen]);

  if (!isOpen || modalShown.current) return null; // Don't show the modal again if already shown

  return (
    <Overlay onClick={onClose}>
      <ModalContainer style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <h2>Access Restricted</h2>
        <p>
          You cannot access the Edit page on mobile. Please use a desktop.
        </p>
        <p>
          If you're on a desktop, please make sure your browser is in <strong>fullscreen mode</strong> for the best experience.
        </p>
        <button onClick={onClose}>Close</button>
      </ModalContainer>
    </Overlay>
  );
};

export default MobileAccessModal;
