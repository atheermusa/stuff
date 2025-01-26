const HorseAnimator = require('./animated-horse');

const run = async () => {
  const horse = new HorseAnimator();
  await horse.startAnimation();
};

run().catch(console.error);
