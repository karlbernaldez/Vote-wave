import React, { useState, useRef, useEffect } from 'react';
import ProjectModal from '../modals/ProjectModal';
import ProjectListModal from '../modals/ProjectListModal';
import styled from 'styled-components';
import { createProject, fetchUserProjects } from '../../api/projectAPI'; // ⬅️ import your API utility
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// eslint-disable-next-line
const MySwal = withReactContent(Swal);


export const Wrapper = styled.div`
  position: fixed;
  top: 1.15rem;
  left: 1.5rem;
  z-index: ${({ theme }) => theme.zIndex.stickyHeader};
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const MenuButton = styled.button`
  background: ${({ theme }) => theme.colors.lightBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  padding: 0.45rem 0.9rem;
  font-size: 0.95rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transform: scale(1.03);
  }
`;

export const Dropdown = styled.div`
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.lightBackground};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ddd'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  min-width: 180px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

export const MenuItem = styled.button`
  background: transparent;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  color: ${({ $danger, theme }) =>
    $danger ? theme.mainColors.blue : theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const SubDropdown = styled.div`
  position: absolute;
  top: 3.5rem;
  left: 100%;
  margin-left: 0.5rem;
  background: ${({ theme }) => theme.colors.lightBackground};
  border: 1px solid ${({ theme }) => theme.colors.border || '#ccc'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  flex-direction: column;
  min-width: 160px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

export const SubMenuItem = styled(MenuItem)`
  padding: 0.65rem 1rem;
`;

export const LoadingModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: ${({ theme }) => theme.colors.loadingBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.loadingScreen};
  color: ${({ theme }) => theme.colors.loadingText};
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  user-select: none;
`;

const ProjectMenu = ({ onNew, onSave, onView, onExport, mapRef, features }) => {
  const [mainOpen, setMainOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [showProjectList, setShowProjectList] = useState(false);
  const [description, setDescription] = useState('');
  const [chartType, setChartType] = useState('12');
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);
  const [forecastDate, setForecastDate] = useState('');

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleCreateProject = async () => {
    // Validation
    if (!projectName.trim()) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Project Name is required!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!forecastDate) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Forecast Date is required!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: projectName,
        chartType,
        description,
        forecastDate
      };

      const created = await createProject(payload, token); // 👈 This already throws an error with backend message

      // Save to localStorage
      localStorage.setItem("projectId", created._id);
      localStorage.setItem("projectName", projectName);
      localStorage.setItem("chartType", chartType);

      if (onNew) {
        onNew({ name: projectName, chartType, description, forecastDate });
      }

      // ✅ Success Toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Project "${projectName}" created successfully`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Cleanup
      setShowModal(false);
      setMainOpen(false);
      setProjectOpen(false);
      setProjectName('');
      setChartType('');
      setDescription('');

      // Refresh
      setTimeout(() => window.location.reload(), 1500);

    } catch (err) {
      // ❌ Error Toast using backend message
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const exportMapImageAndGeoJSON = () => {
    const map = mapRef?.current;
    if (!map) {
      alert("⚠️ Map is not ready yet.");
      return;
    }

    if (!features?.features?.length) {
      alert("⚠️ No features to export.");
      return;
    }

    const bound = map.getBounds();
    console.log("Current Map Bounds:", bound);

    // eslint-disable-next-line
    const TCID = [
      [97.10652951545882, -0.29008965128676323],   // Southwest (sw)
      [160.14948511399922, 27.23891969842279],      // Northeast (ne)
    ];

    // eslint-disable-next-line
    const TCAD = [
      [99.79339501828959, 3.757304989541903],    // Southwest (sw)
      [153.8595159535438, 27.162621752400347],    // Northeast (ne)
    ];

    const PAR = [
      [99.66367446788888, 4.933531648734785],   // Southwest (sw)
      [145.49962576487303, 24.92089153280473],  // Northeast (ne)
    ];

    const bounds = PAR

    setIsExporting(true); // Show loading modal

    map.fitBounds(bounds, {
      padding: 10,
      duration: 0,
    });

    const onIdle = () => {
      map.off("idle", onIdle);

      console.log(map.getStyle().layers)

      try {
        const canvas = map.getCanvas();
        const dataURL = canvas.toDataURL("image/png");
        const projectName = localStorage.getItem("projectName");

        const imgLink = document.createElement("a");
        imgLink.href = dataURL;
        imgLink.download = projectName;
        document.body.appendChild(imgLink);
        imgLink.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(imgLink);

        const geojsonData = JSON.stringify(features, null, 2);
        const blob = new Blob([geojsonData], { type: "application/geo+json" });
        const url = URL.createObjectURL(blob);

        const geojsonLink = document.createElement("a");
        geojsonLink.href = url;
        geojsonLink.download = `${projectName}.geojson`;
        document.body.appendChild(geojsonLink);
        geojsonLink.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(geojsonLink);

        URL.revokeObjectURL(url);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Export successful!`,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: `Export failed: ${err.message}`,
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        setIsExporting(false); // Hide loading modal
      }
    };

    map.on("idle", onIdle);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMainOpen(false);
        setProjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper ref={menuRef}>
      <MenuButton onClick={() => {
        setMainOpen(!mainOpen);
        setProjectOpen(false);
      }}>
        ☰
      </MenuButton>

      {mainOpen && (
        <Dropdown>
          <MenuItem onClick={() => setProjectOpen(!projectOpen)} aria-expanded={projectOpen}>
            Project
          </MenuItem>
          {projectOpen && (
            <SubDropdown>
              <SubMenuItem onClick={() => setShowModal(true)}>New Project</SubMenuItem>
              <SubMenuItem onClick={async () => {
                try {
                  const token = localStorage.getItem("authToken");
                  const userProjects = await fetchUserProjects(token);
                  setProjects(userProjects);
                  setShowProjectList(true);
                } catch (err) {
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to load projects',
                    showConfirmButton: false,
                    timer: 2500,
                  });
                }
              }}>
                Open Project
              </SubMenuItem>
              <SubMenuItem onClick={exportMapImageAndGeoJSON}>Export Project</SubMenuItem>
            </SubDropdown>
          )}
          <MenuItem onClick={onView}>View</MenuItem>
          <MenuItem onClick={onExport}>Export</MenuItem>
          <MenuItem onClick={logout} $danger>Logout</MenuItem>
        </Dropdown>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateProject}
          projectName={projectName}
          setProjectName={setProjectName}
          chartType={chartType}
          setChartType={setChartType}
          description={description}
          setDescription={setDescription}
          forecastDate={forecastDate}
          setForecastDate={setForecastDate}
        />
      )}

      {showProjectList && (
        <ProjectListModal
          visible={showProjectList}
          projects={projects}
          onClose={() => setShowProjectList(false)}
          onSelect={(proj) => {
            console.log("Selected project:", proj);
            localStorage.setItem("projectId", proj._id);
            localStorage.setItem("projectName", proj.name);
            localStorage.setItem("chartType", proj.chartType || '12');

            if (onSave) onSave(proj);

            setMainOpen(false);
            setProjectOpen(false);
            setShowProjectList(false);
          }}
        />
      )}

      {isExporting && (
        <LoadingModal>
          Exporting map, please wait...
        </LoadingModal>
      )}
    </Wrapper>
  );
};

export default ProjectMenu;
