const colors = {
    reset: '\x1b[0m',
    hex: (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[38;2;${r};${g};${b}m`;
    },
    bgHex: (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[48;2;${r};${g};${b}m`;
    }
  };
  
  // Define our exact colors from the image
  colors.black = colors.hex('#000000');      // Pure black for the silhouette
  colors.darkGreen = colors.hex('#2B614D');  // Dark green for the accent stripe
  colors.bgWhite = colors.bgHex('#4CD783');  // White background
  
  module.exports = colors;