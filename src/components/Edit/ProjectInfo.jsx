import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  position: fixed;
  top: 5.5rem;
  left: 1.5rem;
  background: ${({ theme }) => theme.colors.lightBackground};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  z-index: 200;
`;

const Label = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-right: ${({ theme }) => theme.spacing.xsmall};
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
