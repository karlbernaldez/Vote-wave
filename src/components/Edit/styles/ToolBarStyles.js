import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightBackground};
  border: 1px solid ${({ theme }) => theme.colors.toggleBorder};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  padding: 4px 8px;
  z-index: 1000;
  gap: 8px;
`;

export const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ active, theme }) =>
    active ? theme.activeButtonBackground : 'none'};
  border: none;
  border-radius: 6px;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  color: ${({ active, theme }) =>
    active ? theme.activeButtonColor : theme.buttonColor};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${({ theme }) => theme.buttonActiveBackground};
  }
`;

export const CollapseToggle = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  color: ${({ theme }) => theme.buttonColor};
  transition: transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.buttonHoverColor};
    transform: scale(1.1);
  }
`;
