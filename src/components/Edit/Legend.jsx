import React from 'react';
import styled from '@emotion/styled';

// Styled Components
const Box = styled.div`
  position: fixed;
  bottom: .5rem;
  left: .5rem;
  width: 20rem;           // wider
  max-height: 15rem;      // shorter
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;  // rounded corners
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 50;
  overflow-y: auto;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e40af;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 0.25rem;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
`;

const SymbolWrapper = styled.span`
  width: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Line = styled.div`
  height: 0.25rem;
  width: 1rem;
  background-color: ${({ color }) => color};
  border-radius: ${({ rounded }) => (rounded ? '9999px' : '0')};
`;

const Letter = styled.span`
  font-weight: bold;
  font-size: 0.875rem;
  color: ${({ color }) => color};
`;

const Footer = styled.div`
  margin-top: 0.5rem;
  font-size: 0.65rem;
  display: flex;
  justify-content: space-between;
  color: #4b5563;

  strong {
    color: #1d4ed8;
  }
`;

// Legend item
const LegendItem = ({ label, symbol }) => (
    <ListItem>
        <SymbolWrapper>{symbol}</SymbolWrapper>
        <span>{label}</span>
    </ListItem>
);

// Final Component
const LegendBox = () => {
    return (
        <Box>
            <Title>Legend</Title>
            <List>
                <LegendItem label="Wave Heights" symbol={<Line color="#3b82f6" />} />
                <LegendItem
                    label="Tropical Cyclone"
                    symbol={
                        <img
                            src="/hurricane.png"
                            alt="Tropical Cyclone"
                            style={{ width: '1.2rem', height: '1.5rem', objectFit: 'contain' }}
                        />
                    }
                />
                <LegendItem label="LPA" symbol={<Letter color="#dc2626">L</Letter>} />
                <LegendItem label="HPA" symbol={<Letter color="#2563eb">H</Letter>} />
                <LegendItem label="Surface Fronts"
                    symbol={
                        <div
                            style={{
                                width: '1.5rem',
                                height: '0.25rem',
                                backgroundImage: 'linear-gradient(to right, #2563eb 25%, #ef4444 25%, #ef4444 50%, #2563eb 50%, #2563eb 75%, #ef4444 75%)',
                                backgroundSize: '100% 100%',
                                borderRadius: '0.25rem',
                            }}
                        />
                    }
                />
            </List>
            <Footer>
                <span>Checked: <strong>RBB</strong></span>
                <span>By: <strong>MACD</strong></span>
            </Footer>
        </Box>
    );
};

export default LegendBox;
