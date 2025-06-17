// LayerPanelStyles.js
export const panelStyle = (theme, isCollapsed) => ({
    position: "absolute",
    bottom: theme.spacing.large,
    right: theme.spacing.xsmall,
    backgroundColor: theme.colors.lightBackground,
    border: '1px solid #d1d5db',
    color: theme.colors.textPrimary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.xlarge,
    zIndex: theme.zIndex.stickyHeader,
    width: "250px",
    maxHeight: isCollapsed ? "50px" : "300px",
    overflowY: isCollapsed ? "hidden" : "auto",
    boxShadow: theme.colors.boxShadow,
    transition: "max-height 0.3s ease-in-out",
    fontFamily: theme.fonts.regular,
  });
  
  export const headerStyle = (theme, isCollapsed) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.medium,
    marginBottom: isCollapsed ? "0" : theme.spacing.small,
    cursor: "pointer",
    color: theme.colors.textPrimary,
  });
  
  export const buttonStyle = (theme) => ({
    backgroundColor: theme.mainColors.blue,
    color: theme.mainColors.white,
    border: "none",
    padding: theme.spacing.xsmall,
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    width: "100%",
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    transition: "background-color 0.3s ease",
  });
  
  export const listStyle = (theme) => ({
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    color: theme.colors.textPrimary,
    borderBottom: '1px solid #ccc',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontFamily: theme.fonts.light,
  });
  
  export const footerStyle = (theme) => ({
    textAlign: "center",
    marginTop: theme.spacing.small,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.thin,
    fontSize: theme.fontSizes.xsmall,
  });
  