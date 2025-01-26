const fs = require('fs').promises;
const path = require('path');
const colors = require('./colors');

class HorseAnimator {
  constructor() {
    this.frames = [];
    this.logo = '';
  }

  async loadLogo() {
    try {
      const logoContent = await fs.readFile(path.join(__dirname, 'logo.txt'), 'utf8');
      this.logo = this.colorizeLogo(logoContent);
    } catch (error) {
      console.error('Error loading logo:', error);
      process.exit(1);
    }
  }

  async loadFrames() {
    try {
      // Load all 9 horse frames
      const frames = await Promise.all(
        Array.from({ length: 9 }, (_, i) => i + 1).map(async (num) => {
          const content = await fs.readFile(path.join(__dirname, `horse${num}.txt`), 'utf8');
          return this.colorizeHorse(content);
        })
      );
      this.frames = frames;
    } catch (error) {
      console.error('Error loading horse frames:', error);
      process.exit(1);
    }
  }

  colorizeHorse(text) {
    return text
      .replace(/\./g, `${colors.bgWhite} ${colors.reset}`)  // White background
      .replace(/=/g, `${colors.darkGreen}█${colors.reset}`) // Dark green accent stripe
      .replace(/[@#%\-+:*]/g, `${colors.black}█${colors.reset}`); // Black silhouette
  }

  colorizeLogo(text) {
    return text
      .replace(/\./g, ' ')  // Background spaces
      .replace(/\[|\]/g, str => `${colors.darkGreen}${str}${colors.reset}`)  // Brackets in green
      .replace(/={2,}/g, str => `${colors.darkGreen}${str}${colors.reset}`)  // Equals in green
      .replace(/-{2,}/g, str => `${colors.darkGreen}${str}${colors.reset}`)  // Hyphens in green
      .replace(/CANCARA|DESIGN SYSTEM CLI/g, str => `${colors.black}${str}${colors.reset}`);  // Text in black
  }

  clearConsole() {
    // Use alternative screen buffer
    process.stdout.write('\x1b[?1049h');
    // Move cursor to top-left
    process.stdout.write('\x1b[H');
  }

  cleanup() {
    // Return to main screen buffer
    process.stdout.write('\x1b[?1049l');
  }

  async startAnimation(speed = 100) {
    await Promise.all([this.loadFrames(), this.loadLogo()]);
    let frameIndex = 0;
    
    console.log('Press Ctrl+C to exit');
    
    // Switch to alternative screen buffer at start
    process.stdout.write('\x1b[?1049h');
    
    // Handle cleanup on exit
    const cleanup = () => {
      this.cleanup();
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    setInterval(() => {
      // Just move cursor to top instead of clearing
      process.stdout.write('\x1b[H');
      // Build entire frame in memory before writing
      const frame = this.frames[frameIndex] + '\n' + this.logo;
      process.stdout.write(frame);
      frameIndex = (frameIndex + 1) % this.frames.length;
    }, speed);
  }
}

module.exports = HorseAnimator;