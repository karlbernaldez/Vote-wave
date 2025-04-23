import { useState, useEffect, useRef } from "react";
import mapPin from "../assets/map-pin.svg";
import lineTool from "../assets/linetool.svg";
import polygon from "../assets/Polygon.svg";
import square from "../assets/square.svg";
import circleIcon from "../assets/circle.svg";
import text from "../assets/text.svg";
import styled from "@emotion/styled";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawCircle from "../components/draw_modes/circle.js";
import DrawLineString from '../components/draw_modes/linestring.js';
import DrawRectangle from '../components/draw_modes/rectangle.js';
import SimpleSelect from "../components/draw_modes/simple_select.js";

const ToolsContainer = styled.div`
  background-color: #ffffff;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ToolButton = styled.button`
  padding: 6px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background-color: #b0b0b0;
  }

  &.active {
    background-color: #3498db;
    color: white;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const ToolsComponent = ({ mapRef }) => {
  const [activeTool, setActiveTool] = useState(null);
  const drawRef = useRef(null); // Store the draw instance in a ref

  useEffect(() => {
    // Ensure mapRef is available and initialize the draw control
    const initializeDraw = () => {
      if (!mapRef?.current) {
        console.warn("⚠️ Map reference is not available yet.");
        return;
      }

      if (!drawRef.current) {
        drawRef.current = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          modes: {
            ...MapboxDraw.modes,
            simple_select: SimpleSelect,
            direct_select: MapboxDraw.modes.direct_select,
            draw_line_string: DrawLineString,
            draw_rectangle: DrawRectangle,
            draw_circle: DrawCircle,
          },
        });

        mapRef.current.addControl(drawRef.current);
        console.log("✅ Draw instance initialized:", drawRef.current);
      }
    };

    // Wait for mapRef to be set and then initialize draw
    const intervalId = setInterval(() => {
      if (mapRef?.current) {
        initializeDraw();
        clearInterval(intervalId); // Stop checking once initialized
      }
    }, 100); // Check every 100ms

    // Cleanup: Remove draw instance when component unmounts or mapRef changes
    return () => {
      if (drawRef.current) {
        mapRef.current.removeControl(drawRef.current);
        drawRef.current = null;
        console.log("🛑 Draw instance removed.");
      }
      clearInterval(intervalId); // Clear the interval when unmounted
    };
  }, [mapRef]); // Runs when mapRef changes

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);

    if (!drawRef.current) {
      console.warn("⚠️ Draw instance is not initialized yet.");
      return;
    }

    console.log(`🎯 Switching to tool: ${toolId}`);

    switch (toolId) {
      case "mapPin":
        console.log("📍 Activating Map Pin Tool...");
        drawRef.current.changeMode("draw_point");
        break;
      case "lineTool":
        console.log("🔵 Activating Line Tool...");
        drawRef.current.changeMode("draw_line_string");
        break;
      case "polygon":
        console.log("🔺 Activating Polygon Tool...");
        drawRef.current.changeMode("draw_polygon");
        break;
      case "square":
        console.log("🟦 Activating Square Tool...");
        drawRef.current.changeMode("draw_rectangle");
        break;
      case "circle":
        console.log("🟢 Activating Circle Mode...");
        drawRef.current.changeMode("draw_circle");
        break;
      default:
        console.log("🔄 Switching to simple_select...");
        drawRef.current.changeMode("simple_select");
        break;
    }
  };

  const tools = [
    { id: "mapPin", icon: mapPin, alt: "Map Pin" },
    { id: "lineTool", icon: lineTool, alt: "Line Tool" },
    { id: "polygon", icon: polygon, alt: "Polygon Tool" },
    { id: "square", icon: square, alt: "Square Tool" },
    { id: "circle", icon: circleIcon, alt: "Circle Tool" },
    { id: "text", icon: text, alt: "Add Text" },
  ];

  return (
    <ToolsContainer>
      {tools.map((tool) => (
        <ToolButton
          key={tool.id}
          onClick={() => handleToolClick(tool.id)}
          className={activeTool === tool.id ? "active" : ""}
        >
          <img src={tool.icon} alt={tool.alt} />
        </ToolButton>
      ))}
    </ToolsContainer>
  );
};

export default ToolsComponent;
