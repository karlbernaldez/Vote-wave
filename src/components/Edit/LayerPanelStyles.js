// LayerPanelStyles.js

export const panelStyle = (isDarkMode, isCollapsed) => ({
    position: "absolute",
    bottom: "2rem",
    right: ".5rem",
    backgroundColor: isDarkMode ? "#2c3e50" : "white",
    color: isDarkMode ? "white" : "black",
    padding: "15px",
    borderRadius: "12px",
    zIndex: 100,
    width: "250px",
    maxHeight: isCollapsed ? "50px" : "300px",
    overflowY: isCollapsed ? "hidden" : "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "max-height 0.3s ease-in-out",
});

export const headerStyle = (isCollapsed) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: isCollapsed ? "0" : "10px",
    cursor: "pointer",
});

export const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
};

export const listStyle = {
    padding: 0,
    listStyleType: "none",
};

export const footerStyle = {
    textAlign: "center",
    marginTop: "10px",
};
