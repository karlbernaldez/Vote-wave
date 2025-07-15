// src/components/utils/ProjectMenuUtils.js
import JSZip from 'jszip';
import Swal from 'sweetalert2';
import { createProject } from '../../../api/projectAPI';

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const handleCreateProject = async ({
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
  setDescription,
}) => {
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
      forecastDate,
    };

    const created = await createProject(payload, token);

    localStorage.setItem("projectId", created._id);
    localStorage.setItem("projectName", projectName);
    localStorage.setItem("chartType", chartType);
    localStorage.setItem("forecastDate", forecastDate);

    if (onNew) {
      onNew({ name: projectName, chartType, description, forecastDate });
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Project "${projectName}" created successfully`,
      showConfirmButton: false,
      timer: 2000,
    });

    setShowModal(false);
    setMainOpen(false);
    setProjectOpen(false);
    setProjectName('');
    setChartType('');
    setDescription('');

    setTimeout(() => window.location.reload(), 1500);
  } catch (err) {
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

export const exportMapImageAndGeoJSON = async ({ mapRef, features, setIsExporting }) => {
  const map = mapRef?.current;
  if (!map) {
    alert("⚠️ Map is not ready yet.");
    return;
  }

  if (!features || !features.features || features.features.length === 0) {
    alert("⚠️ Please reload page to export.");
    window.location.reload();
    return;
  }

  const bounds = [
    [99.79339501828959, 3.757304989541903],
    [153.8595159535438, 27.162621752400347],
  ];

  const TCID = [
    [97.10652951545882, -0.29008965128676323],   // Southwest (sw)
    [160.14948511399922, 27.23891969842279],      // Northeast (ne)
  ];

  const TCAD = [
    [99.79339501828959, 3.757304989541903],    // Southwest (sw)
    [153.8595159535438, 27.162621752400347],    // Northeast (ne)
  ];

  const PAR = [
    [99.66367446788888, 4.933531648734785],   // Southwest (sw)
    [145.49962576487303, 24.92089153280473],  // Northeast (ne)
  ];

  setIsExporting(true);

  map.fitBounds(bounds, {
    padding: 10,
    duration: 0,
  });

  const onIdle = async () => {
    map.off("idle", onIdle);

    try {
      const light = map.getCanvas();
      const lightdataURL = light.toDataURL("image/png");
      const lightBlob = await (await fetch(lightdataURL)).blob();

      const geojsonData = JSON.stringify(features, null, 2);
      const geojsonBlob = new Blob([geojsonData], {
        type: "application/geo+json",
      });

      const projectName = localStorage.getItem("projectName") || "export";

      // Create a zip with JSZip
      const zip = new JSZip();
      zip.file(`${projectName}.png`, lightBlob);
      zip.file(`${projectName}.geojson`, geojsonBlob);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);

      const zipLink = document.createElement("a");
      zipLink.href = zipUrl;
      zipLink.download = `${projectName}.zip`;
      document.body.appendChild(zipLink);
      zipLink.click();
      document.body.removeChild(zipLink);
      URL.revokeObjectURL(zipUrl);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Export successful!`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: `Export failed: ${err.message}`,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  map.on("idle", onIdle);
};