export const theme = {
  colors: {

    textPrimary: '#ffffff',
    mobileTextPrimary: '#ffffff',
    textSecondary: '#b5b5b5',
    white: '#fff',
    highlight: '#01b0ef',
    background: '#f5f5f5',

    //header
    header: '#000',
    bgHeader: '#fff',

    //feature
    featureTitle: '#000',
    featureSubtitle: '#b5b5b5',

    //footer
    linksTitle: '#000',
    links: '#666',
    

    // glass effects
    glassBackground: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassBackgroundMobile: 'rgba(255, 255, 255, 0.1)',
    glassBorderMobile: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
    boxShadowHover: '0px 8px 40px rgba(0, 0, 0, 0.15)',
    loadingBackground: 'rgba(0, 0, 0, 0.5)',
    loadingText: '#fff',
    loadingSpinnerBorder: '#f3f3f3',
    loadingSpinnerBorderTop: '#3498db',
  },
  blur: {
    regular: '12px',
    mobile: '8px',
  },
  fonts: {
    thin: '"Poppins-Thin", Helvetica, sans-serif',
    light: '"Poppins-Light", Helvetica, sans-serif',
    regular: '"Poppins-Regular", Helvetica, sans-serif',
    medium: '"Poppins-Medium", Helvetica, sans-serif',
    bold: '"Poppins-Bold", Helvetica, sans-serif',
    black: '"Poppins-Black", Helvetica, sans-serif',
    italic: '"Poppins-Italic", Helvetica, sans-serif',
    mediumItalic: '"Poppins-MediumItalic", Helvetica, sans-serif',
    boldItalic: '"Poppins-BoldItalic", Helvetica, sans-serif',
  },
  spacing: {
    headerHeight: '70px',
    freeSpaceHeight: '300px',
    freeSpaceMarginTop: '200px',
  },
  gradients: {
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    stickyHeader: 'linear-gradient(to right, rgba(13, 13, 13, 0.7), rgba(33, 33, 33, 0.8))',
  },
  zIndex: {
    stickyHeader: 999,
    loadingScreen: 9999,
  },
  animations: {
    spin: 'spin 1s linear infinite',
  },
};


export const darkTheme = {
  colors: {

    textPrimary: '#000',
    mobileTextPrimary: '#ffffff',
    textSecondary: '#b5b5b',
    white: '#fff',
    highlight: '#01b0ef',
    background: '#121212',

    //header
    header: '#fff',
    bgHeader: 'rgba(0, 0, 0, 0.3)', // This will be a transparent background
    backdropFilter: 'blur(8px)', // Apply the blur effect (glassmorphism effect)
    '-webkit-backdrop-filter': 'blur(8px)', // For Safari support

    //feature
    featureTitle: '#fff',
    featureSubtitle: '#fff',
    
    //footer
    linksTitle: '#fff',
    links: '#66aaff',
    
    // glass effects
    glassBackground: 'rgba(0, 0, 0, 0.12)', // Darker glass effect
    glassBorder: 'rgba(0, 0, 0, 0.2)', // Darker border for glass effect
    glassBackgroundMobile: 'rgba(0, 0, 0, 0.1)', // Darker glass effect for mobile
    glassBorderMobile: 'rgba(0, 0, 0, 0.15)', // Darker mobile border for glass effect
    boxShadow: '0px 4px 30px rgba(255, 255, 255, 0.1)', // Lighter box shadow
    boxShadowHover: '0px 8px 40px rgba(255, 255, 255, 0.15)', // Lighter hover shadow
    loadingBackground: 'rgba(0, 0, 0, 0.8)', // Darker background for loading screen
    loadingText: '#fff', // White text on loading screen
    loadingSpinnerBorder: '#333', // Darker spinner border
    loadingSpinnerBorderTop: '#3498db', // Bright blue spinner top
  },
  blur: {
    regular: '12px',
    mobile: '8px',
  },
  fonts: {
    thin: '"Poppins-Thin", Helvetica, sans-serif',
    light: '"Poppins-Light", Helvetica, sans-serif',
    regular: '"Poppins-Regular", Helvetica, sans-serif',
    medium: '"Poppins-Medium", Helvetica, sans-serif',
    bold: '"Poppins-Bold", Helvetica, sans-serif',
    black: '"Poppins-Black", Helvetica, sans-serif',
    italic: '"Poppins-Italic", Helvetica, sans-serif',
    mediumItalic: '"Poppins-MediumItalic", Helvetica, sans-serif',
    boldItalic: '"Poppins-BoldItalic", Helvetica, sans-serif',
  },
  spacing: {
    headerHeight: '70px',
    freeSpaceHeight: '300px',
    freeSpaceMarginTop: '200px',
  },
  gradients: {
    background: 'linear-gradient(135deg, #121212, #1f1f1f, #2a2a2a)', // Dark gradient background
    stickyHeader: 'linear-gradient(to right, rgba(13, 13, 13, 0.7), rgba(33, 33, 33, 0.8))', // Same sticky header gradient
  },
  zIndex: {
    stickyHeader: 999,
    loadingScreen: 9999,
  },
  animations: {
    spin: 'spin 1s linear infinite',
  },
};