import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: #222;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: #555;
`;

const FormControl = styled.div`
  width: 100%;
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $primary }) => ($primary ? '#0077cc' : '#eee')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ $primary }) => ($primary ? '#005fa3' : '#ddd')};
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
