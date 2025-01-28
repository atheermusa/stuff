const { Command } = require('commander');
const inquirer = require('inquirer');
const HorseAnimator = require('./animated-horse');
const colors = require('./colors');

class InteractiveCLI {
  constructor() {
    this.horse = new HorseAnimator();
  }

  async ask(question) {
    // Move cursor below animation before asking question
    process.stdout.write('\n\n\n');
    
    return new Promise((resolve) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'answer',
          message: question
        }
      ]).then((answers) => {
        resolve(answers.answer.trim());
      });
    });
  }

  cleanup() {
    this.horse.stopAnimation();
    process.stdout.write('\x1b[?25h'); // Show cursor
    process.exit(0);
  }

  clearScreenAndShowMessage(message) {
    this.horse.clearScreen();
    console.log(colors.darkGreen + message + colors.reset + '\n');
  }

  async run() {
    try {
      // Show intro animation and wait for key press
      await this.horse.playIntro();
      
      // Get user's name with extra spacing
      const name = await this.ask('\n\nWhat\'s your name? ');
      
      // Show welcome message
      this.clearScreenAndShowMessage(`\nWelcome ${name}! 👋\n`);
      
      // Ask follow-up question
      const experience = await this.ask('What brings you here today?\n> ');
      
      // Show final message
      console.log(colors.darkGreen + '\nGreat to have you here! Let me help you with that.\n' + colors.reset);
      
      // Cleanup and exit
      this.cleanup();
    } catch (error) {
      console.error('Error:', error);
      this.cleanup();
    }
  }
}

// Handle interrupts
process.on('SIGINT', () => {
  console.log('\nGoodbye! 👋');
  process.exit(0);
});

// Proper error handling and process management
process.on('uncaughtException', (err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});

async function askQuestions() {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'What would you like to do?',
      choices: ['Create a component', 'Create a page', 'Exit']
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name?',
      when: (answers) => answers.type !== 'Exit'
    }
  ];

  const answers = await inquirer.prompt(questions);
  
  if (answers.type === 'Exit') {
    process.exit(0);
  }

  // Process the answers
  const result = processAnswers(answers);
  console.log('\nCreating...', result);
}

function processAnswers(answers) {
  const { type, name } = answers;
  
  // Simple example - you can expand this based on your needs
  return {
    message: `Created new ${type.toLowerCase()}: ${name}`,
    type: type,
    name: name
  };
}

async function startCli() {
  const program = new Command();
  const horse = new HorseAnimator();
  
  await horse.playIntro();
  
  program
    .name('your-cli-name')
    .description('Your CLI description')
    .version('1.0.0')
    .action(async () => {
      await askQuestions();
    });

  program.parse();
}

// Start the CLI
startCli().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});