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

export const exportMapImageAndGeoJSON = async ({
  mapRef,
  features,
  setIsExporting,
  setIsDarkMode,
  isDarkMode,
  setMapLoaded,
  getIsLoading,
}) => {
  const map = mapRef?.current;
  const projectName = localStorage.getItem("projectName") || "export";

  if (!map) {
    return Swal.fire("Map Not Ready", "⚠️ Map is not ready yet.", "warning");
  }

  if (!features?.features?.length) {
    return Swal.fire("No Features", "⚠️ No features to export.", "warning").then(() => {
      window.location.reload();
    });
  }

  const bounds = [
    [99.79339501828959, 3.757304989541903],
    [153.8595159535438, 27.162621752400347],
  ];

  const waitForIdle = (mapInstance) =>
    new Promise((resolve) => {
      const handler = () => {
        mapInstance.off("idle", handler);
        resolve();
      };
      mapInstance.on("idle", handler);
    });

  const waitUntil = async (conditionFn, timeout = 10000, interval = 100) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        if (conditionFn()) return resolve(true);
        if (Date.now() - start >= timeout)
          return reject(new Error("Timed out waiting for condition"));
        setTimeout(check, interval);
      };
      check();
    });
  };

  const captureScreenshot = async (mapInstance) => {
    let canvas = mapInstance.getCanvas();

    // Retry if canvas is not ready
    let retries = 0;
    const maxRetries = 10;
    while ((!canvas || canvas.width === 0 || canvas.height === 0) && retries < maxRetries) {
      await new Promise((r) => setTimeout(r, 200));
      canvas = mapInstance.getCanvas();
      retries++;
    }

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas is not available or not ready");
    }

    // 🔁 Double-frame delay to ensure rendering is complete
    await new Promise((resolve) => requestAnimationFrame(() =>
      requestAnimationFrame(resolve)
    ));

    const dataURL = canvas.toDataURL("image/png");
    return await (await fetch(dataURL)).blob();
  };

  const downloadZip = async (files, zipName) => {
    const zip = new JSZip();
    files.forEach(([name, blob]) => zip.file(name, blob));

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  try {
    setIsExporting(true);
    Swal.fire({
      title: "Exporting Map...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    console.log("[Export] Fitting map to bounds...");
    map.fitBounds(bounds, { padding: 10, duration: 0 });
    await waitForIdle(map);

    const currentTheme = isDarkMode ? "dark" : "light";
    console.log(`[Export] Capturing ${currentTheme} mode image...`);
    const firstImage = await captureScreenshot(map);

    console.log("[Export] Toggling theme...");
    if (typeof setMapLoaded === "function") setMapLoaded(false);
    setIsDarkMode((prev) => !prev);

    // Just wait for isLoading to be false again
    await waitUntil(() => getIsLoading() === false, 10000, 200);
    await waitForIdle(mapRef.current);

    // Extra frame delay to ensure canvas repaint is complete
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 100)));

    const toggledTheme = currentTheme === "dark" ? "light" : "dark";
    console.log(`[Export] Capturing ${toggledTheme} mode image...`);
    const secondImage = await captureScreenshot(mapRef.current);

    console.log("[Export] Restoring original theme...");
    setIsDarkMode((prev) => !prev);

    await waitUntil(() => getIsLoading() === false, 10000, 200);
    await waitForIdle(mapRef.current);
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 100)));

    const geojson = new Blob([JSON.stringify(features, null, 2)], {
      type: "application/geo+json",
    });

    console.log("[Export] Creating ZIP...");
    await downloadZip(
      [
        [`${projectName}-${currentTheme}.png`, firstImage],
        [`${projectName}-${toggledTheme}.png`, secondImage],
        [`${projectName}.geojson`, geojson],
      ],
      `${projectName}.zip`
    );

    Swal.close();
    Swal.fire({
      toast: true,
      icon: "success",
      title: "Export successful!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (err) {
    console.error("[Export] Failed:", err);
    Swal.fire({
      icon: "error",
      title: "Export failed",
      text: err.message,
    });
  } finally {
    if (typeof setMapLoaded === "function") setMapLoaded(true);
    setIsExporting(false);
  }
};

export async function downloadCachedSnapshotZip(setIsDarkMode, features) {
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";
  const projectName = localStorage.getItem("projectName") || "map_snapshots";

  const waitForSnapshot = async (key, timeoutMs = 6000, interval = 200) => {
    const maxTries = Math.floor(timeoutMs / interval);
    for (let i = 0; i < maxTries; i++) {
      const snapshot = localStorage.getItem(key);
      if (snapshot) return true;
      await new Promise(res => setTimeout(res, interval));
    }
    return false;
  };

  // Step 0: Clear old snapshots
  localStorage.removeItem("map_snapshot_light");
  localStorage.removeItem("map_snapshot_dark");

  // Step 1: Show downloading modal
  Swal.fire({
    title: 'Downloading...',
    html: 'Please wait while we prepare the ZIP file.',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading(),
  });

  // Step 2: Toggle to opposite theme
  if (typeof setIsDarkMode === 'function') {
    setIsDarkMode(!isDarkMode);
  }

  // Step 3: Wait for opposite snapshot
  const oppositeKey = isDarkMode ? "map_snapshot_light" : "map_snapshot_dark";
  await waitForSnapshot(oppositeKey);

  // Step 4: Toggle back to original theme
  if (typeof setIsDarkMode === 'function') {
    setIsDarkMode(isDarkMode);
  }

  // Step 5: Wait for original snapshot
  const currentKey = isDarkMode ? "map_snapshot_dark" : "map_snapshot_light";
  await waitForSnapshot(currentKey);

  // Step 6: Get both snapshots
  const lightSnapshot = localStorage.getItem("map_snapshot_light");
  const darkSnapshot = localStorage.getItem("map_snapshot_dark");

  // Step 7: Prepare ZIP
  const zip = new JSZip();
  if (lightSnapshot) {
    zip.file("map_snapshot_light.png", lightSnapshot.split(',')[1], { base64: true });
  }
  if (darkSnapshot) {
    zip.file("map_snapshot_dark.png", darkSnapshot.split(',')[1], { base64: true });
  }

  // Step 8: Add GeoJSON if available
  if (features && features.type === "FeatureCollection") {
    const geojsonBlob = new Blob([JSON.stringify(features, null, 2)], {
      type: "application/geo+json",
    });
    zip.file(`${projectName}.geojson`, geojsonBlob);
  }

  const blob = await zip.generateAsync({ type: "blob" });

  // Step 9: Trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projectName.replace(/\s+/g, "_")}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Step 10: Close loading modal and show success
  Swal.close();
  Swal.fire({
    icon: 'success',
    title: 'Downloaded',
    text: 'Snapshots and GeoJSON exported as ZIP.',
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false,
    willOpen: (popup) => {
      popup.style.zIndex = '9999'; // ensure it's on top
    }
  });
}