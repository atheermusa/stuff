const colors = {
    reset: '\x1b[0m',
    // Function to convert hex to RGB true color code
    hex: (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[38;2;${r};${g};${b}m`;
    },
    // Function for background colors
    bgHex: (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[48;2;${r};${g};${b}m`;
    }
  };
  
  // Define our exact colors
  colors.black = colors.hex('#000000');  // Pure black for the silhouette
  colors.bgGreen = colors.bgHex('#4CD783');  // The exact mint green from the image
  colors.green = colors.hex('#4CD783');  // For any foreground elements that need the green
  colors.lightShade = colors.hex('#333333');  // Very dark gray for subtle highlights
  
  module.exports = colors;
  