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
  width: "260px",
  maxHeight: isCollapsed ? "50px" : "320px",
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
  padding: `${theme.spacing.xsmall} ${theme.spacing.small}`,
  borderRadius: theme.borderRadius.small,
  cursor: "pointer",
  width: "100%",
  fontFamily: theme.fonts.medium,
  fontSize: theme.fontSizes.small,
  transition: "background-color 0.3s ease",
  '&:hover': {
    backgroundColor: theme.mainColors.blueHover || "#2563eb",
  },
});

export const listStyle = (theme) => ({
  listStyle: "none",
  margin: 0,
  padding: 0,
  color: theme.colors.textPrimary,
  fontFamily: theme.fonts.light,
  fontSize: theme.fontSizes.small,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xsmall,
});

// 👇 NEW: Style each list item
export const listItemStyle = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${theme.spacing.xsmall} ${theme.spacing.small}`,
  border: `1px solid ${theme.colors.border || "#e5e7eb"}`,
  borderRadius: theme.borderRadius.small,
  backgroundColor: theme.colors.itemBackground || "#f9fafb",
  transition: "background-color 0.2s ease",
  cursor: "pointer",
  '&:hover': {
    backgroundColor: theme.colors.hoverBackground || "#f1f5f9",
  },
});

export const footerStyle = (theme) => ({
  textAlign: "center",
  marginTop: theme.spacing.small,
  color: theme.colors.textSecondary,
  fontFamily: theme.fonts.thin,
  fontSize: theme.fontSizes.xsmall,
});
