import Swal from 'sweetalert2';
import ProjectModal from '../modals/ProjectModal'
import withReactContent from 'sweetalert2-react-content';
import { fetchUserProjects } from '../../api/projectAPI';
import ProjectListModal from '../modals/ProjectListModal';
import React, { useState, useRef, useEffect } from 'react';
import { Wrapper, MenuButton, Dropdown, MenuItem, SubDropdown, SubMenuItem, LoadingModal } from './styles/ProjectMenu';
import { logout, handleCreateProject as createProjectHandler, exportMapImageAndGeoJSON as exportProjectHandler, downloadCachedSnapshotZip } from './utils/ProjectUtils';

const MySwal = withReactContent(Swal);

const ProjectMenu = ({ onNew, onSave, onView, onExport, mapRef, features, isDarkMode, setIsDarkMode, setMapLoaded, isLoading }) => {
  const [mainOpen, setMainOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [showProjectList, setShowProjectList] = useState(false);
  const [description, setDescription] = useState('');
  const [chartType, setChartType] = useState('Wave Analysis');
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);
  const [forecastDate, setForecastDate] = useState('');

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
              <SubMenuItem onClick={async () => {
                downloadCachedSnapshotZip(setIsDarkMode, features);
              }}>
                Export Project
              </SubMenuItem>
            </SubDropdown>
          )}
          <MenuItem onClick={onView}>View</MenuItem>
          <MenuItem onClick={onExport}>Export</MenuItem>
          <MenuItem onClick={logout} $danger>Logout</MenuItem>
        </Dropdown>
      )}

      {showModal && (
        <ProjectModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={() =>
            createProjectHandler({
              projectName,
              chartType,
              description,
              forecastDate,
              onNew,
              setShowModal,
              setMainOpen,
              setProjectOpen,
              setProjectName,
              setChartType,
              setDescription
            })
          }
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
