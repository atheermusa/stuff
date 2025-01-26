const fs = require('fs').promises;
const path = require('path');

class HorseAnimator {
  constructor() {
    this.frames = [];
    this.originalHorse = '';
  }

  async loadHorse() {
    try {
      this.originalHorse = await fs.readFile(path.join(__dirname, 'horse.txt'), 'utf8');
      this.createFrames();
    } catch (error) {
      console.error('Error loading horse ASCII art:', error);
      process.exit(1);
    }
  }

  colorize(text) {
    // Define colors inline for simplicity during testing
    const black = '\x1b[38;2;0;0;0m';
    const bgGreen = '\x1b[48;2;76;215;131m';
    const lightShade = '\x1b[38;2;51;51;51m';
    const reset = '\x1b[0m';

    return text
      .replace(/@/g, `${black}█${reset}`)
      .replace(/#/g, `${black}█${reset}`)
      .replace(/%/g, `${lightShade}█${reset}`)
      .replace(/\*/g, `${bgGreen} ${reset}`);
  }

  createFrames() {
    const baseFrame = this.originalHorse.split('\n');
    
    // Frame 1: Back legs gathered, front legs extended
    const frame1 = baseFrame.map((line, index) => {
      // Clear back legs
      if (index === 21 || index === 22) {
        return line.replace(/[@#%]/g, ' ');
      }
      return line;
    });
    
    // Frame 2: All legs gathered
    const frame2 = baseFrame.map((line, index) => {
      // Clear all leg positions
      if (index >= 21 && index <= 24) {
        return line.replace(/[@#%]/g, ' ');
      }
      return line;
    });
    
    // Frame 3: Back legs extended, front legs gathered
    const frame3 = baseFrame.map((line, index) => {
      // Clear front legs
      if (index === 23 || index === 24) {
        return line.replace(/[@#%]/g, ' ');
      }
      return line;
    });
    
    // Frame 4: Return to starting position for smooth loop
    const frame4 = [...frame1];

    // Apply colors to each frame
    this.frames = [
      this.colorize(frame1.join('\n')),
      this.colorize(frame2.join('\n')),
      this.colorize(frame3.join('\n')),
      this.colorize(frame4.join('\n'))
    ];

    // Log first frame for debugging
    console.log("Frame 1 preview:");
    console.log(this.frames[0]);
  }

  clearConsole() {
    process.stdout.write('\x1Bc');
  }

  async startAnimation(speed = 400) {  // Much slower animation
    await this.loadHorse();
    let frameIndex = 0;
    
    console.log('Press Ctrl+C to exit');
    
    // Add short delay before starting animation
    setTimeout(() => {
      const interval = setInterval(() => {
        this.clearConsole();
        process.stdout.write(this.frames[frameIndex]);
        process.stdout.write(`\n\nFrame ${frameIndex + 1} of ${this.frames.length}`);  // Debug info
        frameIndex = (frameIndex + 1) % this.frames.length;
      }, speed);
    }, 1000);
  }
}

module.exports = HorseAnimator;