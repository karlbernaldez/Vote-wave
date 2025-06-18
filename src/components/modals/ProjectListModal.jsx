import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns'; // Optional: for formatting time

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #222;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const ProjectItem = styled.button`
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f0faff;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 160, 255, 0.15);
  }

  h4 {
    margin: 0 0 0.3rem;
    font-size: 1.05rem;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  small {
    font-size: 0.75rem;
    color: #999;
    display: block;
    margin-top: 0.4rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #e53935;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #888;
  font-size: 0.95rem;
`;

const ProjectListModal = ({ visible, onClose, projects, onSelect }) => {
  if (!visible) return null;

  const handleSelect = (project) => {
    localStorage.setItem("projectId", project._id);
    localStorage.setItem("projectName", project.name);
    localStorage.setItem("chartType", project.chartType || '12');

    if (onSelect) onSelect(project);
    onClose();
    window.location.reload();
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Select a Project</Title>
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectItem key={project._id} onClick={() => handleSelect(project)}>
              <h4>{project.name}</h4>
              {project.description && <p>{project.description}</p>}
              {project.createdAt && (
                <small>
                  Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </small>
              )}
            </ProjectItem>
          ))
        ) : (
          <EmptyMessage>No projects found.</EmptyMessage>
        )}
      </ModalContainer>
    </Backdrop>
  );
};

export default ProjectListModal;
