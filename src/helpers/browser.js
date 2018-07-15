// Window width helpers
const WINDOW_WIDTH_MOBILE = 750;
export const getWindowWidth = () => ( Math.max(document.documentElement.clientWidth, window.innerWidth || 0) );
export const windowWidthIsMobile = ( windowWidth ) => ( windowWidth <= WINDOW_WIDTH_MOBILE );
export const currentWindowWidthIsMobile = () => ( windowWidthIsMobile( getWindowWidth() ) );
