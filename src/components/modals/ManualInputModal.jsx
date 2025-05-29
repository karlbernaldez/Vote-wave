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

const isValidFloat = (value) => {
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return false;
  return !isNaN(value) && !isNaN(parseFloat(value));
};

const ManualInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidFloat(lat)) {
      return alert('Please enter a valid latitude number.');
    }
    if (!isValidFloat(lng)) {
      return alert('Please enter a valid longitude number.');
    }
    if (!title.trim()) {
      return alert('Storm Title is required.');
    }

    onSubmit({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      title: title.trim(),
    });

    // Clear inputs after submit (optional)
    setLat('');
    setLng('');
    setTitle('');
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
            <form onSubmit={handleSubmit}>
              <Title>Enter Storm Marker</Title>
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
              <Input
                type="text"
                placeholder="Storm Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button type="submit">Submit</Button>
            </form>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ManualInputModal;
