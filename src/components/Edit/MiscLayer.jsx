import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


// Control Panel Container - Fixed size
const ControlPanelContainer = styled.div`
  position: fixed;
  top: 5rem;
  right: .5rem;  // Reduced space from the right
  background: ${({ theme }) => theme.colors.lightBackground};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  z-index: 200;
  width: 390px;  // Fixed width to avoid resizing
  height: 40px;  // Fixed height to ensure no resizing
  padding: ${({ theme }) => theme.spacing.xsmall};  // Reduced padding
  display: flex;
  flex-direction: row;  // Horizontal layout
  gap: ${({ theme }) => theme.spacing.small};  // Small gap between buttons
  align-items: center;  // Center items vertically
  justify-content: space-between;  // Space out the buttons equally

  @media (max-width: 768px) {
    width: 180px;  // Slightly narrower on smaller screens
  }
`;

// Grouped Button Section - Small gap between buttons
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;  // Horizontal button arrangement
  gap: ${({ theme }) => theme.spacing.small};  // Small gap
`;

// Button Style - Use text instead of icons with fixed width
const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.lightBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  width: 90px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.primaryActive};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }

  span {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // Border-right for all buttons except the last one
  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  }
`;

const ProjectInfo = ({ mapRef }) => {
    const [showPAR, setShowPAR] = useState(false);
    const [showTCID, setShowTCID] = useState(false);
    const [showTCAD, setShowTCAD] = useState(false);
    const [showWindLayer, setShowWindLayer] = useState(false);

    useEffect(() => {
        // Load layer visibility states from localStorage
        const layersState = {
            PAR: localStorage.getItem('PAR') === 'true',
            TCID: localStorage.getItem('TCID') === 'true',
            TCAD: localStorage.getItem('TCAD') === 'true',
            WindLayer: localStorage.getItem('wind_layer') === 'true',
        };

        // Set initial state based on localStorage
        setShowPAR(layersState.PAR);
        setShowTCID(layersState.TCID);
        setShowTCAD(layersState.TCAD);
        setShowWindLayer(layersState.WindLayer);

        // Ensure the map is loaded before setting visibility
        if (mapRef.current) {
            mapRef.current.on('load', () => {
                // Set visibility based on saved states from localStorage
                mapRef.current.setLayoutProperty('PAR', 'visibility', layersState.PAR ? 'visible' : 'none');
                mapRef.current.setLayoutProperty('TCID', 'visibility', layersState.TCID ? 'visible' : 'none');
                mapRef.current.setLayoutProperty('TCAD', 'visibility', layersState.TCAD ? 'visible' : 'none');
                mapRef.current.setLayoutProperty('wind-layer', 'visibility', layersState.WindLayer ? 'visible' : 'none');
            });
        }
    }, [mapRef]);

    const toggleLayer = (layer) => {
        const projectId = localStorage.getItem('projectId');
        if (!projectId) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Please select or create a project first.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        switch (layer) {
            case 'PAR':
                setShowPAR(prev => {
                    const newState = !prev;
                    localStorage.setItem('PAR', newState.toString());
                    mapRef.current?.setLayoutProperty('PAR', 'visibility', newState ? 'visible' : 'none');
                    return newState;
                });
                break;
            case 'TCID':
                setShowTCID(prev => {
                    const newState = !prev;
                    localStorage.setItem('TCID', newState.toString());
                    mapRef.current?.setLayoutProperty('TCID', 'visibility', newState ? 'visible' : 'none');
                    return newState;
                });
                break;
            case 'TCAD':
                setShowTCAD(prev => {
                    const newState = !prev;
                    localStorage.setItem('TCAD', newState.toString());
                    mapRef.current?.setLayoutProperty('TCAD', 'visibility', newState ? 'visible' : 'none');
                    return newState;
                });
                break;
            case 'Wind Layer':
                setShowWindLayer(prev => {
                    const newState = !prev;
                    localStorage.setItem('wind_layer', newState.toString());
                    mapRef.current?.setLayoutProperty('wind-layer', 'visibility', newState ? 'visible' : 'none');
                    return newState;
                });
                break;
            default:
                break;
        }
    };

    return (
        <ControlPanelContainer>
            <ButtonGroup>
                <Button onClick={() => toggleLayer('PAR')}>
                    <span>{showPAR ? 'Hide PAR' : 'Show PAR'}</span>
                </Button>
                <Button onClick={() => toggleLayer('TCID')}>
                    <span>{showTCID ? 'Hide TCID' : 'Show TCID'}</span>
                </Button>
                <Button onClick={() => toggleLayer('TCAD')}>
                    <span>{showTCAD ? 'Hide TCAD' : 'Show TCAD'}</span>
                </Button>
                <Button onClick={() => toggleLayer('Wind Layer')}>
                    <span>{showWindLayer ? 'Hide Wind' : 'Show Wind'}</span>
                </Button>
            </ButtonGroup>
        </ControlPanelContainer>
    );
};

export default ProjectInfo;
