import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { fetchProjectById } from '../../api/projectAPI';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { updateProjectById, deleteProjectById } from '../../api/projectAPI';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { FaChevronDown } from 'react-icons/fa';

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
  cursor: pointer;
`;

const Label = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-right: ${({ theme }) => theme.spacing.xsmall};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.loadingBackground || 'rgba(0, 0, 0, 0.4)'};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal || 1000};
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.lightBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 100%;
  max-width: 380px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  width: 94%;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.highlight}33;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.large} ${theme.spacing.xsmall} ${theme.spacing.small}`};
  border: 1px solid ${({ theme }) => theme.colors.border || "#ccc"};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.regular};
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.highlight}33;
  }
`;

const ChevronIcon = styled(FaChevronDown)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing.small};
  transform: translateY(-50%) ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.medium}`};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ disabled, danger, theme }) =>
    disabled ? '#ccc' : danger ? theme.mainColors.white : theme.colors.textPrimary};
  background-color: ${({ disabled, danger, theme }) =>
    disabled ? '#e0e0e0' : danger ? '#e74c3c' : theme.mainColors.blue};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
  }
`;

const ProjectInfo = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [chartType, setChartType] = useState('');
  const [forecastDate, setForecastDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedChart, setEditedChart] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const projectId = localStorage.getItem('projectId');
      const token = localStorage.getItem('authToken');

      try {
        const project = await fetchProjectById(projectId, token);
        if (project) {
          setProjectName(project.name);
          setChartType(project.chartType);
          const date = new Date(project.forecastDate);
          const formatted = date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          setForecastDate(formatted);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setEditedName(projectName);
    setEditedChart(chartType);
    setEditedDate(forecastDate);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const projectId = localStorage.getItem('projectId');

      if (!token || !projectId) {
        console.error('Missing token or project ID');
        return;
      }

      const projectData = {
        name: editedName,
        chartType: editedChart,
        forecastDate: editedDate,
      };

      const updatedProject = await updateProjectById(projectId, projectData, token);

      setProjectName(updatedProject.name);
      setChartType(updatedProject.chartType);
      setForecastDate(updatedProject.forecastDate);

      setModalOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Project updated successfully!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error updating project',
        text: error.message || 'An unexpected error occurred',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      console.error('Error updating project:', error);
    }
  };

  const handleDelete = () => {
    setDeleteInput('');
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteInput === projectName) {
      try {
        const token = localStorage.getItem('authToken');
        const projectId = localStorage.getItem('projectId');

        // Delete the project using the API
        await deleteProjectById(projectId, token);

        // Show success toast
        Swal.fire({
          icon: 'success',
          title: 'Project deleted successfully!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          // Clear localStorage values related to the project
          localStorage.removeItem('projectId');
          localStorage.removeItem('projectName');
          localStorage.removeItem('chartType');
          localStorage.removeItem('forecastDate');

          // Optionally reload or redirect the page after successful deletion
          window.location.reload();
        });

        // Close the delete confirmation modal
        setShowDeleteConfirm(false);
      } catch (error) {
        // Show error toast in case of failure
        Swal.fire({
          icon: 'error',
          title: 'Error deleting project',
          text: error.message || 'An unexpected error occurred',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } else {
      // Show warning if project name does not match
      Swal.fire({
        icon: 'warning',
        title: 'Confirmation failed',
        text: 'Project name does not match. Please try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  if (!projectName) return null;

  return (
    <>
      <InfoContainer onClick={openModal}>
        <div><Label>Project:</Label>{projectName}</div>
        <div><Label>Chart Type:</Label>{chartType || 'N/A'}</div>
        <div><Label>Forecast Date:</Label>{forecastDate || 'N/A'}</div>
      </InfoContainer>

      {modalOpen && (
        <Overlay onClick={() => setModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h2>Edit Project Info</h2>
            <Field>
              <label>Project Name</label>
              <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            </Field>
            <Field>
              <label>Chart Type</label>
              <SelectWrapper>
                <StyledSelect
                  id="chartType"
                  value={editedChart}
                  onChange={(e) => setEditedChart(e.target.value)}
                >
                  <option value="Wave Analysis">Wave Analysis</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </StyledSelect>
                <ChevronIcon />
              </SelectWrapper>
            </Field>
            <Field>
              <label>Forecast Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(new Date(editedDate))}
                  onChange={(newValue) => {
                    if (newValue) {
                      const formatted = new Date(newValue).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                      setEditedDate(formatted);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'standard',
                      InputProps: {
                        disableUnderline: true,
                        sx: {
                          backgroundColor: theme.colors.background,
                          borderRadius: theme.borderRadius.medium,
                          fontFamily: theme.fonts.regular,
                          fontSize: theme.fontSizes.medium,
                          color: theme.colors.textPrimary,
                          height: '40px',
                          paddingLeft: theme.spacing.small,
                          border: `1px solid #ccc`,
                          '& input': {
                            textAlign: 'left',
                          },
                          '&:hover': {
                            borderColor: theme.colors.highlight,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.colors.highlight,
                            boxShadow: `0 0 0 2px ${theme.colors.highlight}33`,
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#a0a0a0',
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Field>
            <ButtonRow>
              <Button type="button" onClick={handleSave}>Save Changes</Button>
              <Button type="button" danger onClick={handleDelete}>Delete Project</Button>
            </ButtonRow>
          </ModalContainer>
        </Overlay>
      )}

      {showDeleteConfirm && (
        <Overlay onClick={() => setShowDeleteConfirm(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deletion</h3>
            <p>Type <strong>{projectName}</strong> to confirm deletion.</p>
            <Field>
              <Input
                placeholder="Enter project name"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
              />
            </Field>
            <ButtonRow>
              <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button
                danger
                disabled={deleteInput !== projectName}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
            </ButtonRow>
          </ModalContainer>
        </Overlay>
      )}
    </>
  );
};

export default ProjectInfo;
