import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchProjectById } from '../../api/projectAPI';

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
  const [forecastDate, setForecastDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const projectId = localStorage.getItem('projectId');
      const token = localStorage.getItem('authToken');

      try {
        const project = await fetchProjectById(projectId, token);
        console.log('Fetched project:', project);

        if (project) {
          // Setting projectName and chartType, add forecastDate if available
          if (project.name) setProjectName(project.name);
          if (project.chartType) setChartType(project.chartType);
          if (project.forecastDate) {
            const date = new Date(project.forecastDate);
            setForecastDate(
              date.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            ); // Full date with weekday
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, []);

  if (!projectName) return null; // Hide if no project

  return (
    <InfoContainer>
      <div>
        <Label>Project:</Label> {projectName}
      </div>
      <div>
        <Label>Chart Type:</Label> {chartType || 'N/A'} {/* Show 'N/A' if chartType is empty */}
      </div>
      <div>
        <Label>Forecast Date:</Label> {forecastDate || 'N/A'} {/* Show 'N/A' if forecastDate is empty */}
      </div>
    </InfoContainer>
  );
};

export default ProjectInfo;
