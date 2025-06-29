import React, { useState, useRef, useEffect } from 'react';
import ProjectModal from '../modals/ProjectModal';
import ProjectListModal from '../modals/ProjectListModal';
import styled from 'styled-components';
import { createProject, fetchUserProjects } from '../../api/projectAPI'; // ⬅️ import your API utility
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


const Wrapper = styled.div`
  position: fixed;
  top: 1.15rem;
  left: 1.5rem;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
`;

const MenuButton = styled.button`
  background: #ffffff;
  border: 1px solid #ccc;
  font-size: 1em;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const Dropdown = styled.div`
  margin-top: 0.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? '#e53935' : '#333')};
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $danger }) => ($danger ? '#fdecea' : '#e6f7ff')};
  }
`;

const SubDropdown = styled.div`
  position: absolute;
  top: 3.5rem;
  left: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  margin-left: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.2s ease;
`;

const SubMenuItem = styled(MenuItem)`
  padding: 0.6rem 1rem;
`;

const LoadingModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  font-size: 1.5rem;
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

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: projectName,
        chartType,
        description,
      };

      const created = await createProject(payload, token); // 👈 This already throws an error with backend message

      // Save to localStorage
      localStorage.setItem("projectId", created._id);
      localStorage.setItem("projectName", projectName);
      localStorage.setItem("chartType", chartType);

      if (onNew) {
        onNew({ name: projectName, chartType, description });
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
      setChartType('12');
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
      console.error("❌ Map reference is not available.");
      return;
    }

    if (!features?.features?.length) {
      alert("⚠️ No features to export.");
      return;
    }

    const bounds = [
      [110, 0],
      [141, 27],
    ];

    setIsExporting(true); // Show loading modal

    map.fitBounds(bounds, {
      padding: 10,
      duration: 0,
    });

    const onIdle = () => {
      map.off("idle", onIdle); // remove listener

      try {
        const canvas = map.getCanvas();
        const dataURL = canvas.toDataURL("image/png");

        const imgLink = document.createElement("a");
        imgLink.href = dataURL;
        imgLink.download = `map-screenshot-${Date.now()}.png`;
        document.body.appendChild(imgLink);
        imgLink.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(imgLink);

        const geojsonData = JSON.stringify(features, null, 2);
        const blob = new Blob([geojsonData], { type: "application/geo+json" });
        const url = URL.createObjectURL(blob);

        const geojsonLink = document.createElement("a");
        geojsonLink.href = url;
        geojsonLink.download = `features-${Date.now()}.geojson`;
        document.body.appendChild(geojsonLink);
        geojsonLink.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(geojsonLink);

        URL.revokeObjectURL(url);

        console.log("✅ Export complete.");
      } catch (err) {
        console.error("❌ Export failed:", err);
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
        />
      )}

      {showProjectList && (
        <ProjectListModal
          visible={showProjectList}
          projects={projects}
          onClose={() => setShowProjectList(false)}
          onSelect={(proj) => {
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
