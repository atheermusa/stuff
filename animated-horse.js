const fs = require('fs').promises;
const path = require('path');
const colors = require('./colors');

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
    // Apply our exact colors
    return text
      .replace(/@/g, `${colors.black}█${colors.reset}`)  // Replace @ with solid block for better blending
      .replace(/#/g, `${colors.black}█${colors.reset}`)  // Use solid blocks for silhouette
      .replace(/%/g, `${colors.lightShade}█${colors.reset}`)  // Subtle highlights using blocks
      .replace(/\*/g, `${colors.bgGreen} ${colors.reset}`);  // Mint green background
  }

  createFrames() {
    const baseFrame = this.originalHorse.split('\n');
    
    // Create walking animation by modifying the front legs
    const frame1 = baseFrame.map((line, index) => {
      if (index >= 35 && index <= 38) {
        return line.replace(/\+/g, ' ').replace(/@/g, '+');
      }
      return line;
    });

    const frame2 = baseFrame.map((line, index) => {
      if (index >= 35 && index <= 38) {
        return line.replace(/\+/g, ' ').replace(/@/g, '*');
      }
      return line;
    });

    // Apply colors to each frame
    this.frames = [
      this.colorize(baseFrame.join('\n')),
      this.colorize(frame1.join('\n')),
      this.colorize(frame2.join('\n'))
    ];
  }

  clearConsole() {
    process.stdout.write('\x1Bc');
  }

  async startAnimation(speed = 200) {
    await this.loadHorse();
    let frameIndex = 0;
    
    console.log('Press Ctrl+C to exit');
    
    setInterval(() => {
      this.clearConsole();
      process.stdout.write(this.frames[frameIndex]);
      frameIndex = (frameIndex + 1) % this.frames.length;
    }, speed);
  }
}

module.exports = HorseAnimator;
