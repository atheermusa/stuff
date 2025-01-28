const fs = require('fs').promises;
const path = require('path');
const colors = require('./colors');

class HorseAnimator {
  constructor() {
    this.frames = [];
    this.logo = '';
    this.isRunning = false;
    this.currentInterval = null;
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
      .replace(/\./g, ' ')
      .replace(/=/g, `${colors.darkGreen}*${colors.reset}`)
      .replace(/[@#%\-+:*]/g, `${colors.black}*${colors.reset}`);
  }

  colorizeLogo(text) {
    return text
      .replace(/\./g, ' ')
      .replace(/\[|\]/g, str => `${colors.darkGreen}${str}${colors.reset}`)
      .replace(/={2,}/g, str => `${colors.darkGreen}${str}${colors.reset}`)
      .replace(/-{2,}/g, str => `${colors.darkGreen}${str}${colors.reset}`)
      .replace(/CANCARA|DESIGN SYSTEM CLI/g, str => `${colors.black}${str}${colors.reset}`);
  }

  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[H');
  }

  async playIntro() {
    await Promise.all([this.loadFrames(), this.loadLogo()]);
    let frameIndex = 0;
    this.isRunning = true;

    this.clearScreen();
    
    this.currentInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      // Move cursor to top
      process.stdout.write('\x1b[H');
      
      // Draw frame
      const frame = this.frames[frameIndex] + '\n' + this.logo;
      process.stdout.write(frame);
      
      // Add "Press any key to continue" message
      process.stdout.write('\n\n\x1b[36mPress any key to continue...\x1b[0m');
      
      frameIndex = (frameIndex + 1) % this.frames.length;
    }, 100);

    // Set up key press listener
    return new Promise(resolve => {
      const cleanup = () => {
        this.stopAnimation();
        process.stdin.removeAllListeners('data');
        process.stdin.setRawMode(false);
        // Don't pause stdin as we need it for inquirer
        this.clearScreen();
        resolve();
      };

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', (data) => {
        // Exit on Ctrl+C
        if (data.toString() === '\u0003') {
          process.exit();
        }
        cleanup();
      });
    });
  }

  stopAnimation() {
    this.isRunning = false;
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }
}

module.exports = HorseAnimator;