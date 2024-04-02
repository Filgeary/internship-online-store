import chalk from 'chalk';

export const logger = {
  info: (...messages) => console.log(chalk.italic.cyan(messages.join(' '))),
  success: (...messages) => console.log(chalk.italic.green('✨ ' + messages.join(' ') + ' \n')),
  error: (...messages) => console.log(chalk.italic.red(messages.join(' '))),
  warn: (...messages) => console.log(chalk.italic.yellow(messages.join(' '))),
};
