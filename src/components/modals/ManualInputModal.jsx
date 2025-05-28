import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ManualInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSubmit = () => {
    if (!lat || !lng) return alert('Both latitude and longitude are required.');
    onSubmit({ lat: parseFloat(lat), lng: parseFloat(lng) });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay onClick={onClose}>
          <ModalContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title>Enter Coordinates</Title>
            <Input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ManualInputModal;
