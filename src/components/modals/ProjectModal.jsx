import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: ${({ theme }) => theme.colors.loadingBackground || "rgba(0, 0, 0, 0.4)"};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.loadingScreen};
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.lightBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  width: 100%;
  max-width: 400px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormControl = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  border: 1px solid ${({ theme }) => theme.colors.border || "#ccc"};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.regular};
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.highlight}33;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  border: 1px solid ${({ theme }) => theme.colors.border || "#ccc"};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.regular};
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.highlight}33;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.small};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.medium}`};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.medium};
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.mainColors.blue : theme.colors.lightBackground};
  color: ${({ theme, $primary }) =>
    $primary ? theme.mainColors.white : theme.colors.textPrimary};

  &:hover {
    background-color: ${({ theme, $primary }) =>
      $primary ? theme.mainColors.lightBlue : "#ddd"};
  }
`;


const ProjectModal = ({
  visible,
  onClose,
  onSubmit,
  projectName,
  setProjectName,
  chartType,
  setChartType,
  description,
  setDescription,
}) => {
  if (!visible) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Title>Create New Project</Title>

        <FormControl>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="Enter project name"
            autoFocus
          />
        </FormControl>

        <FormControl>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter project description"
          />
        </FormControl>


        <FormControl>
          <Label htmlFor="chartType">Chart Type</Label>
          <Select
            id="chartType"
            value={chartType}
            onChange={e => setChartType(e.target.value)}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>
          </Select>
        </FormControl>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button $primary onClick={onSubmit}>Create</Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default ProjectModal;
