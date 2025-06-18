import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  position: fixed;
  top: 5.5rem;
  left: 1.5rem;
  background: #f7f7f7;
  border: 1px solid #ccc;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 200;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 0.4rem;
`;

const ProjectInfo = () => {
  const [projectName, setProjectName] = useState('');
  const [chartType, setChartType] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('projectName');
    const chart = localStorage.getItem('chartType');
    if (name) setProjectName(name);
    if (chart) setChartType(chart);
  }, []);

  if (!projectName) return null; // Hide if no project

  return (
    <InfoContainer>
      <div>
        <Label>Project:</Label> {projectName}
      </div>
      <div>
        <Label>Chart Type:</Label> {chartType}
      </div>
    </InfoContainer>
  );
};

export default ProjectInfo;
